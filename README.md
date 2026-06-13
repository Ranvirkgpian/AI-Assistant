# 🤖 AI Assistant — Prompt Engineering Project

A web-based AI Assistant built as part of the **Prompt Engineering Major Project** for VaultofCodes. It supports multiple AI providers and performs three distinct functions: answering questions, summarizing text, and generating creative content.

---

## 🌐 Live Demo

> Deployed via GitHub Pages:  
> `https://github.com/Ranvirkgpian/AI-Assistant.git`

---

## 📁 Project Structure
---

## ✨ Features

### Function 1 — Answer Questions
Ask any factual question and receive a clear, accurate, well-structured answer.

**Prompt Design Strategies used:**
- Short direct prompt: `"What is artificial intelligence?"`
- Instructional prompt: `"Explain the water cycle in simple terms."`
- List-based prompt: `"Give me 3 tips for studying effectively."`

---

### Function 2 — Summarize Text
Paste any article or document and choose a summary style.

**Prompt Design Strategies used:**
- Brief overview: `"Write a concise 3-4 sentence overview..."`
- Bullet points: `"Extract the 5 most important points as a bulleted list..."`
- Main argument: `"Identify the central argument and supporting evidence..."`

---

### Function 3 — Creative Content
Generate stories, poems, essays, speeches, and more with full tone and length control.

**Prompt Design Strategies used:**
- Specification prompt: defines type, tone, length, and topic
- Style-driven prompt: `"Write in a dark and moody tone..."`
- Open-ended prompt: `"Write a short story about a robot who learns to dream."`

---

## 🔑 Supported AI Providers

### Google AI Studio
| Model | Description |
|-------|-------------|
| Gemini 2.5 Flash | Fast, efficient multimodal model |
| Gemini 2.5 Flash TTS | Flash with text-to-speech support |
| Gemini 3.1 Flash TTS | Upgraded Flash with TTS |
| Gemini 3 Flash Live | Real-time live Flash model |
| Gemini 3.5 Flash | Latest and most capable Flash model |

### Groq
| Model | Description |
|-------|-------------|
| Llama 3.3 70B | High-capability open model |
| Llama 3.1 8B Instant | Ultra-fast lightweight model |
| Mixtral 8x7B | Mixture-of-experts model |
| Gemma 2 9B | Google's open Gemma model |

---

## 🚀 How to Use

### Step 1 — Get an API Key
- **Google AI Studio** → [aistudio.google.com](https://aistudio.google.com) → Get API Key
- **Groq** → [console.groq.com](https://console.groq.com) → API Keys → Create

### Step 2 — Open the App
- Visit the live GitHub Pages link, or
- Open `index.html` locally in your browser

### Step 3 — Configure the Settings Bar
1. Select your **Provider** (Google AI Studio or Groq)
2. Choose a **Model** from the dropdown
3. Paste your **API Key**
4. Click **Test** to verify the connection

### Step 4 — Use the Assistant
| Sidebar Option | What to do |
|----------------|------------|
| Answer Questions | Type or select a question, click Ask |
| Summarize Text | Paste text, choose summary style, click Summarize |
| Creative Content | Set type, tone, length, enter topic, click Generate |

### Step 5 — Give Feedback
Every response has a 👍 / 👎 feedback button.
The sidebar tracks your **total queries** and **helpful %** in real time.

---

## 🧠 Prompt Engineering Concepts Demonstrated

| Concept | Where used |
|--------|------------|
| Role prompting | All functions (`"You are a knowledgeable assistant..."`) |
| Structured output | Q&A (numbered lists), Summarizer (bullet points) |
| Style injection | Creative (tone + length parameters in prompt) |
| Dynamic prompt building | Summarizer (style guide injected based on user selection) |
| Specificity control | Quick prompt chips vs custom input |

---

## 🔁 Feedback Loop

After every AI response, users can mark it as helpful or not.
- 👍 Yes — increments helpful count
- 👎 No — increments not-helpful count
- Sidebar shows live **Helpful %** across the session

This feedback loop helps evaluate which prompt designs work best.

---

## 🛠️ Built With

- **HTML5** — structure
- **CSS3** — styling and layout
- **Vanilla JavaScript** — logic and API calls
- **Google Generative Language API** — Gemini models
- **Groq API** — Llama, Mixtral, Gemma models
- **Tabler Icons** — UI icons
- **GitHub Pages** — deployment

---

## 👨‍💻 Author

**Your Name**  
VaultofCodes — Prompt Engineering Project  
Batch: 2024–2025

---

## 📄 License

This project was created for educational purposes as part of a prompt engineering course project.
