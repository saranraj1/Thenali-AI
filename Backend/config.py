"""
Bharat AI Operational Hub - Configuration Module
Loads all environment variables and provides a settings singleton.
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List
import os


class Settings(BaseSettings):
    # AWS Core
    AWS_REGION: str = Field(default="ap-south-1")
    AWS_ACCESS_KEY_ID: str = Field(default="")
    AWS_SECRET_ACCESS_KEY: str = Field(default="")

    # Bedrock
    BEDROCK_MODEL_ID: str = Field(default="apac.amazon.nova-pro-v1:0")
    BEDROCK_REGION: str = Field(default="ap-south-1")

    # S3
    S3_VOICE_BUCKET: str = Field(default="bharat-ai-voice-recordings")
    S3_REPO_BUCKET: str = Field(default="bharat-ai-repositories")
    S3_AVATAR_BUCKET: str = Field(default="bharat-ai-profile-pictures")
    S3_BUCKET_NAME: str = Field(default="bharat-ai-profile-pictures")  # alias used by avatar feature

    # DynamoDB Tables
    DYNAMODB_USERS_TABLE: str = Field(default="bharat_ai_users")
    DYNAMODB_REPOS_TABLE: str = Field(default="bharat_ai_repositories")
    DYNAMODB_REPO_INTELLIGENCE_TABLE: str = Field(default="bharat_ai_repo_intelligence")
    DYNAMODB_ROADMAPS_TABLE: str = Field(default="bharat_ai_roadmaps")
    DYNAMODB_ASSESSMENTS_TABLE: str = Field(default="bharat_ai_assessments")
    DYNAMODB_ACTIVITY_LOGS_TABLE: str = Field(default="bharat_ai_activity_logs")
    DYNAMODB_PLAYGROUND_SESSIONS_TABLE: str = Field(default="bharat_ai_playground_sessions")
    DYNAMODB_CHAT_MEMORY_TABLE: str = Field(default="bharat_ai_chat_memory")

    # Data Paths
    DATA_BASE_PATH: str = Field(default="./data")
    REPO_BASE_PATH: str = Field(default="./data/repos")
    FAISS_INDEX_PATH: str = Field(default="./data/faiss_indexes")
    RAG_PIPELINE_PATH: str = Field(default="./data/rag")

    # JWT
    JWT_SECRET_KEY: str = Field(default="change-this-secret-in-production")
    JWT_EXPIRE_MINUTES: int = Field(default=1440)

    # CORS
    CORS_ORIGINS: str = Field(default="http://localhost:3000,http://localhost:5173")

    # App
    APP_ENV: str = Field(default="development")
    APP_PORT: int = Field(default=8000)
    LOG_LEVEL: str = Field(default="INFO")
    # Git — default to the standard Windows Git installation path.
    # Override via GIT_PYTHON_GIT_EXECUTABLE in Backend/.env
    GIT_PYTHON_GIT_EXECUTABLE: str = Field(
        default=r"C:\Program Files\Git\bin\git.exe"
    )
    GIT_PYTHON_REFRESH: str = Field(default="quiet")

    # Embedding
    EMBEDDING_MODEL: str = Field(default="all-MiniLM-L6-v2")

    # Sandbox
    SANDBOX_TIMEOUT: int = Field(default=10)
    SANDBOX_MAX_MEMORY_MB: int = Field(default=128)

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()

# Ensure required directories exist
for path in [
    settings.DATA_BASE_PATH,
    settings.REPO_BASE_PATH,
    settings.FAISS_INDEX_PATH,
    settings.RAG_PIPELINE_PATH,
]:
    os.makedirs(path, exist_ok=True)
