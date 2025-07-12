from uuid import UUID
from pydantic import BaseModel, Field
from cms.questions.exceptions import QuestionNotFoundException


class Question(BaseModel):
    id: str = Field(..., description="Unique identifier for the question")
    title: str = Field(..., max_length=128, description="Title of the question")
    content: str = Field(..., description="Content of the question")
    author_id: str = Field(..., description="ID of the user who created the question")
    tags: list[str] = Field(default_factory=list, description="Tags associated with the question")
    is_answered: bool = Field(default=False, description="Whether the question has been answered")
    created_at: str = Field(..., description="Timestamp when the question was created")

class CreateQuestionRequest(BaseModel):
    title: str = Field(..., max_length=128, description="Title of the question")
    content: str = Field(..., description="Content of the question")
    tags: list[str] = Field(default_factory=list, description="Tags associated with the question")
    is_answered: bool = Field(default=False, description="Whether the question has been answered")


class CreateQuestionResponse(BaseModel):
    id:UUID


class ListQuestionResponse(BaseModel):
    questions: list[Question] = Field(..., description="List of questions")


class UserNotFoundExceptionResponse(BaseModel):
    slug: str = QuestionNotFoundException.slug
    description: str = QuestionNotFoundException.description
    context: dict
