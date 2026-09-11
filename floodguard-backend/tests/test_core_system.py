"""
Automated System Contract & Core Engine Unit Tests for FloodGuard AI
Run via: pytest
"""

import pytest
from services.risk_engine import calculate_flood_risk
from services.sos_service import calculate_sos_priority
from services.impact_engine import calculate_impact_metrics
from services.broadcast_service import generate_multilingual_templates
from services.history_service import generate_daily_history
from services.simulation_engine import start_simulation_scenario, advance_simulation_step

def test_risk_score_bounds_and_calculations():
    # Test 1: Minimum boundary conditions
    res_min = calculate_flood_risk(
        rainfall_mm=0, water_level_m=0, water_rise_rate=0,
        historical_floods=0, drainage_risk="Low", population=0
    )
    assert res_min["risk_score"] >= 0.0
    assert res_min["risk_level"] == "SAFE"

    # Test 2: Maximum boundary conditions
    res_max = calculate_flood_risk(
        rainfall_mm=200, water_level_m=5, water_rise_rate=3,
        historical_floods=10, drainage_risk="High", population=100000
    )
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


def test_risk_bounds():
    """Risk score must always be 0-100"""
    res = calculate_flood_risk(95, 2.8, 0.45, 8, "high", 18500)
    score = res["risk_score"] if isinstance(res, dict) else res
    assert 0 <= score <= 100, f"Score {score} out of bounds"


def test_critical_threshold():
    """Score 87.2% should trigger CRITICAL"""
    res = calculate_flood_risk(95, 2.8, 0.45, 8, "high", 18500)
    score = res["risk_score"] if isinstance(res, dict) else res
    assert score > 80, "Should be CRITICAL (>80)"


def test_zero_inputs():
    """Zero rainfall = LOW RISK"""
    res = calculate_flood_risk(0, 0.5, 0.1, 2, "low", 5000)
    score = res["risk_score"] if isinstance(res, dict) else res
    assert score < 30, "Should be LOW (<30)"


def test_drainage_high_impact():
    """High drainage risk = +40 points"""
    res_high = calculate_flood_risk(50, 1.5, 0.2, 5, "high", 10000)
    res_low = calculate_flood_risk(50, 1.5, 0.2, 5, "low", 10000)
    score_high = res_high["risk_score"] if isinstance(res_high, dict) else res_high
    score_low = res_low["risk_score"] if isinstance(res_low, dict) else res_low
    assert score_high > score_low, "High drainage should increase risk"

