# api/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.personality import Personality
from app.core.memory import Memory
from app.core.state import State
from app.core.ai import AIEngine

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize systems
state = State()
memory = Memory()
ai = AIEngine()
personality = Personality()


@app.post("/chat")
async def chat(data: dict):
    user_input = data.get("input", "")

    # 1. Update emotional state
    emotion = state.update(user_input)

    # 2. Store memory
    memory.store(user_input)

    # 3. Generate AI response
    response = ai.generate(user_input, emotion, memory.logs)

    # 4. Personality shaping
    final_response = personality.format(response, emotion)

    return {
        "response": final_response,
        "emotion": emotion
    }
