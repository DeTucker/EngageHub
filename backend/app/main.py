from fastapi import FastAPI

#middlewares
from app.core.middleware import setup_middlewares

#db connector
from app.database import init_db

#register routes
from app.routes import auth

app = FastAPI()

#Setup middleware
setup_middlewares(app)

# Initialize DB on startup
@app.on_event("startup")
async def startup_db():
    await init_db()

app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Employee Tracker Backend running 🚀"}
