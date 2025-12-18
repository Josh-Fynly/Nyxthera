
def get_visual_state(personality):
    """
    Maps internal state to visual descriptors.
    UI systems can consume this later.
    """

    if personality.health == "unwell":
        return "dim_glow"

    if personality.energy < 0.35:
        return "low_motion"

    mood = personality.get_mood()

    visuals = {
        "bonded": "warm_glow",
        "calm": "steady_glow",
        "guarded": "faint_glow",
        "tired": "slow_breathing"
    }

    return visuals.get(mood, "neutral")