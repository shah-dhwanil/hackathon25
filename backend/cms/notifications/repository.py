from typing import Any, Optional
from uuid import UUID
from asyncpg import Connection
from uuid_utils.compat import uuid7

# filepath: /workspaces/hackathon25/backend/cms/notifications/repository.py



class NotificationRepository:
    @staticmethod
    async def create(
        connection: Connection,
        user_id: UUID,
        question_id: UUID,
        type: str,
        content: str,
    ) -> UUID:
        uid = uuid7()
        await connection.execute(
            """
            INSERT INTO notifications(
                id, user_id, question_id, type, content
            )
            VALUES($1, $2, $3, $4, $5);
            """,
            uid,
            user_id,
            question_id,
            type,
            content,
        )
        return uid

    @staticmethod
    async def get_by_id(connection: Connection, uid: UUID) -> dict[str, Any]:
        record = await connection.fetchrow(
            """--sql
            SELECT id, user_id, question_id, type, content, is_read, created_at
            FROM notifications
            WHERE id = $1;
            """,
            uid,
        )
        if record is None:
            raise Exception("Notification not found")
        return record

    @staticmethod
    async def get_by_user_id(
        connection: Connection, 
        user_id: UUID, 
        limit: int = 100, 
        offset: int = 0
    ) -> list[dict[str, Any]]:
        records = await connection.fetch(
            """--sql
            SELECT id, user_id, question_id, type, content, is_read, created_at
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
            """,
            user_id,
            limit,
            offset,
        )
        return records

    @staticmethod
    async def get_unread_by_user_id(
        connection: Connection, 
        user_id: UUID, 
        limit: int = 100, 
        offset: int = 0
    ) -> list[dict[str, Any]]:
        records = await connection.fetch(
            """--sql
            SELECT id, user_id, question_id, type, content, is_read, created_at
            FROM notifications
            WHERE user_id = $1 AND is_read = FALSE
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
            """,
            user_id,
            limit,
            offset,
        )
        return records

    @staticmethod
    async def mark_as_read(connection: Connection, uid: UUID) -> None:
        await connection.execute(
            """--sql
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = $1;
            """,
            uid,
        )

    @staticmethod
    async def mark_all_as_read(connection: Connection, user_id: UUID) -> None:
        await connection.execute(
            """--sql
            UPDATE notifications
            SET is_read = TRUE
            WHERE user_id = $1;
            """,
            user_id,
        )

    @staticmethod
    async def delete(connection: Connection, uid: UUID) -> None:
        await connection.execute(
            """--sql
            DELETE FROM notifications WHERE id = $1;
            """,
            uid,
        )

    @staticmethod
    async def get_unread_count(connection: Connection, user_id: UUID) -> int:
        count = await connection.fetchval(
            """--sql
            SELECT COUNT(*) FROM notifications
            WHERE user_id = $1 AND is_read = FALSE;
            """,
            user_id,
        )
        return count