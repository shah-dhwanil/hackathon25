from typing import Any, Optional
from uuid import UUID
from asyncpg import Connection, UniqueViolationError
from cms.answers.exceptions import AnswerNotFoundException
from uuid_utils.compat import uuid7

class AnswerRepository:
    @staticmethod
    async def create(
        connection: Connection,
        question_id: UUID,
        author_id: UUID,
        content: str,
    ) -> UUID:
        uid = uuid7()
        print(f"Creating answer with ID: {uid}, Question ID: {question_id}, Author ID: {author_id}, Content: {content}")
        await connection.execute(
            """
            INSERT INTO answers(
                id, question_id, author_id, content
            )
            VALUES($1, $2, $3, $4);
            """,
            uid,
            question_id,
            author_id,
            content,
        )
        return uid

    @staticmethod
    async def get_by_id(connection: Connection, uid: UUID) -> dict[str, Any]:
        record = await connection.fetchrow(
            """--sql
            SELECT 
                a.id, a.question_id, a.author_id, a.content, 
                a.is_accepted, a.created_at, u.username as author_name,
                COALESCE(v.vote_count, 0) as votes
            FROM answers a
            LEFT JOIN users u ON a.author_id = u.id
            LEFT JOIN (
                SELECT answer_id, COUNT(*) as vote_count
                FROM votes
                GROUP BY answer_id
            ) v ON a.id = v.answer_id
            WHERE a.id = $1;
            """,
            uid,
        )
        if record is None:
            raise AnswerNotFoundException(parameter="answer_id")
        return record

    @staticmethod
    async def get_by_question_id(
        connection: Connection, question_id: UUID
    ) -> list[dict[str, Any]]:
        records = await connection.fetch(
            """--sql
            SELECT 
                a.id, a.question_id, a.author_id, a.content, 
                a.is_accepted, a.created_at, u.username as author_name,
                COALESCE(v.vote_count, 0) as votes
            FROM answers a
            LEFT JOIN users u ON a.author_id = u.id
            LEFT JOIN (
                SELECT answer_id, COUNT(*) as vote_count
                FROM votes
                GROUP BY answer_id
            ) v ON a.id = v.answer_id
            WHERE a.question_id = $1
            ORDER BY a.is_accepted DESC, a.created_at ASC;
            """,
            question_id,
        )
        return records

    @staticmethod
    async def delete(connection: Connection, uid: UUID,author_id:UUID) -> None:
        response = await connection.execute(
            """--sql
            DELETE FROM answers
            WHERE id = $1 AND author_id = $2;
            """,
            uid,
            author_id
        )
        if response != "DELETE 1":
            raise AnswerNotFoundException("answer_id")

    @staticmethod
    async def accept_answer(connection: Connection, uid: UUID,user_id:UUID) -> None:
        response = await connection.execute(
            """--sql
            UPDATE questions
            SET is_answered = TRUE
            WHERE id = (SELECT question_id FROM answers WHERE id = $1) AND author_id = $2;
            """,
            uid,
            user_id,
        )
        if response != "UPDATE 1":
            raise AnswerNotFoundException("answer_id")
        response = await connection.execute(
            """--sql
            UPDATE answers
            SET is_accepted = TRUE
            WHERE id = $1;
            """,
            uid,
        )

    @staticmethod
    async def add_vote(connection: Connection, answer_id: UUID, user_id: UUID) -> None:
        vote_id = uuid7()
        try:
            await connection.execute(
                """
                INSERT INTO votes(id, answer_id, user_id)
                VALUES($1, $2, $3);
                """,
                vote_id,
                answer_id,
                user_id,
            )
        except UniqueViolationError:
            # If the vote already exists, we can ignore this error
            pass

    @staticmethod
    async def remove_vote(connection: Connection, answer_id: UUID, user_id: UUID) -> None:
        await connection.execute(
            """--sql
            DELETE FROM votes
            WHERE answer_id = $1 AND user_id = $2;
            """,
            answer_id,
            user_id,
        )