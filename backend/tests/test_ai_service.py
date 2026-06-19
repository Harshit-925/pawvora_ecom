"""Tests for AI service layer — especially the fallback path."""
from unittest.mock import patch
from app.services.ai_service import AIService

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
