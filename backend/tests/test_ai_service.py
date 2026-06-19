"""Tests for AI service layer — covering Claude, Gemini, and fallbacks."""
from unittest.mock import patch, MagicMock
from app.services.ai_service import AIService

class MockResponse:
    """Mock HTTP response helper."""
    def __init__(self, json_data, status_code=200):
        self._json_data = json_data
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            raise Exception(f"HTTP Error {self.status_code}")

    def json(self):
        return self._json_data

class MockAsyncClient:
    """Mock AsyncClient context manager."""
    def __init__(self, response):
        self.response = response

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

    async def post(self, *args, **kwargs):
        return self.response

class MockAsyncClientFailure:
    """Mock AsyncClient that raises an error on post."""
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

    async def post(self, *args, **kwargs):
        raise Exception("Connection Timeout")


async def test_fallback_on_api_error():
    """API error triggers deterministic fallback."""
    service = AIService()
    with patch.object(service, "_client") as mock_client:
        mock_client.messages.create.side_effect = Exception("API down")
        insights, calories, fallback_used = await service.generate_insights({
            "pet_breed": "Bulldog",
            "pet_weight_kg": 20
        })
    assert fallback_used is True
    assert len(insights) == 3
    assert calories > 0
    assert all(isinstance(i, str) for i in insights)

async def test_fallback_insights_always_returns_three():
    """Fallback always returns exactly 3 strings and a float calories."""
    service = AIService()
    insights, calories, fallback_used = service._fallback_insights({
        "pet_breed": "Beagle",
        "pet_weight_kg": 10
    })
    assert len(insights) == 3
    assert fallback_used is True
    assert isinstance(calories, float)
    assert all(isinstance(i, str) and len(i) > 0 for i in insights)

async def test_claude_success():
    """Claude API returns successful insights and calories."""
    service = AIService()
    with patch.object(service._settings, "anthropic_api_key", "test-key"), \
         patch.object(service._settings, "use_ai", True):
        service._client = MagicMock()
        mock_response = MagicMock()
        mock_response.content = [
            MagicMock(text='{"insights": ["Insight 1", "Insight 2", "Insight 3"], "calories": 1500.0}')
        ]
        service._client.messages.create.return_value = mock_response

        insights, calories, fallback_used = await service.generate_insights({
            "pet_breed": "Labrador",
            "pet_weight_kg": 25
        })

        assert fallback_used is False
        assert insights == ["Insight 1", "Insight 2", "Insight 3"]
        assert calories == 1500.0

async def test_gemini_success():
    """Gemini API returns successful insights and calories."""
    service = AIService()
    with patch.object(service._settings, "gemini_api_key", "test-gemini-key"), \
         patch.object(service._settings, "anthropic_api_key", ""), \
         patch.object(service._settings, "use_ai", True):
        service._use_gemini = True
        service._client = None

        json_data = {
            "candidates": [{
                "content": {
                    "parts": [{
                        "text": '{"insights": ["Gemini 1", "Gemini 2", "Gemini 3"], "calories": 1200.0}'
                    }]
                }
            }]
        }
        mock_response = MockResponse(json_data, 200)
        mock_client = MockAsyncClient(mock_response)

        with patch("app.services.ai_service.httpx.AsyncClient", return_value=mock_client):
            insights, calories, fallback_used = await service.generate_insights({
                "pet_breed": "Poodle",
                "pet_weight_kg": 7
            })

            assert fallback_used is False
            assert insights == ["Gemini 1", "Gemini 2", "Gemini 3"]
            assert calories == 1200.0

async def test_gemini_failure():
    """Gemini API failure triggers deterministic fallback."""
    service = AIService()
    with patch.object(service._settings, "gemini_api_key", "test-gemini-key"), \
         patch.object(service._settings, "anthropic_api_key", ""), \
         patch.object(service._settings, "use_ai", True):
        service._use_gemini = True
        service._client = None

        mock_client = MockAsyncClientFailure()

        with patch("app.services.ai_service.httpx.AsyncClient", return_value=mock_client):
            insights, calories, fallback_used = await service.generate_insights({
                "pet_breed": "Poodle",
                "pet_weight_kg": 7
            })

            assert fallback_used is True
            assert len(insights) == 3
            assert calories > 0
