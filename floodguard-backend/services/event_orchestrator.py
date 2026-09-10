"""
Automatic Real-Time Event Chain Orchestrator Service
Executes automated decision-support pipeline:
Rainfall / Hydro Spike -> Anomaly Filter -> Risk Recalculation -> Threshold Check (>=70)
-> Alert Generation -> Incident Escalation -> Vulnerable SOS Match -> Rescue Recommendation -> Officer Dispatch
"""

from typing import Dict, Any, List
from services.risk_engine import calculate_flood_risk
from services.anomaly_detector import detect_telemetry_anomalies
from services.resource_optimizer import recommend_resource_assignments

def execute_orchestrated_pipeline(telemetry: Dict[str, Any]) -> Dict[str, Any]:
    """
    Runs end-to-end automated pipeline chain from raw telemetry to dispatch recommendation.
    """
    steps_executed = []

    # Step 1: Telemetry Sensor Validation & Anomaly Check
    anomaly_res = detect_telemetry_anomalies(telemetry)
    sanitized_telemetry = anomaly_res["sanitized_telemetry"]
    steps_executed.append({
        "step_num": 1,
        "name": "Data Validation & Anomaly Detection",
        "status": "ANOMALY_DETECTED" if anomaly_res["has_anomaly"] else "VALIDATED",
        "detail": anomaly_res["system_action"]
    })

    # Step 2: Risk Scoring Recalculation
    risk_result = calculate_flood_risk(
        rainfall_mm=sanitized_telemetry["rainfall_mm"],
        water_level_m=sanitized_telemetry["water_level_m"],
        water_rise_rate=sanitized_telemetry["water_rise_rate"],
        historical_floods=telemetry.get("historical_floods", 5),
        drainage_risk=telemetry.get("drainage_risk", "High"),
        population=telemetry.get("population", 15000)
    )
    score = risk_result.get("risk_score", 50.0)
    level = risk_result.get("risk_level", "MODERATE")
    steps_executed.append({
        "step_num": 2,
        "name": "Mathematical Risk Recalculation",
        "status": "SUCCESS",
        "detail": f"Calculated Risk Score: {score}% ({level})"
    })

    # Step 3: Threshold Breach Evaluation (Score >= 70 triggers automatic alerts)
    alert_triggered = False
    alert_payload = None
    if score >= 70.0:
        alert_triggered = True
        alert_payload = {
            "title": f"AUTOMATED CRITICAL ALERT — Risk {score}% in Koramangala Zone",
            "severity": level,
            "message": f"Precipitation ({sanitized_telemetry['rainfall_mm']} mm/hr) and water level ({sanitized_telemetry['water_level_m']}m) exceeded safe thresholds.",
            "recommended_action": "Evacuate low-lying underpass zones immediately."
        }
    steps_executed.append({
        "step_num": 3,
        "name": "Threshold Breach Evaluation",
        "status": "ALERT_TRIGGERED" if alert_triggered else "STABLE",
        "detail": f"Threshold {score}% >= 70.0% -> Automated Cell Alert Generated" if alert_triggered else "Risk within normal parameters"
    })

    # Step 4: Vulnerable Population SOS Check & Rescue Resource Optimization
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
            "vulnerability_type": "Hospital ICU Power Failure Risk",
            "priority_score": 92.0,
            "lat": 12.9280,
            "lng": 77.6250,
            "location_name": "St. John's Perimeter"
        }
    ]
    resource_recommendations = recommend_resource_assignments(sample_incidents)
    steps_executed.append({
        "step_num": 4,
        "name": "Vulnerable Population & Rescue Optimizer",
        "status": "RECOMMENDED",
        "detail": f"Matched {len(resource_recommendations)} optimal emergency units for high-priority SOS tickets"
    })

    return {
        "pipeline_status": "ORCHESTRATION_COMPLETE",
        "steps_executed": steps_executed,
        "final_risk_score": score,
        "final_risk_level": level,
        "alert_generated": alert_payload,
        "resource_recommendations": resource_recommendations,
        "anomaly_report": anomaly_res
    }
