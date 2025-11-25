class BehaviourEngine:
    def __init__(self, personality):
        self.personality = personality

    def react(self, user_input: str) -> str:
        mood = self.personality.get_mood()
        style = self.personality.get_tone(mood)

        # Very basic placeholder logic for now:
        if "hello" in user_input.lower():
            return style("Nyxthera flutters gently and greets you back.")
        else:
            return style("Nyxthera tilts its head in mild curiosity.")