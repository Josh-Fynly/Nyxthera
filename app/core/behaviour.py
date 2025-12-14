from app.models.emotion_model import EmotionModel

class Behavior:
    """
    Handles Nyxthera's reactions based on emotional state and personality traits.
    """

    def __init__(self):
        self.emotion_model = EmotionModel()

    def react_to_input(self, user_input: str) -> str:
        """
        Returns a behavior response based on detected emotion.
        """
        emotion = self.emotion_model.detect(user_input)

        if emotion == "positive":
            return "Nyxthera flutters happily, eyes glowing softly."
        elif emotion == "negative":
            return "Nyxthera hunches slightly, wings drooping, emitting a soft hum."
        else:
            return "Nyxthera tilts its head curiously, observing you."