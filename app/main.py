from core.behavior import Behavior


def main():
    behavior = Behavior()
    print("Nyxthera is awake. Speak freely. Type 'exit' to leave.")

    while True:
        user_input = input("You: ")

        if user_input.lower() in ["exit", "quit"]:
            print("Nyxthera watches as you depart.")
            break

        response = behavior.react_to_input(user_input)
        print(f"Nyxthera: {response}")


if __name__ == "__main__":
    main()