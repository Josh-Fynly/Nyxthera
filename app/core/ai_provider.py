# app/core/ai_provider.py

import requests

class OllamaProvider:
    def __init__(self, model="llama3"):
        self.url = "http://localhost:11434/api/generate"
        self.model = model

    def generate(self, prompt: str):
        response = requests.post(
            self.url,
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )

        data = response.json()
        return data.get("response", "").strip()
