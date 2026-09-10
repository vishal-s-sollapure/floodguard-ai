import os
import logging
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "your_mongodb_atlas_connection_string")

logger = logging.getLogger("floodguard")

class Database:
    client: AsyncIOMotorClient = None
    db = None
    is_connected: bool = False

db_instance = Database()

# In-memory storage fallback for offline/placeholder execution
in_memory_db = {
    "predictions": [],
    "reports": [],
    "alerts": []
}

async def connect_to_mongo():
    if not MONGODB_URI or MONGODB_URI == "your_mongodb_atlas_connection_string":
        logger.info("MONGODB_URI is placeholder. Running with in-memory fallback storage.")
        db_instance.is_connected = False
        return

    try:
        db_instance.client = AsyncIOMotorClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=1500
        )
        # Verify connection with strict timeout fallback
        import asyncio
        await asyncio.wait_for(db_instance.client.admin.command('ping'), timeout=1.5)
        db_instance.db = db_instance.client.get_default_database("floodguard_db")
        db_instance.is_connected = True
        logger.info("Connected to MongoDB Atlas successfully.")
    except Exception as e:
        logger.warning(f"Failed to connect to MongoDB Atlas: {e}. Falling back to in-memory storage.")
        db_instance.is_connected = False

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB client connection closed.")

def get_database():
    if db_instance.is_connected:
        return db_instance.db
    return None
