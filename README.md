# 🌊 FloodGuard AI
### AI-Powered Urban Flood Monitoring & Emergency Response Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-floodguard--ai--seven.vercel.app-blue?style=for-the-badge)](https://floodguard-ai-seven.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-green?style=for-the-badge)](https://floodguard-ai-23yq.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-vishal--s--sollapure-black?style=for-the-badge&logo=github)](https://github.com/vishal-s-sollapure/floodguard-ai)

> **CodeMyFYP National Virtual Hackathon 2026 — Climate & Communities Track**

---

## 🎯 Problem Statement

Urban flooding creates three critical failures:
- Citizens don't know which areas are becoming dangerous in real time
- Authorities lack a unified view combining water levels, rainfall, and community reports
- Emergency response is **reactive** rather than **predictive**

Every year, urban flooding disrupts communities, damages infrastructure, and puts lives at risk — not because we lack data, but because we lack a system that connects it.

---

## 💡 Solution

**FloodGuard AI** combines weather data, AI-based risk analysis, interactive maps, and community crowdsourcing into one unified platform — helping communities **predict, prepare, and respond** to urban flooding before it becomes a disaster.

---

## 🚀 Live Demo

🌐 **Frontend:** https://floodguard-ai-seven.vercel.app  
⚙️ **Backend API:** https://floodguard-ai-23yq.onrender.com  
📖 **API Docs:** https://floodguard-ai-23yq.onrender.com/docs  

> ⚠️ Note: Backend is on Render free tier — first request may take 30-50 seconds to wake up.

---

## ✨ Features

### 1. 🗺️ Live Flood Command Dashboard
- Real-time flood risk score with animated gauge
- Live weather data from OpenWeatherMap API
- Bengaluru neighborhood risk map with color-coded zones
- Auto-refreshing alert ticker

### 2. 🤖 AI Flood Risk Engine
- Multi-variable weighted scoring model
- Inputs: Rainfall intensity, water level, rise rate, historical floods, drainage risk, population
- Outputs: Risk score (0-100%), risk level, ETA, recommended action
- Thresholds: LOW (0-30) → MODERATE (31-60) → HIGH (61-80) → CRITICAL (81-100)

### 3. 🚨 Smart Emergency Alerts
- Location-specific auto-generated warnings
- Severity-based action recommendations
- AI assistant powered by Google Gemini API

### 4. 📍 Community Incident Reporting & Gemini Vision AI
- Citizens report: Flooded Road, Blocked Drain, Fallen Tree, Electrical Danger, Infrastructure Damage, Person Needs Help
- Flood photo upload with **Google Gemini Vision AI** hazard depth analysis
- GPS auto-detection & severity classification
- Reports saved to MongoDB Atlas

### 5. 🛡️ Disaster Officer Command Portal (`/admin`)
- Role-based Access Control (Citizen vs. Response Officer)
- Live queue verification (`Pending` → `Verified` → `Resolved`)
- Rescue team dispatch trigger & status moderation
- 1-click Executive PDF Disaster Report generator

### 6. 🗺️ Emergency Resource Map & Safe Shelter Navigation
- Active shelter markers with live bed capacity and status
- Safe evacuation pathway overlays
- Hospital markers & risk zone radius indicators

---

## 🏗️ Architecture

```text
                               ┌───────────────────────────────────┐
                               │     Vercel Frontend (React)       │
                               │   https://floodguard-ai-seven...  │
                               └─────────────────┬─────────────────┘
                                                 │
                                                 │ REST API (Axios)
                                                 ▼
                               ┌───────────────────────────────────┐
                               │     Render Backend (FastAPI)      │
                               │   https://floodguard-ai-23yq...   │
                               └────┬────────────┬────────────┬────┘
                                    │            │            │
             ┌──────────────────────┘            │            └──────────────────────┐
             ▼                                   ▼                                   ▼
┌─────────────────────────┐         ┌─────────────────────────┐         ┌─────────────────────────┐
│     OpenWeatherMap      │         │      MongoDB Atlas      │         │     Google Gemini AI    │
│  Live Rain & Temp Feed  │         │  Incident Reports Store │         │  Emergency AI Assistant │
└─────────────────────────┘         └─────────────────────────┘         └─────────────────────────┘
```

### Directory Structure

```text
FloodRescue/
├── floodguard-backend/          # FastAPI + Motor MongoDB + Risk Engine + Gemini
│   ├── main.py                  # FastAPI Application & CORS configuration
│   ├── database.py              # MongoDB Atlas connection handler
│   ├── models/schemas.py        # Pydantic data schemas
│   ├── services/
│   │   ├── risk_engine.py       # Weighted mathematical risk algorithm
│   │   ├── weather_service.py   # OpenWeatherMap API integration with fallback
│   │   └── gemini_service.py    # Google Gemini AI assistant integration
│   └── routes/
│       ├── flood.py             # Risk prediction & history routes
│       ├── reports.py           # Community incident reporting routes
│       ├── alerts.py            # Emergency alerts & AI assistant routes
│       └── weather.py           # Real-time weather data endpoint
└── floodguard-frontend/         # React + Vite + Tailwind CSS + Leaflet
    ├── index.html
    └── src/
        ├── App.jsx              # Main React Application Router
        ├── api/floodApi.js      # Centralized Axios API client
        ├── components/
        │   ├── Navbar.jsx       # Global navigation bar
        │   ├── RiskGauge.jsx    # SVG animated risk score meter
        │   ├── RiskBadge.jsx    # Severity status indicator
        │   ├── MapView.jsx      # Leaflet interactive spatial map
        │   └── AlertTicker.jsx  # Real-time emergency ticker
        └── pages/
            ├── Landing.jsx      # Animated landing hero page
            ├── Dashboard.jsx    # Main flood command dashboard
            ├── RiskPredictor.jsx# AI risk predictor simulator
            └── ReportIncident.jsx# Crowd-sourced incident logger with GPS
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account
- Google Gemini API key
- OpenWeatherMap API key

### Frontend
```bash
cd floodguard-frontend
npm install
cp .env.example .env
# Add VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

### Backend
```bash
cd floodguard-backend
pip install -r requirements.txt
cp .env.example .env
# Add MONGODB_URI, GEMINI_API_KEY, OPENWEATHER_API_KEY
uvicorn main:app --reload --port 8000
```

---

## 🧠 AI Risk Engine

The flood risk score is calculated using a weighted multi-variable model:

| Variable | Weight | Normalization |
|----------|--------|---------------|
| Rainfall intensity | 30% | 0-100 mm/hr |
| Water level | 25% | 0-3 meters |
| Water rise rate | 20% | 0-0.5 m/15min |
| Historical floods | 10% | 0-10 events |
| Drainage risk | 10% | Low/Medium/High |
| Population exposure | 5% | 0-50,000 |

Risk levels:
- 🟢 **LOW** (0-30): No immediate action
- 🟡 **MODERATE** (31-60): Monitor and prepare  
- 🟠 **HIGH** (61-80): Prepare evacuation
- 🔴 **CRITICAL** (81-100): Evacuate immediately

---

## 🤖 AI Declaration

This project uses AI in the following ways:
- **Google Gemini API** — Emergency assistant chatbot providing situation-specific safety guidance
- **Scikit-learn** — Weighted ML scoring model for flood risk prediction
- **OpenWeatherMap API** — Real-time weather data ingestion

AI tools used during development:
- Claude (Anthropic) — Architecture planning, code scaffolding, debugging

---

## 👤 Team

**Vishal S. Sollapure**  
Frontend Development Intern @ Saiket Systems  
Student @ Aditya College of Engineering and Technology, Bengaluru  
GitHub: [@vishal-s-sollapure](https://github.com/vishal-s-sollapure)

---

## 📄 License

MIT License — feel free to use and build on this project.

---

*Built for CodeMyFYP National Virtual Hackathon 2026 — Climate & Communities Track*  
*Predict. Prepare. Protect. 🌊*
