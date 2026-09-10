from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime

from models.schemas import FloodPredictInput, FloodPrediction
from services.risk_engine import calculate_flood_risk
from database import get_database, in_memory_db

router = APIRouter(prefix="/api/flood", tags=["Flood Prediction"])

@router.post("/predict", response_model=FloodPrediction)
async def predict_flood_risk(payload: FloodPredictInput):
    """
    Accepts risk inputs, calculates risk score, saves result to MongoDB (or memory),
    and returns full prediction object.
    """
    risk_result = calculate_flood_risk(
        rainfall_mm=payload.rainfall_mm,
        water_level_m=payload.water_level_m,
        water_rise_rate=payload.water_rise_rate,
        historical_floods=payload.historical_floods,
        drainage_risk=payload.drainage_risk,
        population=payload.population
    )

    pred_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat()

    prediction_dict = {
        "id": pred_id,
        "timestamp": now_iso,
        "rainfall_mm": payload.rainfall_mm,
        "water_level_m": payload.water_level_m,
        "water_rise_rate": payload.water_rise_rate,
        "historical_floods": payload.historical_floods,
        "drainage_risk": payload.drainage_risk,
        "population": payload.population,
        "risk_score": risk_result["risk_score"],
        "risk_level": risk_result["risk_level"],
        "eta_minutes": risk_result["eta_minutes"],
        "recommended_action": risk_result["recommended_action"],
        "location": payload.location or "Bengaluru"
    }

    db = get_database()
    if db is not None:
        try:
            await db["predictions"].insert_one(dict(prediction_dict))
        except Exception as e:
            print(f"Error saving to MongoDB: {e}")
            in_memory_db["predictions"].append(prediction_dict)
    else:
        in_memory_db["predictions"].append(prediction_dict)

    return prediction_dict

@router.get("/current", response_model=FloodPrediction)
async def get_current_prediction():
    """
    Returns the latest flood prediction from MongoDB (or fallback memory/default).
    """
    db = get_database()
    latest = None

    if db is not None:
        try:
            latest = await db["predictions"].find_one(sort=[("timestamp", -1)])
        except Exception as e:
            print(f"Error reading from MongoDB: {e}")

    if not latest and in_memory_db["predictions"]:
        latest = sorted(in_memory_db["predictions"], key=lambda x: x["timestamp"], reverse=True)[0]

    if not latest:
        # Default mock prediction if system has no history yet
        default_inputs = FloodPredictInput(
            rainfall_mm=45.0,
            water_level_m=2.1,
            water_rise_rate=0.4,
            historical_floods=3,
            drainage_risk="high",
            population=35000,
            location="Bengaluru East"
        )
        return await predict_flood_risk(default_inputs)

    # Sanitize _id from mongodb if present
    if "_id" in latest:
        latest["id"] = str(latest["_id"])
        del latest["_id"]

    return latest

@router.get("/history", response_model=List[FloodPrediction])
async def get_prediction_history():
    """
    Returns the last 20 flood predictions.
    """
    db = get_database()
    history = []

    if db is not None:
        try:
            cursor = db["predictions"].find().sort("timestamp", -1).limit(20)
            async for doc in cursor:
                doc["id"] = str(doc.get("_id", doc.get("id")))
                if "_id" in doc:
                    del doc["_id"]
                history.append(doc)
        except Exception as e:
            print(f"Error reading history from MongoDB: {e}")

    if not history and in_memory_db["predictions"]:
        sorted_mem = sorted(in_memory_db["predictions"], key=lambda x: x["timestamp"], reverse=True)[:20]
        return sorted_mem

    return history
