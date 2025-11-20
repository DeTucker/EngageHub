import motor.motor_asyncio
from app.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.MONGO_DB]

async def init_db():
    # Check connection
    await db.command("ping")
    print("✅ Connected to MongoDB")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.leaves.create_index("user_id")
    await db.leaves.create_index("status")
    await db.performance.create_index("employee_id")
    await db.rewards.create_index("recipient_id")
    print("✅ Database indexes created")
