from datetime import datetime, timedelta
from typing import Annotated
from fastapi import APIRouter, Body, Depends, Response, Request
from fastapi import status
from asyncpg import Connection
from argon2.exceptions import VerifyMismatchError
from cms.users.repository import UserRepository
from cms.users.exceptions import UserNotFoundException
from cms.users.models import (
    UserNotFoundExceptionResponse,
    PasswordIncorrectExceptionResponse,
)
from cms.utils.argon2 import verify_password
from cms.utils.postgres import PgPool

from cms.auth.models import (
    LoginRequest,
    LoginResponse,
)

from jwt import encode
__all__ = [
    "router",
    "login",
    "logout",
]

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_200_OK: {
            "model": LoginResponse,
            "description": "Login successful.",
        },
        status.HTTP_400_BAD_REQUEST: {
            "model": PasswordIncorrectExceptionResponse,
            "description": "Invalid credentials.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": UserNotFoundExceptionResponse,
            "description": "User not found.",
        },
    },
)
async def login(
    body: Annotated[LoginRequest, Body()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    request: Request,
    response: Response,
):
    try:
        # Get user by email
        user_record = await UserRepository.get_by_email_id(
            connection, body.email_id.lower()
        )

        # Verify password
        verify_password(user_record["password"], body.password)

        # Create session
        token = encode({
            "user_id": str(user_record["id"]),
            "iss": "app",
            "exp": datetime.utcnow() + timedelta(hours=1),
        }, key="secret", algorithm="HS256")
        response.status_code = status.HTTP_200_OK
        return LoginResponse(
            token=token,
            user=LoginResponse.User(
                user_id=user_record["id"],
            ),
            expires_at=datetime.utcnow() + timedelta(hours=1),
        )
    except UserNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return UserNotFoundExceptionResponse(context=e.context)
    except VerifyMismatchError:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return PasswordIncorrectExceptionResponse(context={})