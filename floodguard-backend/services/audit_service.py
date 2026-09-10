"""
Incident Lifecycle & Timestamped Audit Trail Service for FloodGuard AI
Tracks status transitions: REPORTED -> AI_ANALYZED -> OFFICER_VERIFIED -> PRIORITY_ASSIGNED -> RESCUE_DISPATCHED -> TEAM_EN_ROUTE -> ARRIVED -> RESOLVED
"""

from datetime import datetime
from typing import List, Dict

# In-memory audit trail log
audit_logs_db: List[Dict] = [
    {
        "report_id": "rep-88192",
        "timestamp": datetime.now().isoformat(),
        "from_status": "REPORTED",
        "to_status": "AI_ANALYZED",
        "actor": "Google Gemini Vision API",
        "notes": "Hazard image evaluated: Waterlogging detected (1.2m depth). Confidence: HIGH."
    },
    {
        "report_id": "rep-88192",
        "timestamp": datetime.now().isoformat(),
        "from_status": "AI_ANALYZED",
        "to_status": "OFFICER_VERIFIED",
        "actor": "Officer Ramesh (Disaster Officer ID: 402)",
        "notes": "Incident verified via CCTV feed at Koramangala 100ft underpass."
    },
    {
        "report_id": "rep-88192",
        "timestamp": datetime.now().isoformat(),
        "from_status": "OFFICER_VERIFIED",
        "to_status": "RESCUE_DISPATCHED",
        "actor": "Disaster Response Command Center",
        "notes": "NDRF Boat Unit #4 dispatched to Koramangala 4th Block."
    }
]

def record_audit_event(report_id: str, from_status: str, to_status: str, actor: str, notes: str):
    """Logs an immutable timestamped status transition for an incident report."""
    log_entry = {
        "report_id": report_id,
        "timestamp": datetime.now().isoformat(),
        "from_status": from_status,
        "to_status": to_status,
        "actor": actor,
        "notes": notes
    }
    audit_logs_db.insert(0, log_entry)
    return log_entry

def get_report_audit_trail(report_id: str = None):
    """Retrieves audit trail history for a report or all reports."""
    if report_id:
        return [l for l in audit_logs_db if l["report_id"] == report_id]
    return audit_logs_db
