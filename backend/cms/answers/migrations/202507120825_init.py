
# List of dependencies (migration that must be applied before this one)
dependencies = ["questions.202507120731_initial"]

# SQL to apply the migration
apply = [
    """
    CREATE TABLE IF NOT EXISTS answers (
        id UUID,
        question_id UUID NOT NULL,
        author_id UUID,
        content TEXT NOT NULL,
        is_accepted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT pk_answers PRIMARY KEY (id),
        CONSTRAINT fk_answers_question_id FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
        CONSTRAINT fk_answers_author_id FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS votes (
        id UUID,
        answer_id UUID NOT NULL,
        user_id UUID NULL,
        CONSTRAINT pk_votes PRIMARY KEY (id),
        CONSTRAINT unique_vote UNIQUE (answer_id, user_id),
        CONSTRAINT fk_votes_answer_id FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE,
        CONSTRAINT fk_votes_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    """
]

# SQL to rollback the migration
rollback = [
    """
    DROP TABLE IF EXISTS votes;
    """,
    """
    DROP TABLE IF EXISTS answers;
    """
]
