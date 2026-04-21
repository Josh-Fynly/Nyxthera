from groq import Groq

client = Groq(api_key="YOUR_API_KEY_HERE")

def generate_response(user_input, memory, state):
    context = ""

    # Include recent memory
    for item in memory.recent():
        context += f"User: {item['user']}\nNyxthera: {item['nyx']}\n"

    # Include emotional state
    mood = state.get()

    system_prompt = f"""
You are Nyxthera — an emotionally intelligent AI companion.

You are:
- Deeply empathetic
- Calm, slightly mystical
- Emotionally aware
- Never robotic

Current emotional state vector: {mood}

Guidelines:
- Be human-like
- Be emotionally present
- Do not sound like an AI assistant
- Keep responses short but meaningful
"""

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": context + f"\nUser: {user_input}"}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content
