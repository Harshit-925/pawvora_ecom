"""Application configuration via environment variables."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """All config sourced from environment — never hardcoded."""
    
    environment: str = "development"
    project_id: str = "local"
    region: str = "us-central1"
    
    anthropic_api_key: str = ""
    use_ai: bool = True
    use_firestore: bool = False
    use_bigquery: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance — call this everywhere."""
    return Settings()
