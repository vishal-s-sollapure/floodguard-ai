"""
API Endpoints for Neighborhood Emergency Broadcast & SMS Simulator
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from services.broadcast_service import dispatch_emergency_broadcast, get_broadcast_history

router = APIRouter()

class BroadcastRequest(BaseModel):
    target_zone: str = Field(..., description="Target neighborhood or municipal zone")
    severity_level: str = Field("CRITICAL RED ALERT", description="Severity level badge")
    channels: List[str] = Field(["Cell Broadcast (CAP)", "WhatsApp Emergency Bot", "Mass SMS"], description="Selected broadcast channels")
    custom_message: Optional[str] = None

@router.post("/send")
def trigger_broadcast(payload: BroadcastRequest):
    """
    Trigger simulated multi-channel emergency broadcast alerts to target municipal zones.
    """
    try:
        record = dispatch_emergency_broadcast(
            target_zone=payload.target_zone,
            severity_level=payload.severity_level,
            channels=payload.channels,
            custom_message=payload.custom_message
        )
        return {"status": "success", "message": "Neighborhood Emergency Broadcast Dispatched Successfully", "data": record}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def fetch_broadcast_history():
    """
    Fetch history of emergency broadcasts dispatched by officers.
    """
    history = get_broadcast_history()
    return {"status": "success", "data": history}
