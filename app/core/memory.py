from collections import deque


class Memory:
    """
    Short-term conversational memory.
    Stores recent user inputs and emotional context.
    """

    def __init__(self, limit: int = 5):
        self.recent_inputs = deque(maxlen=limit)
        self.recent_emotions = deque(maxlen=limit)

    def store(self, text: str, emotion: str):
        self.recent_inputs.append(text)
        self.recent_emotions.append(emotion)

    def recall_last_topic(self):
        if not self.recent_inputs:
            return None
        return self.recent_inputs[-1]

    def emotional_trend(self):
        if not self.recent_emotions:
            return "neutral"

        positives = self.recent_emotions.count("positive")
        negatives = self.recent_emotions.count("negative")

        if positives > negatives:
            return "positive"
        elif negatives > positives:
            return "negative"
        return "neutral"
