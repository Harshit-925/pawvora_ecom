"""FastAPI application factory."""
from fastapi import FastAPI
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.security import SecurityHeadersMiddleware, configure_cors
from app.core.rate_limit import limiter
from app.routes.main import router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Dynamic Animal Food Platform",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url=None,
    )

    # Middleware — order matters
    app.add_middleware(SecurityHeadersMiddleware)
    configure_cors(app)

    # Rate limit error handler
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Routes
    app.include_router(router)

    return app


app = create_app()
