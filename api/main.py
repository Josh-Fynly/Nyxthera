# api/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.personality import Personality

app = FastAPI()

# allow browser frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize personality engine
personality = Personality()


@app.post("/ai/suggest")
def ai_suggest(data: dict):

    user_input = data.get("input", "")

    response = personality.respond()

    return {
        "response": response
    }