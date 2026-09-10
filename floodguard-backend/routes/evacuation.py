from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.evacuation_service import get_all_shelters, calculate_evacuation_route

router = APIRouter(prefix="/api/evacuation", tags=["Evacuation Intelligence"])

class RouteRequest(BaseModel):
    lat: float
    lng: float

@router.get("/shelters")
def list_shelters():
    """Get all active emergency shelters and live occupancy stats."""
    return get_all_shelters()

@router.post("/route")
def get_safe_route(req: RouteRequest):
    """Calculate optimal safe evacuation route avoiding flood zones for given GPS coordinates."""
    if not (-90 <= req.lat <= 90) or not (-180 <= req.lng <= 180):
        raise HTTPException(status_code=400, detail="Invalid GPS coordinates")
    
    return calculate_evacuation_route(req.lat, req.lng)
