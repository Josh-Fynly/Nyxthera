import random
from datetime import datetime, timedelta


class Personality:
    """
    Nyxthera's evolving personality core.
    Includes trust, bonding, energy, fatigue, and health.
    """

    def __init__(self):
        # Stable traits
        self.loyalty = 0.9
        self.curiosity = 0.8
        self.caring = 0.85

        # Evolving states
        self.trust = 0.6
        self.bond = 0.4
        self.energy = 0.8

        # Health
        self.health = "healthy"  # healthy | unwell | recovering

        self.last_interaction = datetime.utcnow()

    def rest(self):
        if self.health == "healthy":
            self.energy = min(1.0, self.energy + 0.05)
        else:
            self.energy = min(0.9, self.energy + 0.02)

    def maybe_get_sick(self):
        """
        Very rare sickness trigger.
        """
        if self.energy < 0.25 and self.health == "healthy":
            if random.random() < 0.05:
                self.health = "unwell"

    def recover(self):
        if self.health == "unwell" and self.energy > 0.6:
            self.health = "recovering"
        elif self.health == "recovering" and self.energy > 0.8:
            self.health = "healthy"

    def evolve(self, emotion: str):
        now = datetime.utcnow()
        idle_time = now - self.last_interaction

        if idle_time > timedelta(minutes=2):
            self.rest()

        self.last_interaction = now

        if emotion == "positive":
            self.trust = min(1.0, self.trust + 0.02)
            self.bond = min(1.0, self.bond + 0.015)
            self.energy = max(0.2, self.energy - 0.015)

        elif emotion == "negative":
            self.trust = max(0.0, self.trust - 0.03)
            self.bond = max(0.0, self.bond - 0.01)
            self.energy = max(0.2, self.energy - 0.05)

        else:
            self.energy = max(0.3, self.energy - 0.01)

        self.maybe_get_sick()
        self.recover()

    def get_mood(self):
        if self.health == "unwell":
            return "unwell"

        if self.energy < 0.35:
            return "tired"

        score = (
            self.trust * 0.3
            + self.bond * 0.3
            + self.energy * 0.4
        )

        if score > 0.75:
            return "bonded"
        elif score > 0.5:
            return "calm"
        return "guarded"

    def respond(self):
        mood = self.get_mood()

        responses = {
            "bonded": [
                "Nyxthera stays close, clearly comfortable with you.",
                "Nyxthera hums softly, sharing a warm presence."
            ],
            "calm": [
                "Nyxthera watches quietly, breathing steady.",
                "Nyxthera acknowledges you calmly."
            ],
            "guarded": [
                "Nyxthera observes carefully, conserving strength."
            ],
            "tired": [
                "Nyxthera rests her wings, movements slower than usual."
            ],
            "unwell": [
                "Nyxthera remains still, responding softly.",
                "Nyxthera seems low on energy but aware of you."
            ]
        }

        return random.choice(responses[mood])