
# List of dependencies (migration that must be applied before this one)
dependencies = ["users.202506121032_initial"]

# SQL to apply the migration
apply = [
    """
    CREATE TABLE IF NOT EXISTS questions (
        id UUID,
        title VARCHAR(128) NOT NULL,
        content TEXT NOT NULL,
        author_id UUID NOT NULL,
        tags text[],
        is_answered BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT pk_questions PRIMARY KEY (id),
        CONSTRAINT fk_questions_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
    );
    """
]

# SQL to rollback the migration
rollback = [
    """
    DROP TABLE IF EXISTS questions;
    """
]
