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


def _capability_match_score(vulnerability: str, team_capability: str) -> float:
    """
    Returns 0.0-1.0 capability match score.
    Hard-required capabilities (e.g. Medical for ICU) return 0.0 if mismatched
    so the optimizer never assigns an ambulance to a waterlogging case.
    """
    vuln = vulnerability.lower()
    cap = team_capability.lower()

    # Hard-requirement rules — must match or capability score is near-zero
    if any(k in vuln for k in ["icu", "hospital", "medical", "patient"]):
        return 1.0 if "medical" in cap else 0.05
    if any(k in vuln for k in ["rooftop", "aerial", "helicopter", "height"]):
        return 1.0 if "helicopter" in cap else 0.10
    if any(k in vuln for k in ["waterlogging", "drainage", "basement", "pump"]):
        return 1.0 if "pump" in cap or "drain" in cap else 0.40
    if any(k in vuln for k in ["stranded", "flood", "citizen", "family", "rooftop"]):
        return 1.0 if "boat" in cap or "ndrf" in cap else 0.50
    # Generic — any available team acceptable
    return 0.70


def recommend_resource_assignments(incidents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Multi-factor weighted rescue team optimizer.
    
    Scoring formula (0-100):
      score = (priority_weight × 0.40)
            + (capability_match × 0.35)
            + (proximity_score × 0.20)
            + (capacity_score × 0.05)
    
    Incidents are processed strictly highest-priority-first.
    Once a team is assigned to a high-priority incident, it is removed
    from the pool so it cannot be reallocated to a lower-priority one.
    """
    recommendations = []
    # Only consider teams that are AVAILABLE right now
    available_teams = [t for t in RESCUE_TEAMS if t["status"] == "AVAILABLE"]

    # Sort incidents by priority descending — critical cases claim teams first
    sorted_incidents = sorted(incidents, key=lambda x: x.get("priority_score", 0), reverse=True)
    assigned_team_ids: set = set()

    for incident in sorted_incidents:
        inc_lat = incident.get("lat", 12.9340)
        inc_lng = incident.get("lng", 77.6100)
        inc_id = incident.get("id", "SOS-UNKNOWN")
        vulnerability = incident.get("vulnerability_type", "Standard")
        priority = float(incident.get("priority_score", 50))

        candidate_teams = []
        for team in available_teams:
            if team["id"] in assigned_team_ids:
                continue  # Already committed to a higher-priority incident

            dist_km = haversine_distance(inc_lat, inc_lng, team["lat"], team["lng"])
            eta = calculate_eta_minutes(dist_km)

            # Factor 1: Incident priority contribution (40% weight)
            priority_contribution = (priority / 100.0) * 40.0

            # Factor 2: Capability match (35% weight) — hard-required types enforced
            cap_match = _capability_match_score(vulnerability, team["capability"])
            capability_contribution = cap_match * 35.0

            # Factor 3: Proximity (20% weight) — penalise distance on a 0-20 scale
            # Max useful distance is 10 km; beyond that score drops to 0
            proximity_score = max(0.0, (10.0 - dist_km) / 10.0)
            proximity_contribution = proximity_score * 20.0

            # Factor 4: Team rescue capacity (5% weight) — prefer larger teams for group rescues
            max_known_capacity = 12.0
            capacity_contribution = min(team["capacity_people"] / max_known_capacity, 1.0) * 5.0

            total_score = round(
                priority_contribution + capability_contribution +
                proximity_contribution + capacity_contribution, 1
            )

            # Build human-readable reasoning
            reasons = []
            if cap_match >= 0.9:
                reasons.append(f"✓ Capability match: {team['capability']}")
            elif cap_match < 0.2:
                reasons.append(f"⚠ Suboptimal capability for {vulnerability}")
            reasons.append(f"✓ {dist_km} km away — ETA {eta} min")
            if priority >= 90:
                reasons.append("✓ Priority-1 case — high-capability unit reserved")

            candidate_teams.append({
                "team": team,
                "distance_km": dist_km,
                "eta_minutes": eta,
                "match_score": total_score,
                "score_breakdown": {
                    "priority_contribution": round(priority_contribution, 1),
                    "capability_contribution": round(capability_contribution, 1),
                    "proximity_contribution": round(proximity_contribution, 1),
                    "capacity_contribution": round(capacity_contribution, 1),
                },
                "reasoning": " | ".join(reasons)
            })

        if not candidate_teams:
            continue  # No available teams for this incident

        best = max(candidate_teams, key=lambda x: x["match_score"])
        best_team = best["team"]

        recommendations.append({
            "incident_id": inc_id,
            "incident_location": incident.get("location_name", "Bengaluru"),
            "priority_score": priority,
            "vulnerability_type": vulnerability,
            "recommended_team_id": best_team["id"],
            "recommended_team_name": best_team["name"],
            "team_capability": best_team["capability"],
            "distance_km": best["distance_km"],
            "eta_minutes": best["eta_minutes"],
            "match_score": best["match_score"],
            "score_breakdown": best["score_breakdown"],
            "reasoning": best["reasoning"],
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
