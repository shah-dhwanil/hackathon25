
# List of dependencies (migration that must be applied before this one)
dependencies = ["questions.202507120731_initial","users.202506121032_initial"]

# SQL to apply the migration
apply = [
    """
    CREATE TYPE NotificationType AS ENUM (
        'comment', 'tagged', 'accepted_answer', 'voted_answer'
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS notifications (
        id UUID,
        user_id UUID NOT NULL,
        question_id UUID NOT NULL,
        type NotificationType NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT pk_notifications PRIMARY KEY (id),
        CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        CONSTRAINT fk_notifications_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
    );  
        
    """
]

# SQL to rollback the migration
rollback = [
    """
    DROP TABLE IF EXISTS notifications;
    """,
    """
    DROP TYPE IF EXISTS NotificationType;
    """,
]
