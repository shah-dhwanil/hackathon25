from typing import Annotated, Optional
from uuid import UUID
from cms.auth.dependency import required_authenticated_user
from cms.auth.models import LoginResponse
from cms.utils.postgres import PgPool
from fastapi import APIRouter, Body, Depends, Path, Query, Response
from cms.questions.exceptions import QuestionNotFoundException
from cms.questions.repository import QuestionRepository
from fastapi import status
from asyncpg import Connection

from cms.questions.models import (
    CreateQuestionRequest,
    CreateQuestionResponse,
    ListQuestionResponse,
    Question,
    UserNotFoundExceptionResponse,
)


router = APIRouter(prefix="/question", tags=["questions"])


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_201_CREATED: {
            "model": CreateQuestionResponse,
            "description": "Question created successfully.",
        },
    },
)
async def create_question(
    body: Annotated[CreateQuestionRequest, Body()],
    user_id :Annotated[UUID,Depends(required_authenticated_user)],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    uid = await QuestionRepository.create(
        connection,
        body.title,
        body.content,
        user_id,
        body.tags,
        body.is_answered,
    )
    response.status_code = status.HTTP_201_CREATED
    return CreateQuestionResponse(id=uid)


@router.get(
    "/",
    responses={
        status.HTTP_200_OK: {
            "model": ListQuestionResponse,
            "description": "List of questions",
        },
    },
)
async def get_all_questions(
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
    offset: Annotated[Optional[int], Query()] = 0,
    limit: Annotated[Optional[int], Query()] = 100,
):
    records = await QuestionRepository.get_all(connection, limit, offset)
    response.status_code = status.HTTP_200_OK
    return ListQuestionResponse(
        questions=[
            Question(
                id=str(record["id"]),
                author_id=str(record["author_id"]),
                title=record["title"],
                content=record["content"],
                tags=record["tags"],
                is_answered=record["is_answered"],
                created_at=str(record["created_at"]),
            )
            for record in records
        ]
    )


@router.get(
    "/{question_id}",
    responses={
        status.HTTP_200_OK: {
            "model": Question,
            "description": "Question details retrieved successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": UserNotFoundExceptionResponse,
            "description": "Question not found.",
        },
    },
)
async def get_question_by_id(
    question_id: Annotated[UUID, Path()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        record = await QuestionRepository.get_by_id(connection, question_id)
        response.status_code = status.HTTP_200_OK
        return Question(
            id=str(record["id"]),
            author_id=str(record["author_id"]),
            title=record["title"],
            content=record["content"],
            tags=record["tags"],
            is_answered=record["is_answered"],
            created_at=str(record["created_at"]),
        )
    except QuestionNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return UserNotFoundExceptionResponse(context=e.context)


@router.get(
    "/search/{search_term}",
    responses={
        status.HTTP_200_OK: {
            "model": ListQuestionResponse,
            "description": "List of questions matching search term",
        },
    },
)
async def search_questions_by_title(
    search_term: Annotated[str, Path()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
    offset: Annotated[Optional[int], Query()] = 0,
    limit: Annotated[Optional[int], Query()] = 100,
):
    records = await QuestionRepository.get_by_title_search(connection, search_term, limit, offset)
    response.status_code = status.HTTP_200_OK
    return ListQuestionResponse(
        questions=[
            Question(
                id=str(record["id"]),
                author_id=str(record["author_id"]),
                title=record["title"],
                content=record["content"],
                tags=record["tags"],
                is_answered=record["is_answered"],
                created_at=str(record["created_at"]),
            )
            for record in records
        ]
    )


@router.get(
    "/tag/{tag}",
    responses={
        status.HTTP_200_OK: {
            "model": ListQuestionResponse,
            "description": "List of questions with specified tag",
        },
    },
)
async def get_questions_by_tag(
    tag: Annotated[str, Path()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
    offset: Annotated[Optional[int], Query()] = 0,
    limit: Annotated[Optional[int], Query()] = 100,
):
    records = await QuestionRepository.get_by_tag(connection, tag, limit, offset)
    response.status_code = status.HTTP_200_OK
    return ListQuestionResponse(
        questions=[
            Question(
                id=str(record["id"]),
                author_id=str(record["author_id"]),
                title=record["title"],
                content=record["content"],
                tags=record["tags"],
                is_answered=record["is_answered"],
                created_at=str(record["created_at"]),
            )
            for record in records
        ]
    )


@router.delete(
    "/{question_id}",
    responses={
        status.HTTP_204_NO_CONTENT: {
            "model": None,
            "description": "Question deleted successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": UserNotFoundExceptionResponse,
            "description": "Question not found.",
        },
    },
)
async def delete_question(
    question_id: Annotated[UUID, Path()],
    user_id :Annotated[UUID,Depends(required_authenticated_user)],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        await QuestionRepository.delete(connection, question_id)
        response.status_code = status.HTTP_204_NO_CONTENT
        return
    except QuestionNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return UserNotFoundExceptionResponse(context=e.context)