from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.sos_service import create_sos_ticket, get_active_sos_tickets, update_sos_dispatch

router = APIRouter(prefix="/api/sos", tags=["SOS Rescue Escalation"])

class SOSTriggerRequest(BaseModel):
    citizen_name: str
    phone: str
    vulnerability: str
    stranded_count: int = 1
    medical_emergency: bool = False
    medical_notes: Optional[str] = None
    required_mode: str = "NDRF Rescue Boat"
    location_name: str = "Koramangala"
    lat: float = 12.9352
    lng: float = 77.6245

class SOSDispatchUpdate(BaseModel):
    status: str
    assigned_unit: Optional[str] = "NDRF Rescue Boat Team 4"

@router.post("/trigger")
def trigger_sos(req: SOSTriggerRequest):
    """Submit high-priority citizen emergency SOS rescue request."""
    return create_sos_ticket(req.dict())

@router.get("/active")
def list_active_sos():
    """Get all prioritized active SOS rescue tickets for Disaster Officers."""
    return get_active_sos_tickets()

@router.patch("/{ticket_id}/dispatch")
def dispatch_rescue_unit(ticket_id: str, req: SOSDispatchUpdate):
    """Update status and assign rescue boat/chopper/ambulance unit."""
    updated = update_sos_dispatch(ticket_id, req.status, req.assigned_unit)
    if not updated:
        raise HTTPException(status_code=404, detail="SOS Ticket not found")
    return updated
