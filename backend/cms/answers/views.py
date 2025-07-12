from typing import Annotated, Optional
from uuid import UUID
from cms.auth.dependency import required_authenticated_user
from cms.notifications.repository import NotificationRepository
from cms.questions.repository import QuestionRepository
from cms.utils.postgres import PgPool
from fastapi import APIRouter, Body, Depends, Path, Query, Response
from cms.answers.exceptions import AnswerNotFoundException
from cms.answers.repository import AnswerRepository
from fastapi import status
from asyncpg import Connection

# filepath: /workspaces/hackathon25/backend/cms/answers/views.py

from cms.answers.models import (
    CreateAnswerRequest,
    CreateAnswerResponseModel,
    ListAnswerResponseModel,
    Answer,
    AnswerNotFoundExceptionResponse,
)


router = APIRouter(prefix="/answer", tags=["answers"])


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_201_CREATED: {
            "model": CreateAnswerResponseModel,
            "description": "Answer created successfully.",
        },
    },
)
async def create_answer(
    body: Annotated[CreateAnswerRequest, Body()],
    user_id: Annotated[UUID, Depends(required_authenticated_user)],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    uid = await AnswerRepository.create(
        connection,
        body.question_id,
        user_id,
        body.content,
    )
    #question = QuestionRepository.get_by_id(connection, body.question_id)  # Ensure question exists
    #await NotificationRepository.create(connection, question["author_id"], body.question_id, "comment", "Someone commented on your question.")
    response.status_code = status.HTTP_201_CREATED
    return CreateAnswerResponseModel(id=uid)


@router.get(
    "/{answer_id}",
    responses={
        status.HTTP_200_OK: {
            "model": Answer,
            "description": "Answer details retrieved successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": AnswerNotFoundExceptionResponse,
            "description": "Answer not found.",
        },
    },
)
async def get_answer_by_id(
    answer_id: Annotated[UUID, Path()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        record = await AnswerRepository.get_by_id(connection, answer_id)
        response.status_code = status.HTTP_200_OK
        return Answer(
            id=record["id"],
            question_id=record["question_id"],
            author_id=record["author_id"],
            author_name=record["author_name"],
            content=record["content"],
            votes=record["votes"],
            is_accepted=record["is_accepted"],
            created_at=str(record["created_at"]),
        )
    except AnswerNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return AnswerNotFoundExceptionResponse(context=e.context)


@router.get(
    "/question/{question_id}",
    responses={
        status.HTTP_200_OK: {
            "model": ListAnswerResponseModel,
            "description": "List of answers for question",
        },
    },
)
async def get_answers_by_question_id(
    question_id: Annotated[UUID, Path()],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    records = await AnswerRepository.get_by_question_id(connection, question_id)
    response.status_code = status.HTTP_200_OK
    return ListAnswerResponseModel(
        answers=[
            Answer(
                id=record["id"],
                question_id=record["question_id"],
                author_id=record["author_id"],
                author_name=record["author_name"],
                content=record["content"],
                votes=record["votes"],
                is_accepted=record["is_accepted"],
                created_at=str(record["created_at"]),
            )
            for record in records
        ]
    )


@router.delete(
    "/{answer_id}",
    responses={
        status.HTTP_204_NO_CONTENT: {
            "model": None,
            "description": "Answer deleted successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": AnswerNotFoundExceptionResponse,
            "description": "Answer not found.",
        },
    },
)
async def delete_answer(
    answer_id: Annotated[UUID, Path()],
    user_id: Annotated[UUID, Depends(required_authenticated_user)],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        await AnswerRepository.delete(connection, answer_id,user_id)
        response.status_code = status.HTTP_204_NO_CONTENT
        return
    except AnswerNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return AnswerNotFoundExceptionResponse(context=e.context)


@router.put(
    "/{answer_id}/accept",
    responses={
        status.HTTP_204_NO_CONTENT: {
            "model": None,
            "description": "Answer accepted successfully.",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": AnswerNotFoundExceptionResponse,
            "description": "Answer not found.",
        },
    },
)
async def accept_answer(
    answer_id: Annotated[UUID, Path()],
    user_id: Annotated[UUID, Depends(required_authenticated_user)],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    try:
        await AnswerRepository.accept_answer(connection, answer_id, user_id)
        #answer = await AnswerRepository.get_by_id(connection, answer_id)
        #await NotificationRepository.create(connection, answer["author_id"], answer["question_id"], "accepted_answer", "Your answer has been accepted.")
        response.status_code = status.HTTP_204_NO_CONTENT
        return
    except AnswerNotFoundException as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return AnswerNotFoundExceptionResponse(context=e.context)


@router.post(
    "/{answer_id}/vote",
    responses={
        status.HTTP_201_CREATED: {
            "model": None,
            "description": "Vote added successfully.",
        },
    },
)
async def add_vote(
    answer_id: Annotated[UUID, Path()],
    user_id: Annotated[UUID, Depends(required_authenticated_user)],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    await AnswerRepository.add_vote(connection, answer_id, user_id)
    response.status_code = status.HTTP_201_CREATED
    return


@router.delete(
    "/{answer_id}/vote",
    responses={
        status.HTTP_204_NO_CONTENT: {
            "model": None,
            "description": "Vote removed successfully.",
        },
    },
)
async def remove_vote(
    answer_id: Annotated[UUID, Path()],
    user_id: Annotated[UUID, Depends(required_authenticated_user)],
    connection: Annotated[Connection, Depends(PgPool.get_connection)],
    response: Response,
):
    await AnswerRepository.remove_vote(connection, answer_id, user_id)
    response.status_code = status.HTTP_204_NO_CONTENT
    return