// ---- Mock Nyxthera Bridge (UI Contract) ----
const NyxtheraBridge = {
  send_input: async (text) => {
    // Simulated processing delay
    await delay(400);

    // Simple mock responses
    const lower = text.toLowerCase();
    if (lower.includes("hello")) {
      return "Nyxthera inclines her presence toward you.";
    }
    if (lower.includes("how are you")) {
      return "Nyxthera is calm, attentive, and aware of you.";
    }
    return "Nyxthera listens, absorbing your intent.";
  },

  get_status: async () => {
    await delay(100);

    // Mocked visual/audio states
    return {
      visual_state: randomChoice([
        "steady_glow",
        "soft_pulse",
        "alert_shimmer",
        "dim_rest",
        "fractured_glow"
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

  // Reset avatar class
  avatar.className = "";

  const map = {
    steady_glow: "avatar-steady",
    soft_pulse: "avatar-pulse",
    alert_shimmer: "avatar-alert",
    dim_rest: "avatar-rest",
    fractured_glow: "avatar-fractured"
  };

  avatar.classList.add(map[state] || "avatar-steady");
}

function applyAudioCue(cue) {
  // Placeholder for future audio implementation
  console.log("Audio cue:", cue);
}