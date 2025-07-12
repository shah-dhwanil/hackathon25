from cms.users.exceptions import (
    PasswordIncorrectException,
    UserAlreadyExistsException,
    UserNotFoundException,
)
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from uuid import UUID

class User(BaseModel):
    user_id: UUID
    username: str = Field(..., max_length=32)
    email_id: EmailStr = Field(..., max_length=64)


class CreateUserRequest(BaseModel):
    email_id: EmailStr = Field(..., max_length=64)
    username: str = Field(..., max_length=32)
    password: str = Field(..., min_length=8, max_length=32)


class CreateUserResponse(BaseModel):
    user_id: UUID

class ListUserResponse(BaseModel):
    users: List[User] = Field(..., description="List of users")

class UserStatsResponse(BaseModel):
    questions_count: int = Field(..., description="Number of questions asked by the user")
    answers_count: int = Field(..., description="Number of answers provided by the user")
    best_answers_count: int = Field(..., description="Number of best answers provided by the user")
    votes_count: int = Field(..., description="Number of votes cast by the user")


class UserNotFoundExceptionResponse(BaseModel):
    slug: str = UserNotFoundException.slug
    description: str = UserNotFoundException.description
    context: dict


class UserAlreadyExistsExceptionResponse(BaseModel):
    slug: str = UserAlreadyExistsException.slug
    description: str = UserAlreadyExistsException.description
    context: dict


class PasswordIncorrectExceptionResponse(BaseModel):
    slug: str = PasswordIncorrectException.slug
    description: str = PasswordIncorrectException.description
    context: dict
