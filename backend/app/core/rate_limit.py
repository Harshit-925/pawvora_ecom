"""Rate limiting via slowapi."""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Usage in routes:
# @limiter.limit("30/minute")  — primary actions
# @limiter.limit("10/minute")  — AI calls
# @limiter.limit("20/minute")  — read operations
