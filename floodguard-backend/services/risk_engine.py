def calculate_flood_risk(rainfall_mm, water_level_m, water_rise_rate,
                          historical_floods, drainage_risk, population):
    
    # Normalize inputs to 0-100
    rainfall_score = min(float(rainfall_mm) / 100 * 100, 100)
    water_level_score = min(float(water_level_m) / 3 * 100, 100)
    rise_rate_score = min(float(water_rise_rate) / 0.5 * 100, 100)
    historical_score = min(float(historical_floods) / 10 * 100, 100)
    population_score = min(float(population) / 50000 * 100, 100)
    
    # Drainage - handle ALL possible input formats
    drainage_str = str(drainage_risk).lower().strip()
    if "high" in drainage_str:
        drainage_score = 100
    elif "medium" in drainage_str or "moderate" in drainage_str:
        drainage_score = 60
    elif "low" in drainage_str:
        drainage_score = 20
    else:
        drainage_score = 60
    
    # Weighted score
    risk_score = (
        rainfall_score * 0.30 +
        water_level_score * 0.25 +
        rise_rate_score * 0.20 +
        historical_score * 0.10 +
        drainage_score * 0.10 +
        population_score * 0.05
    )
    
    risk_score = round(min(float(risk_score), 100), 1)
    
    # Thresholds
    if risk_score <= 30:
        risk_level = "LOW"
        eta_minutes = 999
        action = "No immediate action required. Continue monitoring water levels."
    elif risk_score <= 60:
        risk_level = "MODERATE"
        eta_minutes = 240
        action = "ADVISORY: Monitor water levels closely, clear storm drains near property, and limit non-essential travel."
    elif risk_score <= 80:
        risk_level = "HIGH"
        eta_minutes = 90
        action = "WARNING: Prepare emergency kit, move valuables to higher floors, identify nearest evacuation route."
    else:
        risk_level = "CRITICAL"
        eta_minutes = 45
        action = "EVACUATE: Move immediately to higher ground. Avoid all flooded roads. Call emergency services if trapped."
    
    # Debug print to confirm values
    print(f"RISK ENGINE: rainfall={rainfall_score}, water={water_level_score}, "
          f"rise={rise_rate_score}, hist={historical_score}, "
          f"drainage='{drainage_str}'→{drainage_score}, pop={population_score}")
    print(f"RISK ENGINE: FINAL SCORE={risk_score}, LEVEL={risk_level}")
    
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "eta_minutes": eta_minutes,
        "recommended_action": action
    }

