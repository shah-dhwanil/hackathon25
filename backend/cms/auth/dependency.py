from typing import Optional, Annotated
from uuid import UUID
from cms.auth.models import LoginResponse
from cms.utils.postgres import PgPool
from cms.auth.exceptions import (
    CredentialsNotFoundException,
    SessionInvalidOrExpiredException,
)
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import decode
bearer = HTTPBearer(auto_error=False)


async def get_token(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(bearer)],
) -> str:
    if credentials is None or credentials.credentials is None:
        raise CredentialsNotFoundException()
    try:
        token = credentials.credentials
    except ValueError:
        raise CredentialsNotFoundException()
    return token

async def required_authenticated_user(
        token: Annotated[str, Depends(get_token)],
)-> UUID:
    try:
        payload = decode(token, "secret", algorithms=["HS256"])
        print(payload)
        return payload["user_id"]
    except Exception:
        raise SessionInvalidOrExpiredException()