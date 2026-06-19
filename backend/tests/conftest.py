"""
Shared pytest fixtures.
asyncio_mode="auto" in pytest.ini removes the need for @pytest.mark.asyncio
on every test — cleaner and avoids the loop-scope deprecation warning.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture(scope="function")
async def client() -> AsyncClient:
    """Async test client scoped per test function."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
