import random

class Personality:
    """
    Nyxthera's personality engine.
    Handles traits, evolving moods, and adaptive behaviors.
    """

    def __init__(self):
        # Base personality traits (0 to 1)
        self.loyalty = 0.9
        self.curiosity = 0.8
        self.playfulness = 0.7
        self.mischief = 0.3
        self.caring = 0.85
        self.energy = 0.8

    def get_mood(self):
        """
        Compute mood dynamically based on traits and random factors.
        """
        score = (
            self.loyalty * 0.2
            + self.curiosity * 0.2
            + self.playfulness * 0.2
            + self.mischief * 0.1
            + self.caring * 0.2
            + self.energy * 0.1
        )
        if score > 0.75:
            return "warm"
        elif score > 0.5:
            return "neutral"
        else:
            return "moody"

    def react(self, situation: str) -> str:
        """
        Generate a personality-based reaction to a situation.
        """
        mood = self.get_mood()

        responses = {
            "warm": [
                "Nyxthera purrs softly, nuzzling you affectionately.",
                "Nyxthera flutters excitedly, eager to play."
            ],
            "neutral": [
                "Nyxthera observes quietly, tilting its head curiously.",
                "Nyxthera gives a small, polite chirp."
            ],
            "moody": [
                "Nyxthera flaps her wings slowly, eyes narrowing slightly.",
                "Nyxthera withdraws, appearing cautious and reserved."
            ]
        }

        return random.choice(responses[mood])