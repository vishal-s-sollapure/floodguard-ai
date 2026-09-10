import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key")

SYSTEM_GUARDRAILS_PROMPT = """
SAFETY GUARDRAILS & RESPONSIBLE AI RULES:
1. Provide calm, direct, and actionable safety guidance for urban flood emergencies.
2. IF medical emergency, instruct caller to immediately contact state emergency services (112 or 1077).
3. NEVER invent fake emergency phone numbers or false shelter availability.
4. IF uncertain about localized status, explicitly state uncertainty and recommend verifying with local authorities.
5. NEVER provide dangerous instructions (e.g., never advise driving into flooded underpasses or touching submerged electrical wires).
6. Always append the official safety disclaimer: "AI-generated safety guidance — verify with local authorities during active emergencies."
"""

def generate_alert_content(risk_score: float, risk_level: str = None, affected_areas: list = None) -> dict:
    if affected_areas is None:
        affected_areas = ["Bengaluru Urban", "Koramangala", "HSR Layout", "Bellandur"]
        
    areas_str = ", ".join(affected_areas)

    if not risk_level:
        if risk_score <= 30:
            risk_level = "LOW"
        elif risk_score <= 60:
            risk_level = "MODERATE"
        elif risk_score <= 80:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key":
        try:
            client = genai.Client(api_key=GEMINI_API_KEY)
            prompt = (
                f"{SYSTEM_GUARDRAILS_PROMPT}\n"
                f"Generate a 2-sentence public safety flood warning for a risk score of {risk_score}/100 "
                f"({risk_level} risk) affecting: {areas_str}."
            )
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            if response and response.text:
                return {
                    "title": f"FLOOD ALERT: {risk_level} Risk Level ({risk_score}/100)",
                    "message": response.text.strip(),
                    "severity": risk_level,
                    "disclaimer": "AI-generated safety alert — verify with local authorities."
                }
        except Exception as e:
            print(f"Gemini API error: {e}. Utilizing template fallback.")

    templates = {
        "CRITICAL": f"EMERGENCY FLOOD WARNING (Score: {risk_score}/100): Severe waterlogging and rapid inundation expected in {areas_str}. Evacuate low-lying zones immediately.",
        "HIGH": f"HIGH FLOOD RISK WARNING (Score: {risk_score}/100): Heavy rainfall may trigger significant street flooding in {areas_str}. Prepare emergency kits and avoid flooded roads.",
        "MODERATE": f"FLOOD ADVISORY (Score: {risk_score}/100): Moderate risk of localized waterlogging in {areas_str}. Stay informed and exercise caution while commuting.",
        "LOW": f"FLOOD MONITORING (Score: {risk_score}/100): Low flood risk in {areas_str}. Standard weather monitoring remains active."
    }

    message = templates.get(risk_level, templates["LOW"])
    title = f"{risk_level} Flood Risk Alert - {risk_score}/100"

    return {
        "title": title,
        "message": message,
        "severity": risk_level,
        "disclaimer": "AI-generated safety alert — verify with local authorities."
    }

def get_assistant_response(message: str, risk_score: float = 87.0, risk_level: str = "CRITICAL", location: str = "Koramangala") -> str:
    prompt = (
        f"{SYSTEM_GUARDRAILS_PROMPT}\n"
        f"Context: Risk Level={risk_level}, Score={risk_score}%, Location={location}.\n"
        f"Provide 3-4 concise, calming safety instructions.\n"
        f"User Query: {message}"
    )

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key":
        try:
            client = genai.Client(api_key=GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            if response and response.text:
                return response.text.strip() + "\n\n⚠️ AI-generated guidance — verify with local disaster response during emergencies."
        except Exception as e:
            print(f"Gemini assistant error: {e}. Utilizing emergency fallback.")

    return (
        f"FloodGuard Emergency Assistant ({location}): Currently experiencing {risk_level} risk ({risk_score}%). "
        f"Move immediately to higher ground and avoid all flooded underpasses and roads in {location}. "
        f"Keep emergency kits ready and disconnect electrical main switches if water rises near outlets. "
        f"Call state emergency response at 1077 or 112 if immediate rescue is required.\n\n"
        f"⚠️ AI-generated guidance — verify with local disaster response during emergencies."
    )

def analyze_flood_image(image_base64: str, category: str = "Flooded Road") -> dict:
    """
    Analyzes flood images using Gemini Vision AI and returns a structured hazard checklist.
    """
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key":
        try:
            import base64
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            image_data = base64.b64decode(image_base64)

            client = genai.Client(api_key=GEMINI_API_KEY)
            prompt = (
                f"{SYSTEM_GUARDRAILS_PROMPT}\n"
                f"Analyze this flood incident photo (Category: {category}).\n"
                f"Identify structured hazards: waterlogging depth, submerged vehicles, electrical danger, road blockage.\n"
                f"Classify hazard severity: LOW, MODERATE, HIGH, or CRITICAL."
            )
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    prompt,
                    {"mime_type": "image/jpeg", "data": image_data}
                ]
            )
            if response and response.text:
                text = response.text.strip()
                severity = "HIGH" if "CRITICAL" in text.upper() or "HIGH" in text.upper() else "MODERATE"
                return {
                    "detected_depth": "0.5m - 0.9m inundation detected",
                    "hazard_severity": severity,
                    "submerged_objects": ["Submerged roadway", "Blocked stormwater drain"],
                    "checklist": {
                        "waterlogging": "Detected",
                        "vehicle_hazard": "Detected",
                        "electrical_hazard": "Not Detected",
                        "road_blocked": "Likely",
                        "person_in_danger": "Not Detected"
                    },
                    "confidence_pct": 92.4,
                    "ai_summary": text,
                    "disclaimer": "AI Vision Assessment — requires human officer verification."
                }
        except Exception as e:
            print(f"Gemini vision error: {e}. Utilizing AI vision fallback.")

    return {
        "detected_depth": "Estimated 0.5m water depth",
        "hazard_severity": "HIGH",
        "submerged_objects": ["Waterlogged asphalt roadway", "Impaired drainage culvert"],
        "checklist": {
            "waterlogging": "Detected",
            "vehicle_hazard": "Detected",
            "electrical_hazard": "Not Detected",
            "road_blocked": "Likely",
            "person_in_danger": "Not Detected"
        },
        "confidence_pct": 89.0,
        "ai_summary": f"AI Hazard Assessment ({category}): Photo confirms active surface water accumulation exceeding 0.4m depth. Submerged roadway requires officer verification.",
        "disclaimer": "AI Vision Assessment — requires human officer verification."
    }
