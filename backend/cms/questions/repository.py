from typing import Any, Optional
from uuid import UUID
from asyncpg import Connection, UniqueViolationError
from cms.questions.exceptions import QuestionNotFoundException
from uuid_utils.compat import uuid7

# filepath: /workspaces/hackathon25/backend/cms/questions/repository.py



class QuestionRepository:
    @staticmethod
    async def create(
        connection: Connection,
        title: str,
        content: str,
        author_id: str,
        tags: list[str],
        is_answered: bool = False,
    ) -> UUID:
        uid = uuid7()
        try:
            await connection.execute(
                """
                INSERT INTO questions(
                    id,title,content,author_id,tags,is_answered
                )
                VALUES($1,$2,$3,$4,$5,$6);
                """,
                uid,
                title,
                content,
                author_id,
                tags,
                is_answered,
            )
            return uid
        except UniqueViolationError as e:
            details = e.as_dict()
            raise Exception(details)

    @staticmethod
    async def get_by_id(connection: Connection, uid: UUID) -> dict[str, Any]:
        record = await connection.fetchrow(
            """--sql
            SELECT id,title,content,author_id,tags,is_answered,created_at
            FROM questions
            WHERE id = $1;
            """,
            uid,
        )
        if record is None:
            raise QuestionNotFoundException(parameter="question_id")
        return record

    @staticmethod
    async def get_all(
        connection: Connection, limit: int = 100, offset: int = 0
    ) -> list[dict[str, Any]]:
        records = await connection.fetch(
            """--sql
            SELECT id,title,content,author_id,tags,is_answered,created_at
            FROM questions
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2;
            """,
            limit,
            offset,
        )
        return records
    
    @staticmethod
    async def get_by_title_search(
        connection: Connection, search_term: str, limit: int = 100, offset: int = 0
    ) -> list[dict[str, Any]]:
        records = await connection.fetch(
            """--sql
            SELECT id,title,content,author_id,tags,is_answered,created_at
            FROM questions
            WHERE title ILIKE $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
            """,
            f"%{search_term}%",
            limit,
            offset,
        )
        return records


    @staticmethod
    async def get_by_tag(
        connection: Connection, tag: str, limit: int = 100, offset: int = 0
    ) -> list[dict[str, Any]]:
        records = await connection.fetch(
            """--sql
            SELECT id,title,content,author_id,tags,is_answered,created_at
            FROM questions
            WHERE $1 = ANY(tags)
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
            """,
            tag,
            limit,
            offset,
        )
        return records

    @staticmethod
    async def delete(connection: Connection, uid: UUID) -> None:
        response = await connection.execute(
            """--sql
            DELETE FROM questions
            WHERE id = $1;
            """,
            uid,
        )
        if response != "DELETE 1":
            raise QuestionNotFoundException(parameter="question_id")