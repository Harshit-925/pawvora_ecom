"""
Test suite for API routes.
Target: 85%+ coverage on all route and service files.
"""
import pytest
from httpx import AsyncClient

async def test_health_check(client: AsyncClient):
    """Health endpoint always returns 200."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

async def test_analyze_valid_input(client: AsyncClient):
    """Valid input returns typed result with insights and calories."""
    payload = {
        "session_id": "550e8400-e29b-41d4-a716-446655440000",
        "pet_species": "Dog",
        "pet_breed": "Golden Retriever",
        "pet_age_months": 36,
        "pet_weight_kg": 30.5,
        "activity_level": "Moderate"
    }
    response = await client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "ai_insights" in data
    assert isinstance(data["ai_insights"], list)
    assert len(data["ai_insights"]) > 0
    assert "recommended_calories" in data

async def test_analyze_invalid_session_id(client: AsyncClient):
    """Invalid session_id returns 422 validation error."""
    payload = {
        "session_id": "not-a-uuid",
        "pet_species": "Dog",
        "pet_breed": "Golden Retriever",
        "pet_age_months": 36,
        "pet_weight_kg": 30.5,
        "activity_level": "Moderate"
    }
    response = await client.post("/api/analyze", json=payload)
    assert response.status_code == 422

async def test_security_headers_present(client: AsyncClient):
    """All required security headers are set on every response."""
    response = await client.get("/api/health")
    assert "x-content-type-options" in response.headers
    assert "x-frame-options" in response.headers
    assert "permissions-policy" in response.headers
    assert "content-security-policy" in response.headers

async def test_fallback_when_ai_disabled(client: AsyncClient, monkeypatch):
    """Fallback rule engine returns insights when AI is off."""
    monkeypatch.setenv("USE_AI", "false")
    payload = {
        "session_id": "550e8400-e29b-41d4-a716-446655440000",
        "pet_species": "Cat",
        "pet_breed": "Siamese",
        "pet_age_months": 24,
        "pet_weight_kg": 4.5,
        "activity_level": "Low"
    }
    response = await client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    assert response.json()["fallback_used"] is True
