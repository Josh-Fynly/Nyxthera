from core.behaviour import BehaviourEngine
from core.personality import NyxtheraPersonality

def run():
    print("Starting Nyxthera Virtual Pet...")

    personality = NyxtheraPersonality()
    engine = BehaviourEngine(personality)

    # Test interaction
    response = engine.react("hello")
    print("Nyxthera:", response)

if __name__ == "__main__":
    run()