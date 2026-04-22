class State:
    def __init__(self):
        # [calm, happy, sad, attached]
        self.vector = [0.6, 0.4, 0.3, 0.2]

    def update(self, user_input: str):
        text = user_input.lower()

        if "sad" in text or "lonely" in text:
            self.vector[2] += 0.1  # sadness
            self.vector[0] -= 0.05

        if "happy" in text:
            self.vector[1] += 0.1

        if "miss you" in text or "love" in text:
            self.vector[3] += 0.1  # attachment

        # clamp values
        self.vector = [max(0, min(1, v)) for v in self.vector]

    def get(self):
        return self.vector
