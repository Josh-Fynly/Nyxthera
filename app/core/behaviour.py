from app.models.emotion_model import EmotionModel
from app.core.personality import Personality
from app.core.memory import Memory


class Behavior:
    """
    Emotion + personality + memory driven behavior.
    """

    def __init__(self):
        self.emotion_model = EmotionModel()
        self.personality = Personality()
        self.memory = Memory()

    def react_to_input(self, user_input: str) -> str:
        emotion = self.emotion_model.detect(user_input)

        # Store memory
        self.memory.store(user_input, emotion)

        # Evolve personality
        self.personality.evolve(emotion)

        trend = self.memory.emotional_trend()
        last_topic = self.memory.recall_last_topic()

        base_response = {
            "positive": "Nyxthera brightens, energy flowing through her form.",
            "negative": "Nyxthera lowers her posture, sensing emotional weight.",
            "neutral": "Nyxthera remains attentive, quietly observing."
        }

        personality_response = self.personality.respond()

        memory_hint = ""
        if last_topic and trend != "neutral":
            memory_hint = f" She seems to remember when you mentioned '{last_topic}'."

        return f"{base_response[emotion]} {personality_response}{memory_hint}"