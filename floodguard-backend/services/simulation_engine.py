"""
Disaster Scenario Time-Lapse Simulation Engine for FloodGuard AI
Simulates a live monsoonal cloudburst disaster unfolding step-by-step (00m -> 15m -> 30m -> 45m -> 60m).
"""

import time
from typing import Dict, List
from services.risk_engine import calculate_flood_risk

SCENARIOS = {
    "MONSOON_CLOUDBURST": [
        {
            "minute": 0,
            "label": "00 Min — Initial Rainfall Onset",
            "rainfall_mm_hr": 24.0,
            "water_level_m": 0.65,
            "rise_rate_m_hr": 0.10,
            "historical_floods": 2,
            "drainage_risk": 55,
            "pop_density": 60,
            "active_alerts": ["ADVISORY: Rain started in Koramangala"],
            "simulated_incidents": 0,
            "status_badge": "ADVISORY 🔵"
        },
        {
            "minute": 15,
            "label": "15 Min — Heavy Downpour & Water Accumulation",
            "rainfall_mm_hr": 48.5,
            "water_level_m": 1.15,
            "rise_rate_m_hr": 0.45,
            "historical_floods": 4,
            "drainage_risk": 72,
            "pop_density": 60,
            "active_alerts": ["HIGH WARNING: Water rise detected at Agara Underpass"],
            "simulated_incidents": 2,
            "status_badge": "HIGH WARNING 🟠"
        },
        {
            "minute": 30,
            "label": "30 Min — Severe Cloudburst & Rajakaluve Overflow",
            "rainfall_mm_hr": 76.0,
            "water_level_m": 1.75,
            "rise_rate_m_hr": 0.85,
            "historical_floods": 5,
            "drainage_risk": 88,
            "pop_density": 60,
            "active_alerts": ["CRITICAL ALERT: Rajakaluve trunk drain overflowing"],
            "simulated_incidents": 5,
            "status_badge": "CRITICAL RED 🔴"
        },
        {
            "minute": 45,
            "label": "45 Min — Peak Inundation & Rescue Escalation",
            "rainfall_mm_hr": 94.2,
            "water_level_m": 2.35,
            "rise_rate_m_hr": 1.20,
            "historical_floods": 5,
            "drainage_risk": 95,
            "pop_density": 60,
            "active_alerts": ["EMERGENCY SOS: Ground floors submerged in Koramangala 4th Block"],
            "simulated_incidents": 9,
            "status_badge": "EXTREME DISASTER 🔴"
        },
        {
            "minute": 60,
            "label": "60 Min — Receding Rain & Active Rescue Operations",
            "rainfall_mm_hr": 35.0,
            "water_level_m": 2.10,
            "rise_rate_m_hr": -0.15,
            "historical_floods": 5,
            "drainage_risk": 85,
            "pop_density": 60,
            "active_alerts": ["RESCUE DISPATCH: 12 NDRF boats & 2 choppers active"],
            "simulated_incidents": 11,
            "status_badge": "STABILIZING 🟡"
        }
    ]
}

# Current active simulation state
current_sim_state = {
    "active_scenario": "MONSOON_CLOUDBURST",
    "step_index": 0,
    "is_running": False
}

def start_simulation_scenario(scenario_name: str = "MONSOON_CLOUDBURST"):
    """Resets and starts a disaster scenario simulation."""
    global current_sim_state
    current_sim_state = {
        "active_scenario": scenario_name if scenario_name in SCENARIOS else "MONSOON_CLOUDBURST",
        "step_index": 0,
        "is_running": True
    }
    return get_current_simulation_step()

def advance_simulation_step():
    """Advances the disaster scenario by 15 minutes."""
    global current_sim_state
    steps = SCENARIOS.get(current_sim_state["active_scenario"], SCENARIOS["MONSOON_CLOUDBURST"])
    if current_sim_state["step_index"] < len(steps) - 1:
        current_sim_state["step_index"] += 1
    return get_current_simulation_step()

def get_current_simulation_step():
    """Calculates risk score and returns telemetry for the active simulation step."""
    global current_sim_state
    scenario = SCENARIOS.get(current_sim_state["active_scenario"], SCENARIOS["MONSOON_CLOUDBURST"])
    step_data = scenario[current_sim_state["step_index"]]

    risk_result = calculate_flood_risk(
        rainfall_mm=step_data["rainfall_mm_hr"],
        water_level_m=step_data["water_level_m"],
        water_rise_rate=step_data["rise_rate_m_hr"],
        historical_floods=step_data["historical_floods"],
        drainage_risk=step_data["drainage_risk"],
        population=step_data["pop_density"] * 500  # Convert density to population estimate
    )

    return {
        "scenario": current_sim_state["active_scenario"],
        "step_index": current_sim_state["step_index"],
        "total_steps": len(scenario),
        "is_running": current_sim_state["is_running"],
        "step_info": step_data,
        "calculated_risk": risk_result
    }
