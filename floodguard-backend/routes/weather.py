from fastapi import APIRouter
from models.schemas import WeatherData
from services.weather_service import get_bengaluru_weather

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/current", response_model=WeatherData)
async def get_current_weather():
    """
    Fetches real-time or fallback weather data for Bengaluru.
    """
    weather_data = await get_bengaluru_weather()
    return weather_data
