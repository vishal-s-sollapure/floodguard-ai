"""
Multi-Incident Rescue Resource Optimizer Service
Matches open SOS incident tickets to available emergency rescue teams based on:
1. Incident Priority Score (0-100 Pts)
2. Required Team Capability (NDRF Boat, Helicopter Unit, Medical Ambulance, Water Pump)
3. GPS Distance & Estimated Response Time (ETA)
"""

import math
from typing import List, Dict, Any

# Seeded Rescue Teams Registry
RESCUE_TEAMS = [
    {
        "id": "TEAM-NDRF-01",
        "name": "NDRF Disaster Unit Alpha",
        "capability": "NDRF Boat & Flood Rescue",
        "status": "AVAILABLE",  # AVAILABLE, DISPATCHED, EN_ROUTE, ON_SCENE
        "lat": 12.9340,
        "lng": 77.6100,
        "base_location": "Koramangala Fire Station",
        "capacity_people": 12,
        "contact_phone": "+91 98450 11001",
        "active_assignment": None
    },
    {
        "id": "TEAM-NDRF-02",
        "name": "NDRF Rapid Boat Squad Bravo",
        "capability": "NDRF Boat & Flood Rescue",
        "status": "AVAILABLE",
        "lat": 12.9170,
        "lng": 77.6230,
        "base_location": "HSR Layout Sector 1 Command",
        "capacity_people": 10,
        "contact_phone": "+91 98450 11002",
        "active_assignment": None
    },
    {
        "id": "TEAM-AIR-01",
        "name": "Indian Air Force Chopper Unit",
        "capability": "Helicopter Aerial Airlift",
        "status": "AVAILABLE",
        "lat": 12.9550,
        "lng": 77.6680,
        "base_location": "HAL Air Force Station",
        "capacity_people": 6,
        "contact_phone": "+91 98450 11003",
        "active_assignment": None
    },
    {
        "id": "TEAM-MED-01",
        "name": "108 Emergency Medical Ambulance-1",
        "capability": "Medical ICU Ambulance",
        "status": "AVAILABLE",
        "lat": 12.9280,
        "lng": 77.6250,
        "base_location": "St. John's Hospital Center",
        "capacity_people": 2,
        "contact_phone": "+91 98450 11004",
        "active_assignment": None
    },
    {
        "id": "TEAM-PUMP-01",
        "name": "BBMP High-Capacity Dewatering Van",
        "capability": "Water Pumping & Drainage Clearing",
        "status": "AVAILABLE",
        "lat": 12.9180,
        "lng": 77.6190,
        "base_location": "Silk Board Municipal Depot",
        "capacity_people": 0,
        "contact_phone": "+91 98450 11005",
        "active_assignment": None
    }
]


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two GPS coordinates in kilometers."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def calculate_eta_minutes(distance_km: float) -> int:
    """Calculate response ETA based on average emergency travel speed (30 km/h in flooded conditions)."""
    if distance_km <= 0:
        return 3
    minutes = (distance_km / 30.0) * 60.0
    return max(3, int(round(minutes)))


def get_all_rescue_teams() -> List[Dict[str, Any]]:
    """Return all rescue teams status."""
    return RESCUE_TEAMS


def recommend_resource_assignments(incidents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Given a list of open SOS incidents, compute optimal rescue team recommendations.
    Uses priority score and GPS proximity matching.
    """
    recommendations = []
    available_teams = [t for t in RESCUE_TEAMS if t["status"] == "AVAILABLE"]

    # Sort incidents by priority (highest priority first)
    sorted_incidents = sorted(incidents, key=lambda x: x.get("priority_score", 0), reverse=True)

    assigned_team_ids = set()

    for incident in sorted_incidents:
        inc_lat = incident.get("lat", 12.9340)
        inc_lng = incident.get("lng", 77.6100)
        inc_id = incident.get("id", "SOS-UNKNOWN")
        vulnerability = incident.get("vulnerability_type", "Standard")
        priority = incident.get("priority_score", 50)

        # Match team by capability if medical or aerial required
        candidate_teams = []
        for team in available_teams:
            if team["id"] in assigned_team_ids:
                continue

            dist = haversine_distance(inc_lat, inc_lng, team["lat"], team["lng"])
            eta = calculate_eta_minutes(dist)

            # Score matching suitability: lower distance + matching capability boost
            capability_boost = 0
            if "Medical" in vulnerability and "Medical" in team["capability"]:
                capability_boost = 50
            elif "Rooftop" in vulnerability and "Helicopter" in team["capability"]:
                capability_boost = 50
            elif "Boat" in team["capability"]:
                capability_boost = 30

            match_score = (100 - (dist * 10)) + capability_boost

            candidate_teams.append({
                "team": team,
                "distance_km": dist,
                "eta_minutes": eta,
                "match_score": match_score
            })

        if candidate_teams:
            # Pick best matching team
            best_candidate = max(candidate_teams, key=lambda x: x["match_score"])
            best_team = best_candidate["team"]

            recommendations.append({
                "incident_id": inc_id,
                "incident_location": incident.get("location_name", "Bengaluru"),
                "priority_score": priority,
                "vulnerability_type": vulnerability,
                "recommended_team_id": best_team["id"],
                "recommended_team_name": best_team["name"],
                "team_capability": best_team["capability"],
                "distance_km": best_candidate["distance_km"],
                "eta_minutes": best_candidate["eta_minutes"],
                "match_score": round(best_candidate["match_score"], 1),
                "reasoning": f"Closest active unit ({best_candidate['distance_km']} km away) matching {vulnerability} requirements."
            })
            assigned_team_ids.add(best_team["id"])

    return recommendations


def assign_rescue_team(team_id: str, incident_id: str) -> Dict[str, Any]:
    """Assign a rescue team to an incident and update unit status."""
    for team in RESCUE_TEAMS:
        if team["id"] == team_id:
            team["status"] = "DISPATCHED"
            team["active_assignment"] = incident_id
            return {
                "success": True,
                "message": f"Team {team['name']} dispatched to Incident #{incident_id}",
                "team": team
            }
    return {"success": False, "message": "Team not found"}
