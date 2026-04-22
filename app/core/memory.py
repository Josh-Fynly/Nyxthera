import json
import os

class Memory:
    def __init__(self, path="data/memory.json"):
        self.path = path
        self.logs = self.load()

    def load(self):
        if not os.path.exists(self.path):
            return []
        try:
            with open(self.path, "r") as f:
                return json.load(f)
        except:
            return []

    def save(self):
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        with open(self.path, "w") as f:
            json.dump(self.logs[-50:], f)  # keep last 50 messages

    def add(self, user_input, response):
        self.logs.append({
            "user": user_input,
            "nyx": response
        })
        self.save()

    def recent(self, n=5):
        return self.logs[-n:]
