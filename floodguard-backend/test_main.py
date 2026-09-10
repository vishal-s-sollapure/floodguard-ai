import pytest
from services.risk_engine import calculate_flood_risk
from services.gemini_service import generate_alert_content, analyze_flood_image

def test_risk_engine_calculation_low():
    res = calculate_flood_risk(
        rainfall_mm=10.0,
        water_level_m=0.5,
        water_rise_rate=0.02,
        historical_floods=1,
        drainage_risk="low",
        population=5000
    )
    assert res["risk_level"] == "LOW"
    assert res["risk_score"] <= 30.0
    assert "xai_breakdown" in res
    assert "trend_series" in res

def test_risk_engine_calculation_critical():
    res = calculate_flood_risk(
        rainfall_mm=95.0,
        water_level_m=2.8,
        water_rise_rate=0.45,
        historical_floods=8,
        drainage_risk="high",
        population=45000
    )
    assert res["risk_level"] == "CRITICAL"
    assert res["risk_score"] >= 80.0
    assert res["projected_score_30m"] >= res["risk_score"]
    assert "rainfall" in res["xai_breakdown"]

def test_gemini_service_safety_disclaimer():
    alert = generate_alert_content(85.0, "CRITICAL", ["Koramangala"])
    assert "title" in alert
    assert "message" in alert
    assert "disclaimer" in alert

def test_gemini_vision_structured_checklist():
    analysis = analyze_flood_image("dummy_base64_string", "Flooded Road")
    assert "checklist" in analysis
    assert "waterlogging" in analysis["checklist"]
    assert "disclaimer" in analysis
