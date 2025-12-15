from app.models.emotion_model import EmotionModel
from app.core.personality import Personality
from app.core.memory import Memory
from app.core.state import StateManager


class Behavior:
    """
    Full behavior engine with emotion, memory, bonding, fatigue, and persistence.
    """

    def __init__(self):
        self.emotion_model = EmotionModel()
        self.personality = Personality()
        self.memory = Memory()

        # Load previous state
        StateManager.load(self.personality)

    def react_to_input(self, user_input: str) -> str:
        emotion = self.emotion_model.detect(user_input)

        self.memory.store(user_input, emotion)
        self.personality.evolve(emotion)

        response = self.personality.respond()

        # Save after every interaction
        StateManager.save(self.personality)

        return response