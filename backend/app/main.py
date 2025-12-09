from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.core.config import settings
from app.routers import tasks, incidents, chat, auth, attendance, permissions
from app.core.websocket import manager
from app.models import User, Team, Task, Incident, Message, Attendance, PermissionRequest # Ensure models are loaded
import json
import redis.asyncio as redis
import asyncio
import sys
import os

# Add current directory to Python path for agent import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append('/app')

# Import agent functionality
try:
    from agent import WorkflowAgent
    AGENT_AVAILABLE = True
    print("✅ Agent imported successfully")
except ImportError as e:
    AGENT_AVAILABLE = False
    print(f"❌ Agent import failed: {e}")

# Initialize agent if available
if AGENT_AVAILABLE:
    try:
        agent = WorkflowAgent()
        print("✅ Agent initialized successfully")
    except Exception as e:
        AGENT_AVAILABLE = False
        print(f"❌ Agent initialization failed: {e}")

app = FastAPI(title="Workhub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://workhub-1.vercel.app",
        "https://workhub-1-hf61gxu6u-shanmukhs-projects-e0a15372.vercel.app"  # New Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(incidents.router)
app.include_router(chat.router)
app.include_router(auth.router)
app.include_router(attendance.router)
app.include_router(permissions.router)

redis_client = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)

async def redis_listener():
    try:
        # For production without Redis, handle gracefully
        if settings.REDIS_URL and "redis://" in settings.REDIS_URL:
            pubsub = redis_client.pubsub()
            await pubsub.subscribe("workhub_responses")
            print("✅ Redis listener started")
        else:
            print("⚠️ No Redis URL provided - AI features may be limited")
            return
            
        async for message in pubsub.listen():
            if message["type"] == "message":
                data = json.loads(message["data"])
                sender_id = data.get("sender_id")
                content = data.get("content")
                
                if content and sender_id and AGENT_AVAILABLE:
                    try:
                        # Process with AI agent
                        response = await agent.process_message(content, sender_id)
                        
                        # Send AI response to the specific worker
                        await manager.send_to_worker(sender_id, f"Agent: {response}")
                        
                        # Send to manager as well
                        from app.core.database import AsyncSessionLocal
                        from app.models.user import User
                        from sqlalchemy import select
                        
                        async with AsyncSessionLocal() as db:
                            result = await db.execute(select(User).where(User.id == sender_id))
                            worker = result.scalar_one_or_none()
                            
                            if worker and worker.team_id:
                                manager_result = await db.execute(
                                    select(User).where(
                                        User.team_id == worker.team_id,
                                        User.role == "Manager"
                                    )
                                )
                                team_manager = manager_result.scalar_one_or_none()
                                
                                if team_manager:
                                    ai_response_data = {
                                        "type": "ai_response",
                                        "content": response,
                                        "worker_id": sender_id,
                                        "worker_name": worker.full_name or worker.email,
                                        "timestamp": "now"
                                    }
                                    await manager.send_to_manager(team_manager.id, ai_response_data)
                                    
                    except Exception as e:
                        print(f"❌ Agent processing error: {e}")
                        # Fallback response
                        await manager.send_to_worker(sender_id, "I received your message. A manager will respond soon.")
                        
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("⚠️ Running without Redis - direct message handling only")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Start Redis listener if available
    try:
        if settings.REDIS_URL and "redis://" in settings.REDIS_URL:
            asyncio.create_task(redis_listener())
            print("✅ Redis listener task started")
        else:
            print("⚠️ Redis not configured - running in direct mode")
    except Exception as e:
        print(f"❌ Failed to start Redis listener: {e}")

@app.get("/")
async def root():
    return {"message": "Workhub API is running"}

@app.post("/api/chat/direct")
async def direct_chat(message_data: dict):
    """Direct chat endpoint that works without Redis"""
    try:
        content = message_data.get('content')
        sender_id = message_data.get('sender_id')
        
        if not content or not sender_id:
            return {"error": "Missing content or sender_id"}
            
        if AGENT_AVAILABLE:
            try:
                response = await agent.process_message(content, sender_id)
                return {"response": response, "status": "success"}
            except Exception as e:
                print(f"❌ Agent error: {e}")
                return {"response": "I received your message. A manager will respond soon.", "status": "fallback"}
        else:
            return {"response": "I received your message. A manager will respond soon.", "status": "no_agent"}
            
    except Exception as e:
        print(f"❌ Direct chat error: {e}")
        return {"error": "Failed to process message", "status": "error"}
