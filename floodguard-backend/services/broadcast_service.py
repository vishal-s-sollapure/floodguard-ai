"""
Neighborhood Emergency Broadcast & Multilingual SMS Dispatch Service
"""

import uuid
from datetime import datetime
from typing import List, Dict

# In-memory broadcast log history
broadcast_history_db: List[Dict] = [
    {
        "id": "bcast-78192a",
        "timestamp": datetime.now().isoformat(),
        "target_zone": "Koramangala 4th Block & 100ft Ring Road",
        "severity_level": "CRITICAL RED ALERT",
        "channels": ["Cell Broadcast (CAP)", "WhatsApp Emergency Bot", "Mass SMS"],
        "recipients_notified": 18450,
        "delivery_rate": 99.4,
        "message_en": "CRITICAL FLOOD WARNING: Ground submersions up to 1.8m in Koramangala 4th Block. Evacuate to Koramangala Indoor Stadium Relief Shelter immediately!",
        "message_kn": "ತೀವ್ರ ಕೋರಮಂಗಲ ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ: 4 ನೇ ಬ್ಲಾಕ್‌ನಲ್ಲಿ 1.8 ಮೀಟರ್ ನೀರು ತುಂಬಿದೆ. ತಕ್ಷಣ ಕೋರಮಂಗಲ ಇಂಡೋರ್ ಕ್ರೀಡಾಂಗಣ ಆಶ್ರಯ ಕೇಂದ್ರಕ್ಕೆ ಸ್ಥಳಾಂತರಗೊಳ್ಳಿ!",
        "message_hi": "गंभीर बाढ़ चेतावनी: कोरमंगला 4थ ब्लॉक में 1.8 मीटर पानी भर गया है। तुरंत कोरमंगला इंडोर स्टेडियम राहत आश्रय में स्थानांतरित हों!"
    },
    {
        "id": "bcast-34910b",
        "timestamp": datetime.now().isoformat(),
        "target_zone": "Silk Board Junction & Agara Underpass",
        "severity_level": "HIGH WARNING",
        "channels": ["Cell Broadcast (CAP)", "Mass SMS"],
        "recipients_notified": 24100,
        "delivery_rate": 98.8,
        "message_en": "TRAFFIC & SAFETY ADVISORY: Agara Underpass completely submerged. All vehicle transit diverted via Flyover. Avoid low-lying stretches.",
        "message_kn": "ಸಂಚಾರ ಮುನ್ನೆಚ್ಚರಿಕೆ: ಅಗಲರ ಅಂಡರ್‌ಪಾಸ್ ಸಂಪೂರ್ಣವಾಗಿ ಜಲಾವೃತವಾಗಿದೆ. ವಾಹನ ಸಂಚಾರವನ್ನು ಫ್ಲೈಓವರ್ ಮೂಲಕ ಬದಲಾಯಿಸಲಾಗಿದೆ.",
        "message_hi": "यातायात और सुरक्षा सलाह: अगरा अंडरपास पूरी तरह से जलमग्न। सभी वाहनों को फ्लाईओवर से डायवर्ट किया गया है।"
    }
]

NEIGHBORHOOD_POPULATION_ESTIMATES = {
    "Koramangala 4th Block & 100ft Ring Road": 18450,
    "Silk Board Junction & Agara Underpass": 24100,
    "Indiranagar 100ft Road & Domlur": 15200,
    "Bellandur Outer Ring Road Tech Parks": 32800,
    "HSR Layout 6th Sector & Agara Lake": 19600,
    "City-Wide All Bengaluru Zones": 115000
}

def generate_multilingual_templates(target_zone: str, severity_level: str, shelter_name: str = "Koramangala Indoor Stadium"):
    """
    Generates dynamic broadcast messages in English, Kannada, and Hindi based on threat level.
    """
    if "CRITICAL" in severity_level.upper():
        en = f"🚨 CRITICAL FLOOD EMERGENCY ALERT [{target_zone}]: Rapid water rise detected! Evacuate ground levels immediately to nearest relief shelter ({shelter_name}). Emergency Helpline: 1077 / 112."
        kn = f"🚨 ಪ್ರವಾಹ ತುರ್ತು ಎಚ್ಚರಿಕೆ [{target_zone}]: ವೇಗದ ನೀರು ಏರಿಕೆ ಕಂಡಿದೆ! ತಕ್ಷಣ ಹತ್ತಿರದ ಆಶ್ರಯ ಕೇಂದ್ರಕ್ಕೆ ({shelter_name}) ತೆರಳಿ. ಸಹಾಯವಾಣಿ: 1077 / 112."
        hi = f"🚨 गंभीर बाढ़ आपातकालीन चेतावनी [{target_zone}]: तेजी से जल स्तर बढ़ रहा है! तुरंत निकटतम आश्रय केंद्र ({shelter_name}) में स्थानांतरित हों। हेल्पलाइन: 1077 / 112।"
    elif "HIGH" in severity_level.upper():
        en = f"⚠️ HIGH FLOOD WARNING [{target_zone}]: Severe waterlogging & stormwater drain overflows reported. Drive with extreme caution & avoid submerged underpasses."
        kn = f"⚠️ ಉನ್ನತ ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ [{target_zone}]: ಭಾರಿ ನೀರು ನಿಲ್ಲುವಿಕೆ ಮತ್ತು ಚರಂಡಿ ಉಕ್ಕಿ ಹರಿಯುವುದು ವರದಿಯಾಗಿದೆ. ಎಚ್ಚರಿಕೆಯಿಂದ ವಾಹನ ಚಲಾಯಿಸಿ."
        hi = f"⚠️ उच्च बाढ़ चेतावनी [{target_zone}]: भारी जलभराव और नाले के उफान की सूचना। जलमग्न अंडरपास से बचें।"
    else:
        en = f"ℹ️ FLOOD SAFETY ADVISORY [{target_zone}]: Moderate precipitation ongoing. Automated drainage pumps operating. Stay tuned to FloodGuard AI telemetry."
        kn = f"ℹ️ ಪ್ರವಾಹ ಸುರಕ್ಷತಾ ಸಲಹೆ [{target_zone}]: ಸಾಧಾರಣ ಮಳೆ ಮುಂದುವರೆದಿದೆ. ಚರಂಡಿ ಪಂಪ್‌ಗಳು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ."
        hi = f"ℹ️ बाढ़ सुरक्षा सलाह [{target_zone}]: मध्यम वर्षा जारी है। नाले के पंप काम कर रहे हैं। FloodGuard AI से अपडेट रहें।"

    return {"en": en, "kn": kn, "hi": hi}

def dispatch_emergency_broadcast(target_zone: str, severity_level: str, channels: List[str], custom_message: str = None):
    """
    Simulates sending emergency SMS, WhatsApp, and CAP Cell Broadcasts across municipal networks.
    """
    bcast_id = f"bcast-{uuid.uuid4().hex[:6]}"
    timestamp = datetime.now().isoformat()
    
    # Calculate recipient reach
    recipients = NEIGHBORHOOD_POPULATION_ESTIMATES.get(target_zone, 18500)
    
    # Templates
    templates = generate_multilingual_templates(target_zone, severity_level)
    
    if custom_message and custom_message.trim():
        templates["en"] = custom_message

    record = {
        "id": bcast_id,
        "timestamp": timestamp,
        "target_zone": target_zone,
        "severity_level": severity_level,
        "channels": channels or ["Cell Broadcast (CAP)", "Mass SMS"],
        "recipients_notified": recipients,
        "delivery_rate": 99.2,
        "message_en": templates["en"],
        "message_kn": templates["kn"],
        "message_hi": templates["hi"]
    }

    # Prepend to history database
    broadcast_history_db.insert(0, record)
    return record

def get_broadcast_history():
    """Returns list of past emergency dispatches."""
    return broadcast_history_db
