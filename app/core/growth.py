class GrowthEngine:
    """
    Handles Nyxthera's long-term evolution.
    """

    def __init__(self):
        self.stage = "hatchling"
        self.interactions = 0

    def register_interaction(self):
        self.interactions += 1

    def evaluate_stage(self, personality):
        """
        Determines growth stage based on experience and bonding.
        """

        if self.stage == "hatchling" and self.interactions >= 10:
            self.stage = "juvenile"

        elif (
            self.stage == "juvenile"
            and self.interactions >= 30
            and personality.bond >= 0.6
        ):
            self.stage = "sentinel"

        return self.stage

    def apply_growth_effects(self, personality):
        """
        Subtle personality stabilization as Nyxthera matures.
        """

        if self.stage == "juvenile":
            personality.trust = min(1.0, personality.trust + 0.01)

        elif self.stage == "sentinel":
            personality.energy = max(0.4, personality.energy)
            personality.trust = min(1.0, personality.trust + 0.02)
