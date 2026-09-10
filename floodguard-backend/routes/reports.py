from fastapi import APIRouter
from typing import List
import uuid
from datetime import datetime

from models.schemas import IncidentReportCreate, IncidentReport
from database import get_database, in_memory_db

router = APIRouter(prefix="/api/reports", tags=["Community Reports"])

@router.post("", response_model=IncidentReport)
async def create_report(payload: IncidentReportCreate):
    """
    Saves a new community incident report to MongoDB (or memory storage).
    """
    report_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat()

    report_dict = {
        "id": report_id,
        "category": payload.category,
        "description": payload.description,
        "location_lat": payload.location_lat,
        "location_lng": payload.location_lng,
        "severity": payload.severity,
        "timestamp": now_iso
    }

    db = get_database()
    if db is not None:
        try:
            await db["reports"].insert_one(dict(report_dict))
        except Exception as e:
            print(f"MongoDB save error: {e}")
            in_memory_db["reports"].append(report_dict)
    else:
        in_memory_db["reports"].append(report_dict)

    return report_dict

@router.get("", response_model=List[IncidentReport])
async def get_reports():
    """
    Returns all community incident reports sorted by newest first.
    """
    db = get_database()
    reports = []

    if db is not None:
        try:
            cursor = db["reports"].find().sort("timestamp", -1)
            async for doc in cursor:
                doc["id"] = str(doc.get("_id", doc.get("id")))
                if "_id" in doc:
                    del doc["_id"]
                reports.append(doc)
        except Exception as e:
            print(f"MongoDB fetch error: {e}")

    if not reports:
        # Sort in-memory items newest first
        sorted_mem = sorted(in_memory_db["reports"], key=lambda x: x["timestamp"], reverse=True)
        return sorted_mem

    return reports
