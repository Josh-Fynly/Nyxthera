from core.behavior import BehaviorEngine
from core.personality import NyxtheraPersonality

def run():
    print("Starting Nyxthera Virtual Pet...")

    personality = NyxtheraPersonality()
    engine = BehaviorEngine(personality)

    # Test interaction
    response = engine.react("hello")
    print("Nyxthera:", response)

if __name__ == "__main__":
    run()