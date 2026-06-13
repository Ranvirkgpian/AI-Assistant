// ── API Configuration ──────────────────────────────────────────────
const PROVIDERS = {
  google: {
    name: "Google AI Studio",
    models: [
      { id: "gemini-2.5-flash",         label: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-flash-tts",     label: "Gemini 2.5 Flash TTS" },
      { id: "gemini-3.1-flash-tts",     label: "Gemini 3.1 Flash TTS" },
      { id: "gemini-3-flash-live",      label: "Gemini 3 Flash Live" },
      { id: "gemini-3.5-flash",         label: "Gemini 3.5 Flash" },
    ]
  },
  groq: {
    name: "Groq",
    models: [
      { id: "llama-3.3-70b-versatile",          label: "Llama 3.3 70B" },
      { id: "llama-3.1-8b-instant",             label: "Llama 3.1 8B Instant" },
      { id: "mixtral-8x7b-32768",               label: "Mixtral 8x7B" },
      { id: "gemma2-9b-it",                     label: "Gemma 2 9B" },
    ]
  }
};

let totalQ = 0, helpful = 0, notHelpful = 0, sumStyle = "Brief overview";
let selectedProvider = "google";
let selectedModel = PROVIDERS.google.models[0].id;
let apiKey = "";

// ── On page load: build settings UI ────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  buildSettingsBar();
});

function buildSettingsBar() {
  const bar = document.getElementById("settings-bar");
  if (!bar) return;
  bar.innerHTML = `
    <div class="settings-row">
      <div class="setting-group">
        <label class="setting-label">Provider</label>
        <select id="provider-select" onchange="onProviderChange()">
          <option value="google">Google AI Studio</option>
          <option value="groq">Groq</option>
        </select>
      </div>
      <div class="setting-group">
        <label class="setting-label">Model</label>
        <select id="model-select" onchange="selectedModel = this.value">
        </select>
      </div>
      <div class="setting-group api-key-group">
        <label class="setting-label">API Key</label>
        <input type="password" id="api-key-input" placeholder="Paste your API key here…" oninput="apiKey = this.value" />
      </div>
      <div class="setting-group">
        <button class="test-btn" onclick="testConnection()">Test ↗</button>
      </div>
    </div>
    <div id="connection-status"></div>
  `;
  populateModels();
}

function onProviderChange() {
  selectedProvider = document.getElementById("provider-select").value;
  selectedModel = PROVIDERS[selectedProvider].models[0].id;
  populateModels();
  document.getElementById("api-key-input").value = "";
  apiKey = "";
  document.getElementById("connection-status").innerHTML = "";
}

function populateModels() {
  const sel = document.getElementById("model-select");
  sel.innerHTML = PROVIDERS[selectedProvider].models
    .map(m => `<option value="${m.id}">${m.label}</option>`)
    .join("");
  selectedModel = sel.value;
  sel.onchange = () => { selectedModel = sel.value; };
}

async function testConnection() {
  const status = document.getElementById("connection-status");
  if (!apiKey) { status.innerHTML = `<span class="status-error">⚠ Please enter an API key first.</span>`; return; }
  status.innerHTML = `<span class="status-loading">Testing connection…</span>`;
  try {
    const result = await callAPI("Say hello in one word.");
    status.innerHTML = `<span class="status-ok">✓ Connected — ${PROVIDERS[selectedProvider].name} (${selectedModel})</span>`;
  } catch(e) {
    status.innerHTML = `<span class="status-error">✗ Failed: ${e.message}</span>`;
  }
}

// ── Core API caller ─────────────────────────────────────────────────
async function callAPI(prompt) {
  if (!apiKey) throw new Error("No API key set. Please add your key in the settings bar above.");

  if (selectedProvider === "google") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
  }

  if (selectedProvider === "groq") {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices?.[0]?.message?.content || "No response.";
  }
}

// ── UI Helpers ──────────────────────────────────────────────────────
function switchPanel(name) {
  ["home","qa","summary","creative"].forEach(p => {
    document.getElementById("panel-"+p).classList.remove("active");
    const nav = document.getElementById("nav-"+p);
    if (nav) nav.classList.remove("active");
  });
  document.getElementById("panel-"+name).classList.add("active");
  const nav = document.getElementById("nav-"+name);
  if (nav) nav.classList.add("active");
}

function fillQA(txt) { document.getElementById("qa-input").value = txt; }
function fillCreative(topic) { document.getElementById("cr-topic").value = topic; }

function selOpt(el, val) {
  document.getElementById("sum-opts").querySelectorAll(".opt-btn").forEach(b => b.classList.remove("sel"));
  el.classList.add("sel");
  sumStyle = val;
}

function resultHTML(id) {
  return `
    <div class="result-card" id="rc-${id}">
      <div class="rc-header">
        <span class="rc-label">Response</span>
        <span style="font-size:11px;color:#aaa;" id="rc-time-${id}"></span>
      </div>
      <div class="rc-body" id="rc-body-${id}"><span class="loader-dot"></span> Thinking…</div>
      <div class="fb-bar">
        <span class="fb-label">Was this helpful?</span>
        <button class="fb-btn" onclick="markFB('${id}','yes')">👍 Yes</button>
        <button class="fb-btn" onclick="markFB('${id}','no')">👎 No</button>
      </div>
    </div>`;
}

function markFB(id, val) {
  const btns = document.getElementById("rc-"+id)?.querySelectorAll(".fb-btn");
  if (!btns) return;
  btns[0].className = "fb-btn" + (val==="yes" ? " good" : "");
  btns[1].className = "fb-btn" + (val==="no" ? " bad" : "");
  if (val==="yes") helpful++; else notHelpful++;
  const total = helpful + notHelpful;
  document.getElementById("stat-helpful").textContent = total > 0 ? Math.round(helpful/total*100)+"%" : "—";
}

function updateStats() {
  totalQ++;
  document.getElementById("stat-queries").textContent = totalQ;
}

async function runWithUI(prompt, resultContainerId, historyId, historyLabel, btnId) {
  const btn = document.getElementById(btnId);
  btn.disabled = true;
  updateStats();
  const id = btnId + Date.now();
  document.getElementById(resultContainerId).innerHTML = resultHTML(id);
  const t0 = Date.now();
  try {
    const text = await callAPI(prompt);
    document.getElementById("rc-body-"+id).textContent = text;
    document.getElementById("rc-time-"+id).textContent = ((Date.now()-t0)/1000).toFixed(1)+"s";
  } catch(e) {
    document.getElementById("rc-body-"+id).textContent = "Error: " + e.message;
  }
  addHistory(historyId, historyLabel);
  btn.disabled = false;
}

// ── Function 1: Q&A ─────────────────────────────────────────────────
async function runQA() {
  const q = document.getElementById("qa-input").value.trim();
  if (!q) return;
  const prompt = `You are a knowledgeable assistant. Answer the following question clearly and accurately. If factual, be precise. If it needs steps, use a numbered list. Keep it concise but complete.\n\nQuestion: ${q}`;
  await runWithUI(prompt, "qa-result", "qa-history", q, "qa-btn");
}

// ── Function 2: Summarize ───────────────────────────────────────────
async function runSummary() {
  const txt = document.getElementById("sum-input").value.trim();
  if (!txt) return;
  const styleGuide = {
    "Brief overview": "Write a concise 3-4 sentence overview capturing the main idea and key points.",
    "Key bullet points": "Extract the 5 most important points as a clean bulleted list.",
    "Main argument & evidence": "Identify the central argument and list the key evidence or examples used to support it."
  };
  const prompt = `You are a professional text summarizer. ${styleGuide[sumStyle]}\n\nText to summarize:\n${txt}`;
  await runWithUI(prompt, "sum-result", "sum-history", txt.slice(0,60)+"…", "sum-btn");
}

// ── Function 3: Creative ────────────────────────────────────────────
async function runCreative() {
  const topic = document.getElementById("cr-topic").value.trim();
  if (!topic) { document.getElementById("cr-topic").focus(); return; }
  const type = document.getElementById("cr-type").value;
  const tone = document.getElementById("cr-tone").value;
  const length = document.getElementById("cr-length").value;
  const prompt = `You are a gifted creative writer. Write a ${type} about: "${topic}".\n\nRequirements:\n- Tone: ${tone}\n- Length: ${length}\n- Make it original, vivid, and memorable\n- Begin directly with the content, no title header`;
  await runWithUI(prompt, "cr-result", "cr-history", `${type} about "${topic}"`, "cr-btn");
}

// ── History ─────────────────────────────────────────────────────────
function addHistory(containerId, label) {
  const c = document.getElementById(containerId);
  if (!c.querySelector(".hl-title")) {
    const t = document.createElement("div");
    t.className = "hl-title";
    t.textContent = "Recent queries";
    c.appendChild(t);
  }
  const el = document.createElement("div");
  el.className = "hl-item";
  el.innerHTML = `<span>${label}</span><span>${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>`;
  c.insertBefore(el, c.children[1] || null);
}