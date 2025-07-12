from uuid import UUID
from cms.answers.exceptions import AnswerNotFoundException
from pydantic import BaseModel

class Answer(BaseModel):
    id: UUID
    question_id: UUID
    author_id: UUID | None = None
    author_name:str|None = None
    content: str
    votes: int = 0
    is_accepted: bool = False
    created_at: str


class CreateAnswerRequest(BaseModel):
    content: str
    question_id: UUID

class CreateAnswerResponseModel(BaseModel):
    id: UUID

class ListAnswerResponseModel(BaseModel):
    answers: list[Answer]

class AnswerNotFoundExceptionResponse(BaseModel):
    slug: str = AnswerNotFoundException.slug
    description: str = AnswerNotFoundException.description
    context: dict
