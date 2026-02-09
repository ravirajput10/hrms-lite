from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    mongodb_uri: str = "mongodb://localhost:27017"
    database_name: str = "hrms_lite"
    cors_origins: str = '["http://localhost:5173"]'
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from JSON string to list."""
        return json.loads(self.cors_origins)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
