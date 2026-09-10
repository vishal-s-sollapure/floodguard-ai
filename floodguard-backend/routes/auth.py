import os
import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional

from models.schemas import UserRegister, UserLogin, TokenResponse
from database import get_database

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "floodguard_ai_secret_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    db = get_database()
    
    # Check if user already exists
    if db is not None:
        existing_user = await db.users.find_one({"email": user_data.email.lower()})
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = {
        "email": user_data.email.lower(),
        "password": user_data.password, # In production passlib.hash.bcrypt.hash(user_data.password)
        "full_name": user_data.full_name,
        "role": user_data.role.lower(),
        "created_at": datetime.utcnow().isoformat()
    }

    if db is not None:
        result = await db.users.insert_one(new_user)
        new_user["id"] = str(result.inserted_id)
    else:
        new_user["id"] = "simulated_user_id"

    token = create_access_token({"sub": new_user["email"], "role": new_user["role"], "full_name": new_user["full_name"]})
    
    user_payload = {
        "email": new_user["email"],
        "full_name": new_user["full_name"],
        "role": new_user["role"]
    }
    return TokenResponse(access_token=token, token_type="bearer", user=user_payload)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_database()
    
    # Check demo accounts first for instant testing
    if credentials.email.lower() == "officer@floodguard.ai":
        user_payload = {"email": "officer@floodguard.ai", "full_name": "Chief Officer Sharma", "role": "officer"}
        token = create_access_token({"sub": user_payload["email"], "role": user_payload["role"], "full_name": user_payload["full_name"]})
        return TokenResponse(access_token=token, token_type="bearer", user=user_payload)
        
    if credentials.email.lower() == "citizen@floodguard.ai":
        user_payload = {"email": "citizen@floodguard.ai", "full_name": "Ananya Rao", "role": "citizen"}
        token = create_access_token({"sub": user_payload["email"], "role": user_payload["role"], "full_name": user_payload["full_name"]})
        return TokenResponse(access_token=token, token_type="bearer", user=user_payload)

    user = None
    if db is not None:
        user = await db.users.find_one({"email": credentials.email.lower()})

    if not user or user.get("password") != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_payload = {
        "email": user["email"],
        "full_name": user.get("full_name", "User"),
        "role": user.get("role", "citizen")
    }
    token = create_access_token({"sub": user_payload["email"], "role": user_payload["role"], "full_name": user_payload["full_name"]})
    return TokenResponse(access_token=token, token_type="bearer", user=user_payload)
