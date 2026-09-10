import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key")

def generate_alert_content(risk_score: float, risk_level: str = None, affected_areas: list = None) -> dict:
    """
    Generates an alert title and message using Google Gemini AI or a smart template fallback.
    """
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

    # Attempt Gemini API call if key provided
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key":
        try:
            client = genai.Client(api_key=GEMINI_API_KEY)
            prompt = (
                f"Generate a concise 2-sentence public safety flood alert for a risk score of {risk_score}/100 "
                f"classified as {risk_level} risk affecting areas: {areas_str}."
            )
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            if response and response.text:
                return {
                    "title": f"FLOOD ALERT: {risk_level} Risk Level ({risk_score}/100)",
                    "message": response.text.strip(),
                    "severity": risk_level
                }
        except Exception as e:
            print(f"Gemini API error: {e}. Utilizing template fallback.")

    # Smart template fallback
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
        "severity": risk_level
    }

def get_assistant_response(message: str, risk_score: float = 87.0, risk_level: str = "CRITICAL", location: str = "Koramangala") -> str:
    """
    Generates emergency safety guidance using Gemini AI assistant or fallback.
    """
    prompt = (
        f"You are FloodGuard AI emergency assistant. Current flood situation: \n"
        f"Risk Level: {risk_level}, Risk Score: {risk_score}%, Location: {location}.\n"
        f"Provide specific, actionable safety guidance in 3-4 sentences. \n"
        f"Include nearest emergency action. Be direct and calm.\n\n"
        f"User Question: {message}"
    )

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key":
        try:
            client = genai.Client(api_key=GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"Gemini assistant error: {e}. Utilizing emergency fallback.")

    return (
        f"FloodGuard Emergency Assistant ({location}): Currently experiencing {risk_level} risk ({risk_score}%). "
        f"Move immediately to higher ground and avoid all flooded underpasses and roads in {location}. "
        f"Keep emergency kits ready and disconnect electrical main switches if water rises near outlets. "
        f"Call state emergency response at 1077 or 112 if immediate rescue is required."
    )

