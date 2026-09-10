# 💧 FloodGuard AI — Early Flood Warning & Risk Assessment System

> **Predict. Prepare. Protect.**  
> A full-stack AI-driven early flood warning system featuring real-time risk simulation, OpenWeatherMap telemetry, Leaflet interactive spatial mapping, and Google Gemini emergency safety guidance.

---

## 🌟 Key Features

- 🧠 **Weighted Risk Engine**: Normalizes precipitation intensity, water level, rise rate, historical flood events, drainage capacity, and population density into a 0–100 risk score (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
- 🤖 **Google Gemini AI Assistant**: Generates real-time, location-specific emergency evacuation and safety instructions.
- 🗺️ **Interactive Leaflet Map**: Displays neighborhood-level telemetry and color-coded danger zones across Bengaluru.
- 🌧️ **OpenWeather Telemetry**: Live precipitation feed with smart monsoon fallback data.
- 📢 **Community Incident Reporting**: Citizens can log flooded roads, blocked drains, and structural hazards with browser GPS auto-detection.

---

## 🏗️ System Architecture

```text
FloodRescue/
├── floodguard-backend/          # FastAPI + Motor MongoDB + Risk Engine + Gemini
│   ├── main.py
│   ├── database.py
│   ├── models/schemas.py
│   ├── services/
│   │   ├── risk_engine.py
│   │   ├── weather_service.py
│   │   └── gemini_service.py
│   └── routes/
│       ├── flood.py
│       ├── reports.py
│       ├── alerts.py
│       └── weather.py
└── floodguard-frontend/         # React + Vite + Tailwind CSS + Leaflet
    ├── index.html
    └── src/
        ├── App.jsx
        ├── api/floodApi.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── RiskGauge.jsx
        │   ├── RiskBadge.jsx
        │   ├── MapView.jsx
        │   └── AlertTicker.jsx
        └── pages/
            ├── Landing.jsx
            ├── Dashboard.jsx
            ├── RiskPredictor.jsx
            └── ReportIncident.jsx
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup (`floodguard-backend`)

```powershell
cd floodguard-backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000`.

### 2. Frontend Setup (`floodguard-frontend`)

```powershell
cd floodguard-frontend
npm install
npm run dev
```
Frontend UI will be running at `http://localhost:5173`.

---

## 📄 License

MIT License © 2026 FloodGuard AI Team
