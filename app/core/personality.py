import random
from datetime import datetime


class Personality:
    """
    Nyxthera's evolving personality core.
    Tracks long-term emotional influence and attachment.
    """

    def __init__(self):
        # Stable traits
        self.loyalty = 0.9
        self.curiosity = 0.8
        self.playfulness = 0.7
        self.caring = 0.85

        # Evolving state
        self.trust = 0.6
        self.energy = 0.8
        self.last_interaction = datetime.utcnow()

    def evolve(self, emotion: str):
        """
        Adjust internal state based on emotional input.
        """
        if emotion == "positive":
            self.trust = min(1.0, self.trust + 0.02)
            self.energy = min(1.0, self.energy + 0.01)
        elif emotion == "negative":
            self.trust = max(0.0, self.trust - 0.03)
            self.energy = max(0.2, self.energy - 0.05)

    def get_mood(self):
        score = (
            self.trust * 0.4
            + self.energy * 0.3
            + self.caring * 0.3
        )

        if score > 0.75:
            return "warm"
        elif score > 0.5:
            return "calm"
        else:
            return "guarded"

    def respond(self):
        mood = self.get_mood()

        responses = {
            "warm": [
                "Nyxthera leans closer, eyes glowing with quiet affection.",
                "Nyxthera hums softly, clearly pleased by your presence."
            ],
            "calm": [
                "Nyxthera watches attentively, tail swaying slowly.",
                "Nyxthera gives a gentle nod, acknowledging you."
            ],
            "guarded": [
                "Nyxthera keeps some distance, studying you carefully.",
                "Nyxthera folds her wings slightly, alert but calm."
            ]
        }

        return random.choice(responses[mood])