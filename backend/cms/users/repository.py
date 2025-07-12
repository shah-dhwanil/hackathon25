from typing import Any, Optional
from uuid import UUID

from asyncpg import Connection, UniqueViolationError
from cms.users.exceptions import UserAlreadyExistsException, UserNotFoundException
from uuid_utils.compat import uuid7


class UserRepository:
    @staticmethod
    async def create(
        connection: Connection,
        username: str,
        email_id: str,
        password: str,
    ) -> UUID:
        uid = uuid7()
        try:
            await connection.execute(
                """
                INSERT INTO users(
                    id,username,email_id,password
                )
                VALUES($1,$2,$3,$4);
                """,
                uid,
                username,
                email_id,
                password,
            )
            return uid
        except UniqueViolationError as e:
            details = e.as_dict()
            match details["constraint_name"]:
                case "uniq_users_email_id":
                    raise UserAlreadyExistsException(parameter="email_id")
                case "uniq_users_username":
                    raise UserAlreadyExistsException(parameter="username")
                case _:
                    raise Exception(details)

    @staticmethod
    async def get_by_id(connection: Connection, uid: UUID) -> dict[str, Any]:
        record = await connection.fetchrow(
            """--sql
            SELECT id,username,email_id,password,active
            FROM users
            WHERE id = $1 AND active = TRUE;
            """,
            uid,
        )
        if record is None:
            raise UserNotFoundException(parameter="user_id")
        return record

    @staticmethod
    async def get_by_email_id(connection: Connection, email_id: str) -> dict[str, Any]:
        record = await connection.fetchrow(
            """--sql
            SELECT id,username,email_id,password,active
            FROM users
            WHERE email_id = $1 AND active = TRUE;
            """,
            email_id,
        )
        if record is None:
            raise UserNotFoundException(parameter="email_id")
        return record

    @staticmethod
    async def get_all(
        connection: Connection, limit: int = 100, offset: int = 0
    ) -> list[dict[str, Any]]:
        records = await connection.fetch(
            """--sql
            SELECT id,username,email_id,active
            FROM users
            WHERE active = TRUE
            ORDER BY created_at ASC
            LIMIT $1 OFFSET $2;
            """,
            limit,
            offset,
        )
        return records
    
    @staticmethod
    async def delete(connection: Connection, uid: UUID) -> None:
        response = await connection.execute(
            """--sql
            DELETE FROM users WHERE id = $1;
            """,
            uid,
        )

    @staticmethod
    async def get_stats(connection:Connection,uid:UUID) ->UUID:
        questions = connection.fetchval(
            """
            SELECT COUNT(*) FROM questions WHERE author_id = $1;
            """,
            uid
        )
        answers = connection.fetchval(
            """
            SELECT COUNT(*) FROM answers WHERE author_id = $1;
            """,
            uid
        );
        votes = connection.fetchval(
            """
            SELECT COUNT(*) FROM votes WHERE user_id = $1;
            """,
            uid
        );
        best_answer = connection.fetchval(
            """
            SELECT COUNT(*) FROM answers WHERE author_id = $1 AND is_accepted = TRUE;
            """,
            uid
        );
        return {
            "questions": questions,
            "answers": answers,
            "votes": votes,
            "best_answer": best_answer
        }