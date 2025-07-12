from os import environ
from typing import Self

from dotenv import load_dotenv
from pydantic import BaseModel
from tomllib import load

__config__ = None


class Config(BaseModel):
    SERVER_ENVIRONMENT: str
    SERVER_HOST: str
    SERVER_PORT: int
    POSTGRES_DSN: str
    POSTGRES_MIN_CONNECTIONS: int
    POSTGRES_MAX_CONNECTIONS: int
    ARGON_TIME_COST: int
    ARGON_MEMORY_COST: int
    ARGON_PARALLELISM: int
    ARGON_SALT_LENGTH: int
    ARGON_HASH_LENGTH: int

    @classmethod
    def load_config(cls):
        load_dotenv("./.env")
        environment = environ.get("CMS_SERVER_ENVIRONMENT", None)
        if environment is None:
            raise ValueError("Server Environment must be set in the system")
        load_dotenv(f".env.{environment.lower()}")
        config = dict()
        with open("./config.toml", "rb") as f:
            toml_config = load(f)
            config.update(toml_config.get("DEFAULT", dict()))
            config.update(toml_config.get(environment, dict()))
        for key in environ:
            if key.startswith("CMS_"):
                config[key.removeprefix("CMS_")] = environ[key]
        global __config__
        __config__ = cls(**config)

    @classmethod
    def get_config(cls) -> Self:
        global __config__
        if __config__ is None:
            raise Exception("Config is not loaded")
        return __config__
