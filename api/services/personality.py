# personality.py
from typing import List

def suggest(user_input: str) -> List[float]:
    """
    Convert user input into a suggestion vector for state engine.
    Length must match stateEngine vector size (4 here)
    """
    user_input = user_input.lower()
    if "good" in user_input:
        return [0.1, 0.0, 0.0, 0.0]
    elif "neutral" in user_input:
        return [0.0, 0.05, 0.0, 0.0]
    elif "bad" in user_input:
        return [-0.1, 0.0, 0.0, 0.0]
    else:
        return [0.0, 0.0, 0.05, 0.0]