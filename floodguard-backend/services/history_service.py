"""
30-Day Historical Risk Analytics & Neighborhood Flood Log Heatmap Service
Generates daily hydro-meteorological time-series data and inundation frequency analytics.
"""

import random
from datetime import datetime, timedelta
from typing import List, Dict

# Pre-seeded neighborhood baseline profile characteristics
NEIGHBORHOOD_PROFILES = {
    "Koramangala 4th Block": {"rain_multiplier": 1.15, "drain_risk_base": 78, "base_water_m": 1.25},
    "Silk Board Junction": {"rain_multiplier": 1.20, "drain_risk_base": 85, "base_water_m": 1.45},
    "Bellandur ORR Tech Corridor": {"rain_multiplier": 1.30, "drain_risk_base": 88, "base_water_m": 1.60},
    "HSR Layout 6th Sector": {"rain_multiplier": 1.05, "drain_risk_base": 65, "base_water_m": 0.95},
    "Indiranagar 100ft Road": {"rain_multiplier": 0.95, "drain_risk_base": 55, "base_water_m": 0.70},
    "City-Wide All Zones": {"rain_multiplier": 1.10, "drain_risk_base": 72, "base_water_m": 1.10}
}

def generate_daily_history(zone_name: str = "Koramangala 4th Block", days: int = 30) -> List[Dict]:
    """
    Generates time-series daily hydro-meteorological data for the past N days.
    """
    profile = NEIGHBORHOOD_PROFILES.get(zone_name, NEIGHBORHOOD_PROFILES["Koramangala 4th Block"])
    today = datetime.now()
    history_records = []

    # Deterministic seed algorithm based on day offset so values remain consistent
    for i in range(days - 1, -1, -1):
        date_dt = today - timedelta(days=i)
        date_str = date_dt.strftime("%b %d")
        
        # Heavy rain storm spikes around day 3, day 12, day 22
        day_offset = i
        if day_offset in [3, 4, 12, 13, 22, 23]:
            # Cloudburst / Monsoonal storm day
            daily_rain_mm = round((48.0 + (day_offset * 3.5) % 35) * profile["rain_multiplier"], 1)
            water_level_m = round((1.8 + (day_offset * 0.15) % 0.8) * (profile["base_water_m"] / 1.10), 2)
            risk_score = round(min(98.5, 65.0 + daily_rain_mm * 0.55), 1)
            is_flooded = True
        elif day_offset in [5, 14, 24]:
            # Moderate rain day
            daily_rain_mm = round((22.0 + (day_offset * 2.1) % 18) * profile["rain_multiplier"], 1)
            water_level_m = round((1.1 + (day_offset * 0.08) % 0.4) * (profile["base_water_m"] / 1.10), 2)
            risk_score = round(min(78.0, 42.0 + daily_rain_mm * 0.8), 1)
            is_flooded = risk_score >= 60.0
        else:
            # Clear / Light shower day
            daily_rain_mm = round(max(0.0, (12.0 - (day_offset * 1.7) % 15)) * profile["rain_multiplier"], 1)
            water_level_m = round(max(0.3, 0.45 + (daily_rain_mm * 0.02)), 2)
            risk_score = round(max(12.0, 18.0 + daily_rain_mm * 1.1), 1)
            is_flooded = False

        history_records.append({
            "date": date_str,
            "days_ago": i,
            "rainfall_mm": daily_rain_mm,
            "water_level_m": water_level_m,
            "risk_score": risk_score,
            "is_flooded": is_flooded,
            "status": "CRITICAL FLOOD" if risk_score > 75 else ("HIGH RISK" if risk_score > 60 else ("MODERATE" if risk_score > 40 else "SAFE"))
        })

    return history_records

def calculate_neighborhood_flood_frequency() -> List[Dict]:
    """
    Computes 30-day flood occurrence frequency ranking across Bengaluru neighborhoods.
    """
    rankings = []
    for zone in ["Bellandur ORR Tech Corridor", "Silk Board Junction", "Koramangala 4th Block", "HSR Layout 6th Sector", "Indiranagar 100ft Road"]:
        records = generate_daily_history(zone, 30)
        flood_days = sum(1 for r in records if r["is_flooded"])
        peak_rain = max(r["rainfall_mm"] for r in records)
        peak_water = max(r["water_level_m"] for r in records)
        pct = round((flood_days / 30.0) * 100, 1)

        rankings.append({
            "neighborhood": zone,
            "flood_days_count": flood_days,
            "total_days": 30,
            "frequency_percentage": pct,
            "peak_rainfall_mm": peak_rain,
            "peak_water_level_m": peak_water,
            "vulnerability_tier": "EXTREME" if pct > 25 else ("HIGH" if pct > 18 else "MODERATE")
        })

    # Sort by frequency descending
    rankings.sort(key=lambda x: x["frequency_percentage"], reverse=True)
    return rankings

def get_historical_analytics_summary(zone_name: str = "Koramangala 4th Block", timeframe_days: int = 30) -> Dict:
    """
    Returns aggregated historical metrics and time-series for frontend widgets.
    """
    daily_records = generate_daily_history(zone_name, timeframe_days)
    flood_days = [r for r in daily_records if r["is_flooded"]]
    max_rain = max(r["rainfall_mm"] for r in daily_records)
    max_water = max(r["water_level_m"] for r in daily_records)
    max_risk = max(r["risk_score"] for r in daily_records)

    # Major historical flood events log
    notable_events = [
        {
            "event_name": "Monsoon Cloudburst Spike",
            "date": daily_records[min(3, len(daily_records)-1)]["date"],
            "rainfall_mm": max_rain,
            "water_level_m": max_water,
            "summary": "Submerged ground levels in low-lying residential sectors; 4 shelter camps activated."
        },
        {
            "event_name": "Secondary Storm Drainage Overflow",
            "date": daily_records[min(12, len(daily_records)-1)]["date"],
            "rainfall_mm": round(max_rain * 0.82, 1),
            "water_level_m": round(max_water * 0.88, 2),
            "summary": "Underpass waterlogging causing 40-min traffic delays; dewatering pumps deployed."
        }
    ]

    return {
        "zone_evaluated": zone_name,
        "timeframe_days": timeframe_days,
        "total_records": len(daily_records),
        "total_flood_days": len(flood_days),
        "peak_rainfall_mm": max_rain,
        "peak_water_level_m": max_water,
        "peak_risk_score": max_risk,
        "daily_records": daily_records,
        "notable_events": notable_events
    }
