from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

#middlewares
from app.core.middleware import setup_middlewares

#db connector
from app.database import init_db

#register routes
from app.routes import auth, leaves, employees, performance, rewards

app = FastAPI(title="EngageHub API", version="1.0.0")

#Setup middleware
setup_middlewares(app)

# Initialize DB on startup
@app.on_event("startup")
async def startup_db():
    await init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(leaves.router)
app.include_router(employees.router)
app.include_router(performance.router)
app.include_router(rewards.router)

@app.get("/")
async def root():
    return {"message": "Employee Tracker Backend running 🚀"}
