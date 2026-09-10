from fastapi import APIRouter, HTTPException
from typing import List, Optional
import uuid
from datetime import datetime

from models.schemas import IncidentReportCreate, IncidentReport, ReportStatusUpdate, ImageAnalysisRequest, ImageAnalysisResponse
from database import get_database, in_memory_db
from services.gemini_service import analyze_flood_image

router = APIRouter(prefix="/api/reports", tags=["Community Reports"])

@router.post("", response_model=IncidentReport)
async def create_report(payload: IncidentReportCreate):
    """
    Saves a new community incident report with optional Gemini AI vision hazard analysis.
    """
    report_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat()

    ai_analysis = None
    if payload.image_base64:
        try:
            analysis_res = analyze_flood_image(payload.image_base64, payload.category)
            ai_analysis = analysis_res.get("ai_summary")
        except Exception as err:
            print(f"AI image analysis error: {err}")

    report_dict = {
        "id": report_id,
        "category": payload.category,
        "description": payload.description,
        "location_lat": payload.location_lat,
        "location_lng": payload.location_lng,
        "severity": payload.severity,
        "location_name": payload.location_name or "Bengaluru",
        "status": "Pending",
        "image_base64": payload.image_base64,
        "ai_hazard_analysis": ai_analysis,
        "verified_by": None,
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

@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_report_image(payload: ImageAnalysisRequest):
    """
    Analyzes uploaded flood photo with Gemini Vision AI.
    """
    res = analyze_flood_image(payload.image_base64, payload.category or "Flooded Road")
    return ImageAnalysisResponse(
        detected_depth=res["detected_depth"],
        hazard_severity=res["hazard_severity"],
        submerged_objects=res["submerged_objects"],
        ai_summary=res["ai_summary"]
    )

@router.patch("/{report_id}/status")
async def update_report_status(report_id: str, payload: ReportStatusUpdate):
    """
    Officer/Admin route to verify, resolve, or dismiss a report.
    """
    db = get_database()
    updated = False

    if db is not None:
        try:
            from bson import ObjectId
            query = {"_id": ObjectId(report_id)} if len(report_id) == 24 else {"id": report_id}
            result = await db["reports"].update_one(query, {"$set": {"status": payload.status, "verified_by": "Chief Response Officer"}})
            if result.modified_count > 0:
                updated = True
        except Exception as e:
            print(f"MongoDB status update error: {e}")

    # Fallback in-memory update
    for r in in_memory_db["reports"]:
        if r.get("id") == report_id:
            r["status"] = payload.status
            r["verified_by"] = "Chief Response Officer"
            updated = True
            break

    if not updated:
        # Also append/create if not found in memory
        in_memory_db["reports"].append({
            "id": report_id,
            "status": payload.status,
            "verified_by": "Chief Response Officer"
        })

    return {"status": "success", "report_id": report_id, "new_status": payload.status}

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
                if "status" not in doc:
                    doc["status"] = "Pending"
                reports.append(doc)
        except Exception as e:
            print(f"MongoDB fetch error: {e}")

    if not reports:
        sorted_mem = sorted(in_memory_db["reports"], key=lambda x: x.get("timestamp", ""), reverse=True)
        for doc in sorted_mem:
            if "status" not in doc:
                doc["status"] = "Pending"
        return sorted_mem

    return reports
