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
    
    # Log for debugging
    print(f"CORS_ORIGINS raw value: '{origins_str}'")
    
    # Handle wildcard or empty (default to wildcard for production safety)
    if origins_str == "*" or not origins_str:
        print("Using wildcard CORS origins")
        return ["*"]
    
    # Try JSON parsing first
    if origins_str.startswith("["):
        try:
            result = json.loads(origins_str)
            print(f"Parsed CORS origins (JSON): {result}")
            return result
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
    
    # Fall back to comma-separated
    origins = [origin.strip().strip('"').strip("'") for origin in origins_str.split(",")]
    result = [o for o in origins if o]  # Filter out empty strings
    print(f"Parsed CORS origins (comma-separated): {result}")
    return result if result else ["*"]
