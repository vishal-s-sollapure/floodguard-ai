"""
API endpoints for Disaster Impact & Loss Estimation Analytics
"""

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.impact_engine import calculate_impact_metrics

router = APIRouter()

class ImpactRequest(BaseModel):
    water_level_m: float = Field(..., ge=0.0, description="Water level in meters")
    rain_rate_mm_hr: float = Field(..., ge=0.0, description="Rainfall intensity in mm/hr")
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Current flood risk score 0-100")
    location_name: Optional[str] = "Bengaluru Urban"

@router.post("/estimate")
def estimate_disaster_impact(payload: ImpactRequest):
    """
    Calculate real-time affected households, submerged infrastructure, economic financial losses,
    and emergency relief shelter demands.
    """
    try:
        results = calculate_impact_metrics(
            water_level_m=payload.water_level_m,
            rain_rate_mm_hr=payload.rain_rate_mm_hr,
            risk_score=payload.risk_score,
            location_name=payload.location_name
        )
        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/city-summary")
def get_city_impact_summary(
    location: str = Query("Bengaluru Urban", description="Target zone"),
    risk_score: float = Query(68.5, ge=0.0, le=100.0)
):
    """
    Returns city-wide cumulative flood damage risk metrics for municipal reports.
    """
    results = calculate_impact_metrics(
        water_level_m=1.65,
        rain_rate_mm_hr=34.0,
        risk_score=risk_score,
        location_name=location
    )
    return {"status": "success", "data": results}
