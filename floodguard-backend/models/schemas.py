from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class FloodPredictInput(BaseModel):
    rainfall_mm: float = Field(..., description="Rainfall intensity in millimeters", ge=0.0)
    water_level_m: float = Field(..., description="Water level in meters", ge=0.0)
    water_rise_rate: float = Field(..., description="Rate of water rise in meters per hour", ge=0.0)
    historical_floods: int = Field(..., description="Number of historical flood events", ge=0)
    drainage_risk: str = Field(..., description="Drainage risk level ('low', 'medium', 'high')")
    population: int = Field(..., description="Affected population count", ge=0)
    location: Optional[str] = Field(default="Bengaluru", description="Location name")

class FloodPrediction(BaseModel):
    id: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    rainfall_mm: float
    water_level_m: float
    water_rise_rate: float
    historical_floods: int
    drainage_risk: str
    population: int
    risk_score: float
    risk_level: str
    eta_minutes: int
    recommended_action: str
    location: str = "Bengaluru"

class IncidentReportCreate(BaseModel):
    category: str = Field(..., description="Category of incident e.g., Waterlogging, Blocked Drain, Submerged Road")
    description: str = Field(..., description="Detailed description of the incident")
    location_lat: float = Field(..., description="Latitude coordinate")
    location_lng: float = Field(..., description="Longitude coordinate")
    severity: str = Field(..., description="Severity level: low, medium, high, critical")
    location_name: Optional[str] = Field(default="Bengaluru", description="Neighborhood / area name")
    image_base64: Optional[str] = Field(default=None, description="Base64 encoded flood image")

class IncidentReport(BaseModel):
    id: Optional[str] = None
    category: str
    description: str
    location_lat: float
    location_lng: float
    severity: str
    location_name: Optional[str] = "Bengaluru"
    status: str = "Pending" # Pending, Verified, Resolved, Dismissed
    image_base64: Optional[str] = None
    ai_hazard_analysis: Optional[str] = None
    verified_by: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ReportStatusUpdate(BaseModel):
    status: str = Field(..., description="Status string: Pending, Verified, Resolved, Dismissed")
    officer_notes: Optional[str] = Field(default=None)

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = Field(default="citizen", description="Role: citizen or officer")

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class ImageAnalysisRequest(BaseModel):
    image_base64: str
    category: Optional[str] = "Flooded Road"

class ImageAnalysisResponse(BaseModel):
    detected_depth: str
    hazard_severity: str
    submerged_objects: List[str]
    ai_summary: str

class AlertCreate(BaseModel):
    title: Optional[str] = None
    risk_score: float = Field(..., ge=0.0, le=100.0)
    risk_level: Optional[str] = None
    affected_areas: Optional[List[str]] = Field(default_factory=lambda: ["Bengaluru Central", "East Zone"])

class Alert(BaseModel):
    id: Optional[str] = None
    title: str
    message: str
    severity: str
    risk_score: float
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    is_active: bool = True

class WeatherData(BaseModel):
    city: str = "Bengaluru"
    rainfall_mm_hr: float = 18.5
    temperature_c: float = 23.8
    humidity_percent: int = 84
    description: str = "Moderate to heavy rainfall in east zones"
    wind_speed_kmh: Optional[float] = 12.4
    pressure_hpa: Optional[int] = 1008
    visibility_km: Optional[float] = 4.2
    source: str = "simulated"
    timestamp: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())

class AssistantRequest(BaseModel):
    message: str = Field(..., description="User query or safety question")
    risk_score: float = Field(default=87.0, description="Risk score percentage")
    risk_level: str = Field(default="CRITICAL", description="Risk level string")
    location: str = Field(default="Koramangala", description="Neighborhood or area")

class AssistantResponse(BaseModel):
    response: str

