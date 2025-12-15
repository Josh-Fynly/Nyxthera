from app.models.emotion_model import EmotionModel
from app.core.personality import Personality


class Behavior:
    """
    Emotion-driven behavior layer.
    """

    def __init__(self):
        self.emotion_model = EmotionModel()
        self.personality = Personality()

    def react_to_input(self, user_input: str) -> str:
        emotion = self.emotion_model.detect(user_input)

        # Evolve personality over time
        self.personality.evolve(emotion)

        base_response = {
            "positive": "Nyxthera lifts her head, energy flowing through her form.",
            "negative": "Nyxthera lowers her stance, sensing unease.",
            "neutral": "Nyxthera remains still, quietly attentive."
        }

        personality_response = self.personality.respond()

        return f"{base_response[emotion]} {personality_response}"