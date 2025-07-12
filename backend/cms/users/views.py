from typing import Annotated, Optional
from uuid import UUID
from argon2.exceptions import VerifyMismatchError
from cms.auth.dependency import required_authenticated_user
from cms.users.models import (
    CreateUserRequest,
    CreateUserResponse,
    ListUserResponse,
    User,
    UserAlreadyExistsExceptionResponse,
    UserNotFoundExceptionResponse,
    UserStatsResponse,
)
from cms.utils.argon2 import hash_password
from cms.utils.postgres import PgPool
from fastapi import APIRouter, Body, Depends, Path, Query, Response
from cms.users.exceptions import UserAlreadyExistsException, UserNotFoundException
from cms.users.repository import UserRepository
from fastapi import status
from asyncpg import Connection
from pydantic import EmailStr


router = APIRouter(prefix="/user", tags=["users"])


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_201_CREATED: {
            "model": CreateUserResponse,
            "description": "User created successfully.",
        },
        status.HTTP_409_CONFLICT: {
            "model": UserAlreadyExistsExceptionResponse,
            "description": "User with the given detail already exists.",
        },
    },
)
async def create_user(
    body: Annotated[CreateUserRequest, Body()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    hashed_password = hash_password(body.password)
    try:
        uid = await UserRepository.create(
            connection,
            body.username.lower(),
            body.email_id.lower(),
            hashed_password,
        )
        response.status_code = status.HTTP_201_CREATED
        return CreateUserResponse(user_id=uid)
    except UserAlreadyExistsException as e:
        response.status_code = status.HTTP_409_CONFLICT
        return UserAlreadyExistsExceptionResponse(context=e.context)

@router.get(
    "/",
    responses={
        status.HTTP_200_OK: {
            "model": ListUserResponse,
            "description": "List of users",
        },
    },
)
async def get_all_users(
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
    offset: Annotated[Optional[int], Query()] = 0,
    limit: Annotated[Optional[int], Query()] = 100,
):
    records = await UserRepository.get_all(connection, limit, offset)
    response.status_code = status.HTTP_200_OK
    return ListUserResponse(
        users=[
            User(
                user_id=record["id"],
                username=record["username"],
                email_id=record["email_id"],
            )
            for record in records
        ]
    )


@router.get(
    "/{user_id}",
    responses={
        status.HTTP_200_OK: {
            "model": User,
            "description": "User details retrieved successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": UserNotFoundExceptionResponse,
            "description": "User not found.",
        },
    },
)
async def get_user_by_id(
    user_id: Annotated[UUID, Path()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        record = await UserRepository.get_by_id(connection, user_id)
        response.status_code = status.HTTP_200_OK
        return User(
            user_id=record["id"],
            username=record["username"],
            email_id=record["email_id"],
        )
    except UserNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return UserNotFoundExceptionResponse(context=e.context)


@router.get(
    "/by_email/{email_id}",
    responses={
        status.HTTP_200_OK: {
            "model": User,
            "description": "User details retrieved successfully by email.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": UserNotFoundExceptionResponse,
            "description": "User not found by email.",
        },
    },
)
async def get_user_by_email_id(
    email_id: Annotated[EmailStr, Path()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        record = await UserRepository.get_by_email_id(connection, email_id.lower())
        response.status_code = status.HTTP_200_OK
        return User(
            user_id=record["id"],
            username=record["username"],
            email_id=record["email_id"],
        )
    except UserNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return UserNotFoundExceptionResponse(context=e.context)

@router.delete(
    "/{user_id}",
    responses={
        status.HTTP_204_NO_CONTENT: {
            "model": None,
            "description": "User deleted successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": UserNotFoundExceptionResponse,
            "description": "User not found.",
        },
    },
)
async def delete_user(
    user_id: Annotated[UUID, Path()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        await UserRepository.delete(connection, user_id)
        response.status_code = status.HTTP_200_OK
        return
    except UserNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return UserNotFoundExceptionResponse(context=e.context)


