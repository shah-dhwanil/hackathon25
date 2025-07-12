from cms.app.lifespan import lifespan
from cms.app.middlewares import (
    ContextMiddleware,
    LoggingMiddleware,
    RequestIDMiddleware,
)
from cms.auth.exception_handler import credentials_not_found_exception_handler, session_invalid_or_expired_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from cms.auth.exceptions import CredentialsNotFoundException, SessionInvalidOrExpiredException
from fastapi import FastAPI
from structlog import get_logger
from cms.users.views import router as user_router
from cms.auth.views import router as auth_router
from cms.questions.views import router as questions_router
from cms.answers.views import router as answers_router


app = FastAPI(
    title="College Management System",
    lifespan=lifespan,
)
app.add_middleware(LoggingMiddleware)
app.add_middleware(ContextMiddleware)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
app.add_exception_handler(
    CredentialsNotFoundException,
    credentials_not_found_exception_handler,
)
app.add_exception_handler(
    SessionInvalidOrExpiredException,
    session_invalid_or_expired_exception_handler,
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(questions_router)
app.include_router(answers_router)

@app.get("/")
async def root():
    logger = get_logger()
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to College Management System"}
