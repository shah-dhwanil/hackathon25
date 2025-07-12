# List of dependencies (migration that must be applied before this one)
dependencies = []

# SQL to apply the migration
apply = [
    """--sql
    CREATE TABLE IF NOT EXISTS users (
        id UUID,
        username VARCHAR(64) NOT NULL,
        email_id VARCHAR(64) NOT NULL,
        password VARCHAR(512) NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP(0) WITH TIME ZONE DEFAULT now(),
        CONSTRAINT pk_users PRIMARY KEY(id),
        CONSTRAINT uniq_users_email_id UNIQUE(email_id),
        CONSTRAINT uniq_users_username UNIQUE(username)
    );
    """
]

# SQL to rollback the migration
rollback = [
    """--sql
    DROP TABLE IF EXISTS users;
    """
]
