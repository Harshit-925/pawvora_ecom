"""
Pydantic v2 models for dynamic animal food brand website.
All fields validated — no raw dicts passed between layers.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import uuid


class NutritionInput(BaseModel):
    """Input schema for dynamic animal nutrition calculation."""
    
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    pet_species: str = Field(..., description="Species of the pet, e.g., Dog or Cat")
    pet_breed: str = Field(..., description="Specific breed, e.g., Golden Retriever")
    pet_age_months: int = Field(..., ge=0, le=360, description="Age of the pet in months")
    pet_weight_kg: float = Field(..., gt=0, le=100, description="Weight of the pet in kg")
    activity_level: str = Field(..., description="Low, Moderate, High, or Athlete")
    allergies: Optional[str] = Field(default=None, description="Known allergies if any")
    
    @field_validator("session_id")
    @classmethod
    def validate_session_id(cls, v: str) -> str:
        """Ensure session_id is a valid UUID — never PII."""
        try:
            uuid.UUID(v)
        except ValueError as e:
            raise ValueError("session_id must be a valid UUID") from e
        return v


class NutritionResult(BaseModel):
    """Output schema returned to the client."""
    
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    recommended_calories: float = Field(..., description="Recommended daily calorie intake")
    ai_insights: list[str] = Field(default_factory=list)
    fallback_used: bool = False


class ErrorResponse(BaseModel):
    """Standardised error response."""
    
    detail: str
    code: str
