"""
API Endpoints for Disaster Scenario Time-Lapse Simulation
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from services.simulation_engine import start_simulation_scenario, advance_simulation_step, get_current_simulation_step

router = APIRouter()

class StartSimulationRequest(BaseModel):
    scenario: str = "MONSOON_CLOUDBURST"

@router.post("/start")
def start_scenario(payload: StartSimulationRequest):
    """
    Start a live disaster scenario simulation.
    """
    try:
        step = start_simulation_scenario(payload.scenario)
        return {"status": "success", "message": "Disaster simulation started", "data": step}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/next")
def next_step():
    """
    Advance the active disaster scenario simulation by 15 minutes.
    """
    try:
        step = advance_simulation_step()
        return {"status": "success", "data": step}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/current")
def get_current_step():
    """
    Fetch the current active simulation step state.
    """
    try:
        step = get_current_simulation_step()
        return {"status": "success", "data": step}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
