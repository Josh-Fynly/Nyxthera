// ---- Mock Nyxthera Bridge (UI Contract) ----
const NyxtheraBridge = {
  send_input: async (text) => {
    // Simulated processing delay
    await delay(400);

    // Very simple mock behavior
    if (text.toLowerCase().includes("hello")) {
      return "Nyxthera inclines her presence toward you.";
    }

    if (text.toLowerCase().includes("how are you")) {
      return "Nyxthera is calm, attentive, and aware of you.";
    }

    return "Nyxthera listens, absorbing your intent.";
  },

  get_status: async () => {
    await delay(100);

    // Mocked abstract states (match Python bridge keys)
    return {
      visual_state: randomChoice([
        "steady_glow",
        "soft_pulse",
        "dim_rest"
      ]),
      audio_cue: randomChoice([
        "soft_hum",
        "steady_breath",
        "neutral_ambience"
      ])
    };
  }
};

// ---- Helpers ----
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- UI Wiring ----
const output = document.getElementById("output");
const input = document.getElementById("input");
const send = document.getElementById("send");
const avatar = document.getElementById("avatar");
const statusLine = document.getElementById("status");

send.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  output.textContent = "Nyxthera is listening…";
  input.value = "";

  // 1. Send input
  const response = await NyxtheraBridge.send_input(text);
  output.textContent = response;

  // 2. Pull state
  const state = await NyxtheraBridge.get_status();
  applyVisualState(state.visual_state);
  applyAudioCue(state.audio_cue);
};

// ---- Visual & Audio Mapping (Abstract) ----
function applyVisualState(state) {
  statusLine.textContent = `State: ${state.replace("_", " ")}`;

  const visuals = {
    steady_glow: "0 0 25px rgba(94,234,212,0.8)",
    soft_pulse: "0 0 15px rgba(94,234,212,0.5)",
    dim_rest: "0 0 6px rgba(94,234,212,0.3)"
  };

  avatar.style.boxShadow = visuals[state] || visuals.steady_glow;
}

function applyAudioCue(cue) {
  // No sound yet — placeholder for future engines
  console.log("Audio cue:", cue);
}
