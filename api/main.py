from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.memory import Memory
from app.core.state import State
from app.core.ai import generate_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

memory = Memory()
state = State()


@app.get("/")
def root():
    return {"status": "Nyxthera AI Active"}


@app.post("/ai/respond")
def ai_respond(data: dict):
    user_input = data.get("input", "")

    # Update emotional state
    state.update(user_input)

    # Generate AI response
    response = generate_response(user_input, memory, state)

    # Save memory
    memory.add(user_input, response)

    return {
        "response": response,
        "state": state.get()
    }
