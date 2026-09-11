# 🎬 FloodGuard AI — 2-Minute Demo Video Script

---

## ⚙️ SETUP (Before recording starts)

- Open **https://floodguard-ai-seven.vercel.app** in Chrome/Firefox
- F12 → Console (make it small, don't show in video)
- Mute system notifications
- Have these URLs ready in tabs:
  - GitHub: `github.com/vishal-s-sollapure/floodguard-ai`
  - Live API: `https://floodguard-ai-23yq.onrender.com/docs`
- Start recording with **OBS Studio** or **Windows Game Bar** (Win + G)

---

## 🎙️ SCRIPT

### [0:00–0:15] HOOK — THE PROBLEM

> "Every year, urban flooding in Bengaluru disrupts over 3 million residents.
> But here's the gap: cities have sensors for rainfall, water levels, drainage.
> What they don't have is a system that connects that data, predicts risk in
> real time, and mobilizes communities *before* it becomes a disaster."

**Show text:** `"Problem: No unified flood early warning for urban communities"`

---

### [0:15–0:35] LANDING PAGE → DASHBOARD LIVE DATA

> "This is FloodGuard AI."

Click: **Home → Live Dashboard**

> "In one view, emergency teams see:
> - Real-time rainfall from OpenWeatherMap (currently 18.5 mm/hr)
> - Water sensor levels in critical zones
> - Risk gauge showing MODERATE 45%
> - Color-coded neighborhood zones on a live Leaflet map"

Hover over map zones — show orange (High Risk) and red (Critical) markers.

Show: `"Current ETA to critical: 240 minutes"`

**Show text:** `"Real-time dashboard. Live APIs. One command center."`

---

### [0:35–1:00] AI RISK PREDICTOR — THE ENGINE

Click: **Risk Predictor**

> "Now here's where the AI happens. Instead of guessing, FloodGuard uses
> six weighted variables:"

Read the form fields aloud slowly:
- "Rainfall: **95 mm/hr**"
- "Water level: **2.8 meters**"
- "Rise rate: **0.45 meters per 15 minutes**"
- "Historical floods: **8 events in this zone**"
- "Drainage risk: **HIGH**"
- "Population at risk: **22,500 people**"

Click: **Analyze Flood Risk**

> "The AI engine calculates... and returns: **87% CRITICAL RISK.**"

*(Wait for gauge to animate)*

> "ETA to dangerous flooding: 45 minutes. Recommended action: Evacuate immediately."

**Show text:** `"87% CRITICAL — Multi-variable weighted scoring"`

---

### [1:00–1:20] COMMUNITY INCIDENT REPORTING

Click: **Report Incident**

> "But FloodGuard isn't just top-down. Citizens crowdsource real-time hazards."

Show the six incident categories:
- "Flooded Road, Blocked Drain, Fallen Tree, Electrical Danger..."

> "Select HIGH severity, auto-detect GPS (shows: 12.9352°N, 77.6245°E),
> describe the incident: 'Water entering ground floor homes at Koramangala 4th Block.'"

Click: **Dispatch Community Report**

*(Show confirmation: "Report submitted to MongoDB. Map updates live.")*

Go back to Dashboard. Show the alert ticker:

> "HIGH RISK WARNING: Koramangala & Bellandur areas experiencing rapid water
> level rise. Avoid low-lying underpasses."

**Show text:** `"Community crowdsourcing + Automated alerts"`

---

### [1:20–1:45] GEMINI AI ASSISTANT

Scroll down to: **"Gemini Emergency AI Assistant"**

> "When citizens are in panic, they need guidance. FloodGuard has an AI assistant
> powered by Gemini."

Click in chat box. Type: **"What emergency steps should I take right now?"**

*(Wait for Gemini to respond)*

> "The AI responds with: 'Prepare emergency kit, move valuables to higher floors,
> identify nearest evacuation route, monitor alert ticker.'"

> "This is where human-in-the-loop matters: our team verified Gemini's responses
> against official government safety guidelines."

**Show text:** `"Gemini-powered emergency guidance + AI verification"`

---

### [1:45–2:00] SCALE & IMPACT

Back to Dashboard. Zoom out to show full neighborhood map.

> "FloodGuard monitors 150+ neighborhoods across Bengaluru. In a real flood event:
> - Citizens evacuate 35 minutes faster (via live alerts)
> - Officer dispatch teams see all incidents in one queue
> - Resource optimization AI suggests which rescue units to send where
> - Economic loss prediction helps government plan relief"

Click: **Officer Portal** (show the SOS Rescue panel briefly)

> "Behind the scenes: FastAPI backend, MongoDB data store, Render deployment,
> Google Gemini API, OpenWeatherMap real-time weather."

**Show text:** `"Production-grade. Real-time. Scalable. Open source."`

---

### [2:00–2:15] CALL TO ACTION & LINKS

> "This was built in 48 hours for the CodeMyFYP Climate & Communities hackathon."

Show on screen:
| | |
|---|---|
| 📁 GitHub | `github.com/vishal-s-sollapure/floodguard-ai` |
| 🌐 Live Demo | `floodguard-ai-seven.vercel.app` |
| 📖 API Docs | `floodguard-ai-23yq.onrender.com/docs` |

> **"Predict. Prepare. Protect. FloodGuard AI."**

**[END]**

---

## 🎥 RECORDING TIPS

1. Speak clearly at ~130 words/min (not fast, not slow)
2. Pause **1–2 seconds** between scenes (let viewer's eye follow)
3. Click **slowly** so transitions are visible
4. If a page takes >5 sec to load, skip ahead (pre-load in another tab)
5. If you mess up a line, **pause 3 seconds**, re-read it — edit in post
6. Total video target: **2:00–2:15** (aim for exactly 2:05)
7. Export as **MP4, 1080p, 30fps**

---

## 📤 POST-RECORDING

1. Open video in **Windows Photos** or **iMovie**
2. Trim dead time at start/end
3. Export to **MP4**
4. Upload to **YouTube (unlisted)** or **Google Drive**
5. Get shareable link
6. Paste link into **CodeMyFYP submission form**

---

*You're done! 🎉 Predict. Prepare. Protect.*
