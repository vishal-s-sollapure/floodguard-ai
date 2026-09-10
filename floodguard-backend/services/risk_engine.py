def calculate_flood_risk(rainfall_mm, water_level_m, water_rise_rate, 
                          historical_floods, drainage_risk, population):

    # Normalize each input to 0-100 scale
    
    # Rainfall: 0 mm/hr = 0, 100+ mm/hr = 100
    rainfall_score = min(rainfall_mm / 100 * 100, 100)
    
    # Water level: 0m = 0, 3m+ = 100
    water_level_score = min(water_level_m / 3 * 100, 100)
    
    # Rise rate: 0 = 0, 0.5 m/15min+ = 100
    rise_rate_score = min(water_rise_rate / 0.5 * 100, 100)
    
    # Historical floods: 0 = 0, 10+ = 100
    historical_score = min(historical_floods / 10 * 100, 100)
    
    # Drainage risk: low=20, medium=60, high=100
    drainage_map = {"low": 20, "medium": 60, "high": 100}
    drainage_clean = str(drainage_risk).lower().strip().replace(" risk", "").replace(" ", "")
    drainage_score = drainage_map.get(drainage_clean, 60)
    
    # Population: 0 = 0, 50000+ = 100
    population_score = min(population / 50000 * 100, 100)
    
    # Weighted final score
    risk_score = (
        rainfall_score * 0.30 +
        water_level_score * 0.25 +
        rise_rate_score * 0.20 +
        historical_score * 0.10 +
        drainage_score * 0.10 +
        population_score * 0.05
    )
    
    risk_score = round(min(risk_score, 100), 1)
    
    # Risk level thresholds
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
    
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "eta_minutes": eta_minutes,
        "recommended_action": action
    }

