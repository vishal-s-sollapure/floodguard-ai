import os
import httpx
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "your_openweather_api_key")

FALLBACK_WEATHER = {
    "city": "Bengaluru",
    "rainfall_mm_hr": 18.5,
    "temperature_c": 23.8,
    "humidity_percent": 84,
    "description": "Moderate to heavy rainfall in east zones",
    "wind_speed_kmh": 12.4,
    "pressure_hpa": 1008,
    "visibility_km": 4.2,
    "source": "simulated"
}

async def get_bengaluru_weather() -> dict:
    """
    Fetches current weather for Bengaluru from OpenWeatherMap API using httpx.
    Falls back to hardcoded monsoon data if API key is missing/invalid or call fails.
    """
    if OPENWEATHER_API_KEY and OPENWEATHER_API_KEY != "your_openweather_api_key":
        url = f"https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid={OPENWEATHER_API_KEY}&units=metric"
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    rainfall = data.get("rain", {}).get("1h", 0.0)
                    temp = data.get("main", {}).get("temp", 23.8)
                    humidity = data.get("main", {}).get("humidity", 84)
                    description = data.get("weather", [{}])[0].get("description", "light rain")
                    wind = data.get("wind", {}).get("speed", 3.4) * 3.6
                    pressure = data.get("main", {}).get("pressure", 1008)
                    visibility = data.get("visibility", 4200) / 1000.0
                    return {
                        "city": "Bengaluru",
                        "rainfall_mm_hr": float(rainfall),
                        "temperature_c": float(temp),
                        "humidity_percent": int(humidity),
                        "description": description.capitalize(),
                        "wind_speed_kmh": round(float(wind), 1),
                        "pressure_hpa": int(pressure),
                        "visibility_km": round(float(visibility), 1),
                        "source": "live"
                    }
        except Exception as e:
            print(f"Weather API error: {e}. Returning fallback Bengaluru monsoon data.")

    return FALLBACK_WEATHER
