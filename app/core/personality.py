import random
from datetime import datetime


class Personality:
    """
    Nyxthera's evolving personality core.
    Includes trust, bonding, and emotional regulation.
    """

    def __init__(self):
        # Stable traits
        self.loyalty = 0.9
        self.curiosity = 0.8
        self.caring = 0.85

        # Evolving states
        self.trust = 0.6
        self.bond = 0.4   # NEW: attachment/familiarity level
        self.energy = 0.8

        self.last_interaction = datetime.utcnow()

    def evolve(self, emotion: str):
        """
        Adjust internal state based on emotional input.
        """
        if emotion == "positive":
            self.trust = min(1.0, self.trust + 0.02)
            self.bond = min(1.0, self.bond + 0.015)
            self.energy = min(1.0, self.energy + 0.01)

        elif emotion == "negative":
            self.trust = max(0.0, self.trust - 0.03)
            self.bond = max(0.0, self.bond - 0.01)
            self.energy = max(0.2, self.energy - 0.05)

    def get_mood(self):
        """
        Mood reflects trust, bond, and energy.
        """
        score = (
            self.trust * 0.35
            + self.bond * 0.35
            + self.energy * 0.3
        )

        if score > 0.75:
            return "bonded"
        elif score > 0.5:
            return "calm"
        else:
            return "guarded"

    def respond(self):
        mood = self.get_mood()

        responses = {
            "bonded": [
                "Nyxthera moves closer, clearly comfortable with you.",
                "Nyxthera hums softly, sharing a quiet moment with you."
            ],
            "calm": [
                "Nyxthera watches attentively, tail swaying slowly.",
                "Nyxthera acknowledges you with a gentle nod."
            ],
            "guarded": [
                "Nyxthera keeps a respectful distance, observing quietly.",
                "Nyxthera remains alert, wings partially folded."
            ]
        }

        return random.choice(responses[mood])