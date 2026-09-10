from fastapi import APIRouter
from typing import List
import uuid
from datetime import datetime

from models.schemas import AlertCreate, Alert, AssistantRequest, AssistantResponse
from services.gemini_service import generate_alert_content, get_assistant_response
from database import get_database, in_memory_db

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[Alert])
async def get_active_alerts():
    """
    Returns active flood alerts sorted by newest first.
    """
    db = get_database()
    alerts = []

    if db is not None:
        try:
            cursor = db["alerts"].find({"is_active": True}).sort("timestamp", -1)
            async for doc in cursor:
                doc["id"] = str(doc.get("_id", doc.get("id")))
                if "_id" in doc:
                    del doc["_id"]
                alerts.append(doc)
        except Exception as e:
            print(f"MongoDB alert query error: {e}")

    if not alerts and in_memory_db["alerts"]:
        alerts = [a for a in in_memory_db["alerts"] if a.get("is_active", True)]
        alerts.sort(key=lambda x: x["timestamp"], reverse=True)

    if not alerts:
        # Default alert if system has no active alerts stored
        default_gen = generate_alert_content(risk_score=72.5, risk_level="HIGH")
        default_alert = {
            "id": str(uuid.uuid4()),
            "title": default_gen["title"],
            "message": default_gen["message"],
            "severity": default_gen["severity"],
            "risk_score": 72.5,
            "timestamp": datetime.utcnow().isoformat(),
            "is_active": True
        }
        return [default_alert]

    return alerts

@router.post("/generate", response_model=Alert)
async def generate_alert(payload: AlertCreate):
    """
    Generates an alert from risk score using template / Gemini AI service, saves to DB/memory, and returns.
    """
    gen_result = generate_alert_content(
        risk_score=payload.risk_score,
        risk_level=payload.risk_level,
        affected_areas=payload.affected_areas
    )

    alert_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat()

    alert_dict = {
        "id": alert_id,
        "title": payload.title or gen_result["title"],
        "message": gen_result["message"],
        "severity": gen_result["severity"],
        "risk_score": payload.risk_score,
        "timestamp": now_iso,
        "is_active": True
    }

    db = get_database()
    if db is not None:
        try:
            await db["alerts"].insert_one(dict(alert_dict))
        except Exception as e:
            print(f"MongoDB alert save error: {e}")
            in_memory_db["alerts"].append(alert_dict)
    else:
        in_memory_db["alerts"].append(alert_dict)

    return alert_dict

@router.post("/assistant", response_model=AssistantResponse)
async def flood_assistant(payload: AssistantRequest):
    """
    AI Emergency Assistant endpoint providing actionable safety guidance using Gemini AI.
    """
    answer = get_assistant_response(
        message=payload.message,
        risk_score=payload.risk_score,
        risk_level=payload.risk_level,
        location=payload.location
    )
    return {"response": answer}

