import random

class NyxtheraPersonality:
    def __init__(self):
        # Base emotional parameters (we will expand later)
        self.energy = 0.7
        self.curiosity = 0.8
        self.affinity = 0.6

    def get_mood(self):
        # Simplified mood logic
        total = (self.energy + self.curiosity + self.affinity) / 3
        if total > 0.75:
            return "warm"
        elif total > 0.5:
            return "neutral"
        else:
            return "moody"

    def get_tone(self, mood):
        if mood == "warm":
            return lambda text: f"[Warm Glow] {text}"
        elif mood == "neutral":
            return lambda text: f"[Soft Pulse] {text}"
        else:
            return lambda text: f"[Dim Flicker] {text}"