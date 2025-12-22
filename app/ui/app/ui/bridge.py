
from app.core.behavior import Behavior
from app.core.care import CareActions
from app.utils.visual_state import get_visual_state
from app.utils.audio import get_audio_cue


class NyxtheraBridge:
    """
    UI-facing interface for Nyxthera.
    No UI logic allowed here.
    """

    def __init__(self):
        self.behavior = Behavior()

    def send_input(self, user_input: str) -> str:
        """
        Main interaction entry point.
        """
        return self.behavior.react_to_input(user_input)

    def get_status(self) -> dict:
        """
        Returns a snapshot of Nyxthera's internal state.
        """
        personality = self.behavior.personality

        status = CareActions.check_status(personality)
        status["visual_state"] = get_visual_state(personality)
        status["audio_cue"] = get_audio_cue(personality)

        return status