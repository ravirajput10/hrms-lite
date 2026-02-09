from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    mongodb_uri: str = "mongodb://localhost:27017"
    database_name: str = "hrms_lite"
    cors_origins: str = '["http://localhost:5173"]'
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8"
    }


settings = Settings()


def get_cors_origins() -> List[str]:
    """Parse CORS origins from environment variable.
    
    Supports multiple formats:
    - JSON array: '["http://example.com", "http://other.com"]'
    - Comma-separated: 'http://example.com,http://other.com'
    - Single URL: 'http://example.com'
    - Wildcard: '*' (allows all origins)
    """
    origins_str = settings.cors_origins.strip()
    
    # Handle wildcard
    if origins_str == "*":
        return ["*"]
    
    # Try JSON parsing first
    if origins_str.startswith("["):
        try:
            return json.loads(origins_str)
        except json.JSONDecodeError:
            pass
    
    # Fall back to comma-separated
    origins = [origin.strip().strip('"').strip("'") for origin in origins_str.split(",")]
    return [o for o in origins if o]  # Filter out empty strings
