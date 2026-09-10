"""
Dispatch, Resource Optimizer, Anomaly Detection & Performance KPI Routes
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from services.resource_optimizer import get_all_rescue_teams, recommend_resource_assignments, assign_rescue_team
from services.anomaly_detector import detect_telemetry_anomalies
from services.performance_analytics import get_performance_kpis
from services.event_orchestrator import execute_orchestrated_pipeline

router = APIRouter(prefix="/api/dispatch", tags=["Dispatch & Resource Optimization"])

@router.get("/rescue-teams")
def list_rescue_teams():
    """Returns status and coordinates of all emergency rescue teams."""
    return get_all_rescue_teams()

@router.get("/recommendations")
def get_dispatch_recommendations():
    """Generates automated team recommendations for active SOS incidents."""
    sample_incidents = [
        {
            "id": "SOS-8042",
            "vulnerability_type": "Senior Citizen Rooftop Stranded",
            "priority_score": 96.0,
            "lat": 12.9340,
            "lng": 77.6100,
            "location_name": "Koramangala 4th Block"
        },
        {
            "id": "SOS-8043",
            "vulnerability_type": "Hospital ICU Patient Evacuation",
            "priority_score": 92.0,
            "lat": 12.9280,
            "lng": 77.6250,
            "location_name": "St. John's Hospital Area"
        },
        {
            "id": "SOS-8044",
            "vulnerability_type": "Basement Waterlogging & Short Circuit Risk",
            "priority_score": 78.0,
            "lat": 12.9180,
            "lng": 77.6190,
            "location_name": "Silk Board Underpass"
        }
    ]
    return recommend_resource_assignments(sample_incidents)

@router.post("/assign")
def assign_team_to_incident(payload: Dict[str, Any]):
    """Assigns a rescue team to an incident and updates unit status."""
    team_id = payload.get("team_id")
    incident_id = payload.get("incident_id")
    if not team_id or not incident_id:
        raise HTTPException(status_code=400, detail="team_id and incident_id are required")
    res = assign_rescue_team(team_id, incident_id)
    if not res.get("success"):
        raise HTTPException(status_code=404, detail=res.get("message"))
    return res

@router.get("/kpi")
def get_response_performance_kpis():
    """Returns municipal response performance KPIs (Response time, Resolution rate, Unit utilization)."""
    return get_performance_kpis()

@router.post("/orchestrate")
def run_orchestrated_pipeline(payload: Dict[str, Any]):
    """Runs automated end-to-end event chain from telemetry to dispatch recommendation."""
    telemetry = payload.get("telemetry", {
        "rainfall_mm": 68.5,
        "water_level_m": 2.4,
        "water_rise_rate": 0.6
    })
    return execute_orchestrated_pipeline(telemetry)

@router.post("/anomalies/evaluate")
def evaluate_telemetry_anomalies(payload: Dict[str, Any]):
    """Evaluates telemetry for out-of-bound spikes or sensor malfunction."""
    return detect_telemetry_anomalies(payload)
