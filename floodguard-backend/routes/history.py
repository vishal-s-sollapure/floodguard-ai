"""
API Endpoints for 30-Day Historical Risk Analytics & Flood Log Heatmap
"""

from fastapi import APIRouter, Query, HTTPException
from services.history_service import get_historical_analytics_summary, calculate_neighborhood_flood_frequency

router = APIRouter()

@router.get("/analytics")
def fetch_historical_analytics(
    zone: str = Query("Koramangala 4th Block", description="Target neighborhood zone"),
    days: int = Query(30, ge=7, le=90, description="Timeframe window in days")
):
    """
    Fetch daily time-series historical hydro-telemetry analytics (rainfall, water level, risk score).
    """
    try:
        data = get_historical_analytics_summary(zone_name=zone, timeframe_days=days)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/neighborhood-frequency")
def fetch_neighborhood_frequency():
    """
    Fetch 30-day flood occurrence frequency ranking across Bengaluru neighborhoods.
    """
    try:
        rankings = calculate_neighborhood_flood_frequency()
        return {"status": "success", "data": rankings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
