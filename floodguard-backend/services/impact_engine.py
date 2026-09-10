"""
Disaster Impact & Economic Loss Estimation Engine for FloodGuard AI
Calculates real-time estimates for:
- Affected Households & Population
- Submerged Critical Infrastructure Assets
- Estimated Economic Financial Damage (Residential, Commercial, Municipal Infra in ₹ Lakhs / Crores)
- Required Relief Shelter Capacity Demand
"""

import math

def calculate_impact_metrics(water_level_m: float, rain_rate_mm_hr: float, risk_score: float, location_name: str = "Bengaluru Urban"):
    """
    Computes mathematical impact metrics based on hydrological environmental inputs
    and neighborhood density factors.
    """
    # Baseline scaling factors
    normalized_score = max(0.0, min(100.0, float(risk_score)))
    water_factor = max(0.2, float(water_level_m) / 1.5)
    rain_factor = max(0.2, float(rain_rate_mm_hr) / 30.0)

    # 1. Affected Households & Population
    # Base density: ~1200 households per critical zone
    base_households = int(normalized_score * 32 * water_factor)
    affected_households = max(15, base_households)
    affected_population = affected_households * 4.2  # avg family size 4.2 in urban India

    # 2. Submerged & At-Risk Infrastructure Assets
    infrastructure_assets = []
    
    # Electrical Power Substation
    elec_risk = "CRITICAL" if water_level_m > 2.0 or normalized_score > 75 else ("HIGH" if water_level_m > 1.2 else "MODERATE")
    infrastructure_assets.append({
        "asset_name": "Koramangala 220kV Electrical Substation",
        "category": "Power Grid",
        "risk_level": elec_risk,
        "submerged_percentage": min(100, int(normalized_score * 1.1)),
        "action_required": "Shutdown sub-feeders & deploy mobile dewatering pumps" if elec_risk in ["CRITICAL", "HIGH"] else "Monitor water sensors"
    })

    # Primary Arterial Roads & Underpasses
    road_risk = "IMPASSABLE" if water_level_m > 1.8 or normalized_score > 70 else ("WATERLOGGED" if water_level_m > 0.8 else "CLEAR")
    infrastructure_assets.append({
        "asset_name": "100ft Ring Road & Agara Underpass",
        "category": "Transit Corridor",
        "risk_level": road_risk,
        "submerged_percentage": min(100, int(normalized_score * 1.25)),
        "action_required": "Divert traffic via Outer Ring Road & set up barrier barricades" if road_risk in ["IMPASSABLE", "WATERLOGGED"] else "Traffic flowing normally"
    })

    # Stormwater Drains & Canals (Rajakaluve)
    drain_risk = "OVERFLOWING (100%)" if rain_rate_mm_hr > 40 or normalized_score > 80 else ("CAPACITY CRITICAL (85%)" if rain_rate_mm_hr > 20 else "NORMAL")
    infrastructure_assets.append({
        "asset_name": "Primary Rajakaluve Stormwater Trunk Drain",
        "category": "Drainage System",
        "risk_level": drain_risk,
        "submerged_percentage": min(100, int(normalized_score * 1.15)),
        "action_required": "Clear debris bottlenecks at culverts immediately" if "OVERFLOWING" in drain_risk else "Maintain automated trash screens"
    })

    # Drinking Water Pumping Stations
    water_infra_risk = "HIGH" if water_level_m > 2.2 or normalized_score > 82 else "LOW"
    infrastructure_assets.append({
        "asset_name": "BWSSB Water Treatment & Pumping Station",
        "category": "Public Utilities",
        "risk_level": water_infra_risk,
        "submerged_percentage": min(100, int(normalized_score * 0.7)),
        "action_required": "Protect chlorination pumps with sandbag levees" if water_infra_risk == "HIGH" else "Operating at normal capacity"
    })

    # 3. Estimated Financial Economic Losses (in ₹ INR Lakhs & Crores)
    # Average damage per affected household: ~₹ 85,000 INR (appliances, vehicles, structure)
    res_damage_lakhs = round((affected_households * 0.85), 2)
    
    # Commercial damage (shops, warehouses, tech parks)
    comm_damage_lakhs = round((affected_households * 0.65 * (normalized_score / 50.0)), 2)

    # Municipal public infrastructure repair costs
    infra_damage_lakhs = round((len(infrastructure_assets) * 22.5 * water_factor), 2)

    total_damage_lakhs = round(res_damage_lakhs + comm_damage_lakhs + infra_damage_lakhs, 2)
    total_damage_crores = round(total_damage_lakhs / 100.0, 2)

    # 4. Shelter Capacity Demand & Emergency Rations
    shelter_camps_needed = max(1, math.ceil(affected_households / 350.0))
    water_liters_needed = int(affected_population * 15)  # 15L per person per day
    food_packets_needed = int(affected_population * 3)   # 3 meals per day

    return {
        "location_evaluated": location_name,
        "risk_score": round(normalized_score, 1),
        "affected_households": affected_households,
        "affected_population": int(affected_population),
        "financial_loss": {
            "total_lakhs": total_damage_lakhs,
            "total_crores": total_damage_crores,
            "residential_damage_lakhs": res_damage_lakhs,
            "commercial_damage_lakhs": comm_damage_lakhs,
            "infrastructure_damage_lakhs": infra_damage_lakhs
        },
        "shelter_demand": {
            "camps_needed": shelter_camps_needed,
            "clean_water_liters_day": water_liters_needed,
            "food_packets_day": food_packets_needed
        },
        "infrastructure_assets": infrastructure_assets
    }
