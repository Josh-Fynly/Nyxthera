# api/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.personality import Personality

app = FastAPI()

# Allow browser frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize personality system
personality = Personality()


@app.post("/ai/suggest")
def ai_suggest(data: dict):
    user_input = data.get("input", "")

    # simple placeholder emotional vector
    vector = personality.respond()

    return {
        "vector": vector
    }