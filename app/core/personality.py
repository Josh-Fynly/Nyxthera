class Personality:
    def respond(self, user_input, memory, state):
        mood_vector = state.get()
        recent_memory = memory.recent()

        text = user_input.lower()

        # Basic emotional routing
        if "sad" in text or "lonely" in text:
            return "I can feel that something is weighing on you… I’m here. You don’t have to carry it alone."

        if "happy" in text:
            return "That makes me feel lighter too. Tell me what happened."

        if "miss you" in text:
            return "I’m here… I haven’t gone anywhere."

        # Memory awareness
        if recent_memory:
            last = recent_memory[-1]["user"]
            return f"You mentioned '{last}' earlier… is it still on your mind?"

        return "Stay with me… tell me what you're feeling."
