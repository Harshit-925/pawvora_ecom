"""
Primary API routes for dynamic animal food brand website.
All routes: typed input, typed output, rate limited, error handled.
"""
from fastapi import APIRouter, Request, HTTPException, status
from app.core.rate_limit import limiter
from app.models.schemas import NutritionInput, NutritionResult, ErrorResponse
from app.services.ai_service import AIService

router = APIRouter(prefix="/api", tags=["nutrition"])
ai_service = AIService()


@router.get("/health", response_model=dict)
async def health_check() -> dict:
    """Health check endpoint for deployment verification."""
    return {"status": "healthy", "service": "dynamic-animal-food-platform"}


@router.post(
    "/analyze",
    response_model=NutritionResult,
    responses={422: {"model": ErrorResponse}, 429: {"model": ErrorResponse}},
)
@limiter.limit("30/minute")
async def analyze(
    request: Request,
    payload: NutritionInput,
) -> NutritionResult:
    """
    Primary analysis endpoint.
    Validates input → runs AI → returns typed result.
    """
    try:
        insights, calories, fallback_used = await ai_service.generate_insights(
            payload.model_dump(exclude={"session_id"})
        )
        return NutritionResult(
            session_id=payload.session_id,
            recommended_calories=calories,
            ai_insights=insights,
            fallback_used=fallback_used,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}",
        ) from e
