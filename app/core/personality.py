import random
from datetime import datetime, timedelta


class Personality:
    """
    Nyxthera's evolving personality core.
    Includes trust, bonding, energy, and fatigue.
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

        self.last_interaction = datetime.utcnow()

    def rest(self):
        """
        Natural recovery when idle.
        """
        self.energy = min(1.0, self.energy + 0.05)

    def evolve(self, emotion: str):
        """
        Adjust internal state based on emotional input.
        """
        now = datetime.utcnow()
        idle_time = now - self.last_interaction

        # Recover slightly if idle
        if idle_time > timedelta(minutes=2):
            self.rest()

        self.last_interaction = now

        if emotion == "positive":
            self.trust = min(1.0, self.trust + 0.02)
            self.bond = min(1.0, self.bond + 0.015)
            self.energy = max(0.2, self.energy - 0.02)

        elif emotion == "negative":
            self.trust = max(0.0, self.trust - 0.03)
            self.bond = max(0.0, self.bond - 0.01)
            self.energy = max(0.2, self.energy - 0.05)

        else:
            self.energy = max(0.3, self.energy - 0.01)

    def get_mood(self):
        score = (
            self.trust * 0.3
            + self.bond * 0.3
            + self.energy * 0.4
        )

        if self.energy < 0.35:
            return "tired"
        elif score > 0.75:
            return "bonded"
        elif score > 0.5:
            return "calm"
        else:
            return "guarded"

    def respond(self):
        mood = self.get_mood()

        responses = {
            "bonded": [
                "Nyxthera stays close, clearly at ease with you.",
                "Nyxthera hums softly, sharing a peaceful presence."
            ],
            "calm": [
                "Nyxthera watches quietly, breathing steady.",
                "Nyxthera acknowledges you with calm attention."
            ],
            "guarded": [
                "Nyxthera observes cautiously, conserving energy.",
                "Nyxthera remains alert but reserved."
            ],
            "tired": [
                "Nyxthera curls slightly, wings resting.",
                "Nyxthera blinks slowly, clearly needing rest."
            ]
        }

        return random.choice(responses[mood])