from app.models.emotion_model import EmotionModel
from app.core.personality import Personality
from app.core.memory import Memory
from app.core.state import StateManager
from app.core.growth import GrowthEngine


class Behavior:
    """
    Full behavior engine with emotion, memory, bonding,
    fatigue, persistence, and long-term growth.
    """

    def __init__(self):
        self.emotion_model = EmotionModel()
        self.personality = Personality()
        self.memory = Memory()
        self.growth = GrowthEngine()

        # Load previous state
        StateManager.load(self.personality)

    def react_to_input(self, user_input: str) -> str:
        # 1. Detect emotional signal
        emotion = self.emotion_model.detect(user_input)

        # 2. Store memory and evolve personality
        self.memory.store(user_input, emotion)
        self.personality.evolve(emotion)

        # 3. Register growth (EVERY interaction)
        self.growth.register_interaction()
        self.growth.evaluate_stage(self.personality)
        self.growth.apply_growth_effects(self.personality)

        # 4. Generate response
        response = self.personality.respond()

        # 5. Persist state
        StateManager.save(self.personality)

        return response