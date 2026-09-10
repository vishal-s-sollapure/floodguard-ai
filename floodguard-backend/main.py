from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import connect_to_mongo, close_mongo_connection
from routes import flood, reports, alerts, weather, auth, evacuation, sos, impact, broadcast, history

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB Atlas on startup
    await connect_to_mongo()
    yield
    # Close connection on shutdown
    await close_mongo_connection()

app = FastAPI(
    title="FloodGuard AI Backend",
    description="Early Warning & Risk Assessment System for Flooding",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router)
app.include_router(flood.router)
app.include_router(reports.router)
app.include_router(alerts.router)
app.include_router(weather.router)
app.include_router(evacuation.router)
app.include_router(sos.router)
app.include_router(impact.router, prefix="/api/impact", tags=["Disaster Impact & Loss Analytics"])
app.include_router(broadcast.router, prefix="/api/broadcast", tags=["Neighborhood Emergency Broadcast"])
app.include_router(history.router, prefix="/api/history", tags=["30-Day Historical Risk Analytics"])

# Health check endpoint
@app.get("/")
async def health_check():
    return {"status": "FloodGuard AI backend running"}
