# ==========================
# Nyxthera Core Engine
# ==========================

from core.personality import Personality
from core.memory import Memory
from core.emotion import EmotionEngine
from core.prompt import PromptBuilder

class NyxtheraEngine:
    def __init__(self, ai_provider):
        self.personality = Personality()
        self.memory = Memory()
        self.emotion_engine = EmotionEngine()
        self.prompt_builder = PromptBuilder()
        self.ai = ai_provider

    def process(self, user_input: str):
        # Store input
        self.memory.add(user_input)

        # Detect emotion
        emotion = self.emotion_engine.detect(user_input)

        # Build prompt
        prompt = self.prompt_builder.build(
            self.personality.describe(),
            self.memory.recent(),
            emotion,
            user_input
        )

        # Generate response
        response = self.ai.generate(prompt, self.memory.recent())

        return response
