# Nao Medical Translator 🏥

A real-time, AI-powered medical translation and scribe tool built with **Next.js 14** and **Google Gemini 2.5 Flash**.

**Live Demo:** [Insert your Vercel Link Here]

## 🚀 Overview
This application bridges the communication gap between doctors and patients who speak different languages. It acts as an "Agentic Intermediary" that:
1.  **Listens:** captures voice input in real-time.
2.  **Translates:** converts English ↔ Spanish instantly with low latency.
3.  **Scribes:** generates structured clinical notes (SOAP format) automatically using LLMs.

## 🛠️ Tech Stack
* **Framework:** Next.js 14 (App Router)
* **AI Model:** Google Gemini 2.5 Flash (via Google Generative AI SDK)
* **State Management:** React Hooks (Lifted State for real-time sync)
* **Styling:** Tailwind CSS + Lucide React
* **Deployment:** Vercel

## ✨ Key Features
* **Dual-Persona Interface:** Split screen for Doctor (English) and Patient (Spanish).
* **Latency-Optimized Translation:** Uses Gemini 2.5 Flash for near-instant text translation.
* **Medical Scribe Agent:** One-click generation of clinical summaries (Chief Complaint, Symptoms, Action Plan).
* **Voice-to-Text:** Integrated Web Speech API for hands-free input.
* **Local Persistence:** Session history is saved locally to prevent data loss on refresh.

## 🧠 AI Strategy
I chose **Gemini 2.5 Flash** over GPT-4 for two reasons:
1.  **Speed:** Real-time medical conversation requires sub-200ms latency.
2.  **Context Window:** The model is optimized for processing long conversation logs into concise summaries.

## ⚠️ Limitations & Future Roadmap
* **Search:** Keyword search was deprioritized in favor of the **AI Summary** feature, which provides better context than simple string matching.
* **Audio Storage:** Currently uses browser-native Speech API; a production version would upload distinct `.wav` blobs to AWS S3.
* **Auth:** Currently an open public demo.

## 🏃‍♂️ How to Run Locally
1.  Clone the repo
2.  `npm install`
3.  Create `.env.local` with `GOOGLE_API_KEY=your_key`
4.  `npm run dev`