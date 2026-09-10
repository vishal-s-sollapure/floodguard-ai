import uuid
from datetime import datetime

SOS_TICKETS = [
    {
        "id": "sos-101",
        "citizen_name": "Dr. Ramesh (St. Philomena Care)",
        "phone": "+91 98450 11223",
        "vulnerability": "Hospital / Infirmary",
        "stranded_count": 14,
        "medical_emergency": True,
        "medical_notes": "3 ICU patients requiring emergency generator power & oxygen refilling.",
        "required_mode": "Medical Ambulance & Boat",
        "location_name": "Koramangala 4th Block, 8th Main",
        "lat": 12.9348,
        "lng": 77.6230,
        "priority_score": 98,
        "status": "CRITICAL_SOS",
        "assigned_unit": None,
        "timestamp": datetime.now().isoformat()
    },
    {
        "id": "sos-102",
        "citizen_name": "Savitri Amma (Age 78)",
        "phone": "+91 99001 44556",
        "vulnerability": "Senior Citizen (65+)",
        "stranded_count": 2,
        "medical_emergency": True,
        "medical_notes": "Wheelchair bound, water reached 1.2m inside ground floor living room.",
        "required_mode": "NDRF Rescue Boat",
        "location_name": "Bellandur Outer Ring Road, Near EcoSpace",
        "lat": 12.9290,
        "lng": 77.6740,
        "priority_score": 92,
        "status": "CRITICAL_SOS",
        "assigned_unit": None,
        "timestamp": datetime.now().isoformat()
    },
    {
        "id": "sos-103",
        "citizen_name": "Anand & Family",
        "phone": "+91 97312 88990",
        "vulnerability": "Stranded Rooftop",
        "stranded_count": 5,
        "medical_emergency": False,
        "medical_notes": "2 infants in family, ground floor completely submerged.",
        "required_mode": "Helicopter Airlift",
        "location_name": "HSR Layout Sector 6, 14th Cross",
        "lat": 12.9110,
        "lng": 77.6390,
        "priority_score": 85,
        "status": "RESCUE_TEAM_DISPATCHED",
        "assigned_unit": "Indian Air Force Helicopter Unit-2",
        "timestamp": datetime.now().isoformat()
    }
]

def calculate_sos_priority(vulnerability: str, medical_emergency: bool, stranded_count: int) -> int:
    score = 50
    vulnerability_lower = vulnerability.lower()
    
    if "hospital" in vulnerability_lower or "infirmary" in vulnerability_lower:
        score += 30
    elif "senior" in vulnerability_lower or "elderly" in vulnerability_lower:
        score += 25
    elif "disabled" in vulnerability_lower or "mobility" in vulnerability_lower:
        score += 20
    elif "pregnant" in vulnerability_lower or "infant" in vulnerability_lower:
        score += 20
    elif "rooftop" in vulnerability_lower:
        score += 15

    if medical_emergency:
        score += 20

    if stranded_count > 5:
        score += 10

    return min(score, 100)

def create_sos_ticket(data: dict):
    vulnerability = data.get("vulnerability", "Stranded Resident")
    medical_emergency = data.get("medical_emergency", False)
    stranded_count = int(data.get("stranded_count", 1))

    priority_score = calculate_sos_priority(vulnerability, medical_emergency, stranded_count)
    
    ticket = {
        "id": f"sos-{uuid.uuid4().hex[:6]}",
        "citizen_name": data.get("citizen_name", "Anonymous Citizen"),
        "phone": data.get("phone", "+91 1077"),
        "vulnerability": vulnerability,
        "stranded_count": stranded_count,
        "medical_emergency": medical_emergency,
        "medical_notes": data.get("medical_notes", "Emergency evacuation requested"),
        "required_mode": data.get("required_mode", "NDRF Rescue Boat"),
        "location_name": data.get("location_name", "Bengaluru Flood Zone"),
        "lat": float(data.get("lat", 12.9352)),
        "lng": float(data.get("lng", 77.6245)),
        "priority_score": priority_score,
        "status": "CRITICAL_SOS",
        "assigned_unit": None,
        "timestamp": datetime.now().isoformat()
    }
    
    SOS_TICKETS.insert(0, ticket)
    return ticket

def get_active_sos_tickets():
    return sorted(SOS_TICKETS, key=lambda x: x["priority_score"], reverse=True)

def update_sos_dispatch(ticket_id: str, status: str, assigned_unit: str = None):
    for ticket in SOS_TICKETS:
        if ticket["id"] == ticket_id:
            ticket["status"] = status
            if assigned_unit:
                ticket["assigned_unit"] = assigned_unit
            return ticket
    return None
