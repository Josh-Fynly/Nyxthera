# ==========================
# Nyxthera AI Backend
# ==========================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import requests

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# CONFIG
# ==========================
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ==========================
# AI RESPONSE ENDPOINT
# ==========================
@app.post("/ai/respond")
def ai_respond(data: dict):
    user_input = data.get("input", "")

    if not OPENAI_API_KEY:
        return {"error": "No API key configured"}

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are Nyxthera, an emotionally intelligent AI companion. Be warm, supportive, calm, and human-like."
                    },
                    {
                        "role": "user",
                        "content": user_input
                    }
                ]
            }
        )

        result = response.json()

        ai_text = result["choices"][0]["message"]["content"]

        return {"response": ai_text}

    except Exception as e:
        return {"error": str(e)}