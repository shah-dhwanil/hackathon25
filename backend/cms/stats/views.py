from uuid import UUID
from asyncpg import Connection
from cms.auth.dependency import required_authenticated_user
from cms.users.exceptions import UserNotFoundException
from cms.users.models import UserNotFoundExceptionResponse, UserStatsResponse
from cms.users.repository import UserRepository
from cms.utils.postgres import PgPool
from fastapi import APIRouter, Depends, Response, status
from typing import Annotated

router = APIRouter(prefix="/stats",tags=["stats"])

@router.get(
    "/",
    responses={
        status.HTTP_200_OK: {
            "model": UserStatsResponse,
            "description": "User details retrieved successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": UserNotFoundExceptionResponse,
            "description": "User not found.",
        },
    },
)
async def get_user_stats(
    user_id :Annotated[UUID,Depends(required_authenticated_user)],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        print(f"Fetching stats for user_id: {user_id}")
        # record = await UserRepository.get_stats(connection, user_id)
        # response.status_code = status.HTTP_200_OK
        # return UserStatsResponse(
        #     questions_count=record["questions"],
        #     answers_count=record["answers"],
        #     votes_count=record["votes"],
        #     best_answers_count=record["best_answers"],
        # )
    except UserNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return UserNotFoundExceptionResponse(context=e.context)

