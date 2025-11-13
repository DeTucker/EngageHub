from fastapi.middleware.cors import CORSMiddleware

def setup_middlewares(app):
    origins = [
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,       # or ["*"] for all origins (not recommended in prod)
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
