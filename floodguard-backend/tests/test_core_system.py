"""
Automated System Contract & Core Engine Unit Tests for FloodGuard AI
Run via: pytest
"""

import pytest
from services.risk_engine import calculate_risk_score
from services.sos_service import calculate_sos_priority
from services.impact_engine import calculate_impact_metrics
from services.broadcast_service import generate_multilingual_templates
from services.history_service import generate_daily_history
from services.simulation_engine import start_simulation_scenario, advance_simulation_step

def test_risk_score_bounds_and_calculations():
    # Test 1: Minimum boundary conditions
    res_min = calculate_risk_score(0, 0, 0, 0, 0, 0)
    assert res_min["risk_score"] >= 0.0
    assert res_min["risk_level"] == "SAFE"

    # Test 2: Maximum boundary conditions
    res_max = calculate_risk_score(200, 5, 3, 10, 100, 100)
    assert res_max["risk_score"] <= 100.0
    assert res_max["risk_level"] == "CRITICAL"

    # Test 3: XAI Points breakdown non-negative
    xai = res_max["xai_breakdown"]
    assert xai["rainfall_points"] > 0
    assert xai["water_level_points"] > 0

def test_sos_priority_scoring_engine():
    # Test 4: Hospital ICU Patient with Medical Urgency -> Priority 1
    p1 = calculate_sos_priority("Hospital / Infirmary", 4, True)
    assert p1 >= 90
    
    # Test 5: Senior Citizen with Medical Emergency -> Priority 1
    p2 = calculate_sos_priority("Senior Citizen (65+)", 2, True)
    assert p2 >= 80

    # Test 6: Low risk non-medical case
    p3 = calculate_sos_priority("Stranded Rooftop", 1, False)
    assert p3 < 80

def test_disaster_impact_loss_estimation():
    # Test 7: Impact calculation
    impact = calculate_impact_metrics(water_level_m=1.8, rain_rate_mm_hr=45.0, risk_score=85.0)
    assert impact["affected_households"] > 500
    assert impact["financial_loss"]["total_crores"] > 1.0
    assert len(impact["infrastructure_assets"]) >= 3

def test_multilingual_broadcast_templates():
    # Test 8: Template generator in EN, KN, HI
    tmpl = generate_multilingual_templates("Koramangala", "CRITICAL RED ALERT")
    assert "🚨" in tmpl["en"]
    assert "ಎಚ್ಚರಿಕೆ" in tmpl["kn"]
    assert "चेतावनी" in tmpl["hi"]

def test_historical_analytics_time_series():
    # Test 9: Daily history length and fields
    hist = generate_daily_history("Koramangala 4th Block", 30)
    assert len(hist) == 30
    assert "rainfall_mm" in hist[0]
    assert "water_level_m" in hist[0]

def test_disaster_simulation_scenario_steps():
    # Test 10: Start scenario step 0
    s0 = start_simulation_scenario("MONSOON_CLOUDBURST")
    assert s0["step_index"] == 0
    assert s0["calculated_risk"]["risk_score"] < 50.0

    # Test 11: Advance to step 3 (Peak Cloudburst)
    advance_simulation_step()
    advance_simulation_step()
    s3 = advance_simulation_step()
    assert s3["step_index"] == 3
    assert s3["calculated_risk"]["risk_score"] > 80.0
