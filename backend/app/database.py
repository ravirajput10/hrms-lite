from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

# MongoDB client instance
client: AsyncIOMotorClient = None
database = None


async def connect_to_mongo():
    """Create database connection on startup."""
    global client, database
    client = AsyncIOMotorClient(settings.mongodb_uri)
    database = client[settings.database_name]
    
    # Test connection
    try:
        await client.admin.command('ping')
        print(f"Connected to MongoDB: {settings.database_name}")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise e


async def close_mongo_connection():
    """Close database connection on shutdown."""
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")


def get_database():
    """Get database instance."""
    return database


def get_employees_collection():
    """Get employees collection."""
    return database["employees"]


def get_attendance_collection():
    """Get attendance collection."""
    return database["attendance"]
