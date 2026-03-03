# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services import personality

app = FastAPI()

# Allow local browser frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ai/suggest")
def ai_suggest(data: dict):
    user_input = data.get("input", "")
    vector = personality.suggest(user_input)
    return {"vector": vector}