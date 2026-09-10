def calculate_flood_risk(rainfall_mm, water_level_m, water_rise_rate,
                          historical_floods, drainage_risk, population):
    
    # 1. Normalize inputs & calculate exact weighted contributions (XAI)
    rainfall_norm = min(float(rainfall_mm) / 100 * 100, 100)
    water_level_norm = min(float(water_level_m) / 3 * 100, 100)
    rise_rate_norm = min(float(water_rise_rate) / 0.5 * 100, 100)
    historical_norm = min(float(historical_floods) / 10 * 100, 100)
    population_norm = min(float(population) / 50000 * 100, 100)
    
    drainage_str = str(drainage_risk).lower().strip()
    if "high" in drainage_str:
        drainage_norm = 100
    elif "medium" in drainage_str or "moderate" in drainage_str:
        drainage_norm = 60
    elif "low" in drainage_str:
        drainage_norm = 20
    else:
        drainage_norm = 60
    
    # Exact points out of maximum weight
    pts_rainfall = round(rainfall_norm * 0.30, 1)        # max 30 pts
    pts_water_level = round(water_level_norm * 0.25, 1)    # max 25 pts
    pts_rise_rate = round(rise_rate_norm * 0.20, 1)        # max 20 pts
    pts_historical = round(historical_norm * 0.10, 1)      # max 10 pts
    pts_drainage = round(drainage_norm * 0.10, 1)          # max 10 pts
    pts_population = round(population_norm * 0.05, 1)      # max 5 pts
    
    risk_score = round(min(pts_rainfall + pts_water_level + pts_rise_rate + pts_historical + pts_drainage + pts_population, 100.0), 1)
    
    # 2. Risk Level & Actions
    if risk_score <= 30:
        risk_level = "LOW"
        eta_minutes = 999
        action = "No immediate threat. Standard automated weather monitoring active."
    elif risk_score <= 60:
        risk_level = "MODERATE"
        eta_minutes = 240
        action = "ADVISORY: Localized waterlogging possible. Monitor drains and clear debris."
    elif risk_score <= 80:
        risk_level = "HIGH"
        eta_minutes = 90
        action = "WARNING: Water rising rapidly. Prepare emergency kits & identify shelter routes."
    else:
        risk_level = "CRITICAL"
        eta_minutes = 45
        action = "EVACUATE: Move to higher ground immediately. Avoid flooded underpasses."

    # 3. 30-Minute Projected Risk Calculation
    projected_rise = float(water_rise_rate) * 0.5 # rise in 30 mins
    projected_water_level = min(float(water_level_m) + projected_rise, 4.0)
    projected_score = round(min(risk_score + (rise_rate_norm * 0.15), 100.0), 1)
    trend_direction = "RISING_RAPIDLY" if projected_score > risk_score + 5 else ("RISING" if projected_score > risk_score else "STABLE")

    # 4. Explainable AI Breakdown Object (XAI)
    xai_breakdown = {
        "rainfall": {"points": pts_rainfall, "max": 30, "percentage": round((pts_rainfall / 30) * 100, 1), "label": f"Rainfall ({rainfall_mm} mm/hr)"},
        "water_level": {"points": pts_water_level, "max": 25, "percentage": round((pts_water_level / 25) * 100, 1), "label": f"Water Level ({water_level_m} m)"},
        "water_rise_rate": {"points": pts_rise_rate, "max": 20, "percentage": round((pts_rise_rate / 20) * 100, 1), "label": f"Rise Rate (+{water_rise_rate} m/hr)"},
        "historical_floods": {"points": pts_historical, "max": 10, "percentage": round((pts_historical / 10) * 100, 1), "label": f"Historical Events ({historical_floods} count)"},
        "drainage_risk": {"points": pts_drainage, "max": 10, "percentage": round((pts_drainage / 10) * 100, 1), "label": f"Drainage Risk ({drainage_risk.capitalize()})"},
        "population": {"points": pts_population, "max": 5, "percentage": round((pts_population / 5) * 100, 1), "label": f"Population ({population:,})"}
    }

    # 5. XAI Natural Language Explanation
    explanation = (
        f"Flood risk is classified as {risk_level} ({risk_score}%). "
        f"Rainfall contributes {pts_rainfall}/30 pts and water level contributes {pts_water_level}/25 pts. "
        f"Water is rising at {water_rise_rate} m/hr with a 30-minute projected risk of {projected_score}%."
    )

    # 6. Trend Timeline Series (-60m, -45m, -30m, -15m, NOW, +30m Projection)
    trend_series = [
        {"time": "-60m", "score": max(round(risk_score - 18, 1), 10.0)},
        {"time": "-45m", "score": max(round(risk_score - 12, 1), 15.0)},
        {"time": "-30m", "score": max(round(risk_score - 7, 1), 20.0)},
        {"time": "-15m", "score": max(round(risk_score - 3, 1), 25.0)},
        {"time": "NOW", "score": risk_score},
        {"time": "+30m (proj)", "score": projected_score}
    ]

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "eta_minutes": eta_minutes,
        "recommended_action": action,
        "projected_score_30m": projected_score,
        "trend_direction": trend_direction,
        "xai_breakdown": xai_breakdown,
        "explanation": explanation,
        "trend_series": trend_series
    }
