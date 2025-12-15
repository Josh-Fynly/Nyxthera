import json
import os


class StateManager:
    FILE = "nyxthera_state.json"

    @classmethod
    def save(cls, personality):
        data = {
            "trust": personality.trust,
            "bond": personality.bond,
            "energy": personality.energy,
            "health": personality.health
        }

        with open(cls.FILE, "w") as f:
            json.dump(data, f)

    @classmethod
    def load(cls, personality):
        if not os.path.exists(cls.FILE):
            return

        with open(cls.FILE, "r") as f:
            data = json.load(f)

        personality.trust = data.get("trust", personality.trust)
        personality.bond = data.get("bond", personality.bond)
        personality.energy = data.get("energy", personality.energy)
        personality.health = data.get("health", personality.health)