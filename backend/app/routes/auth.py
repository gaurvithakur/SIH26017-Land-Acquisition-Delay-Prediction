from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import APIRouter, HTTPException

from app.core.config import DATABASE_URL
from app.db.database import SessionLocal
from app.db.models import User
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UserResponse,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

password_hasher = PasswordHasher()

JWT_SECRET = "landpredict-secret-change-this-later"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 60 * 24


def create_access_token(user: User) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=JWT_EXPIRATION_MINUTES
    )

    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


@router.post("/register", response_model=AuthResponse)
def register(request: RegisterRequest):
    db = SessionLocal()

    try:
        existing_user = (
            db.query(User)
            .filter(User.email == request.email.lower())
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered",
            )

        user = User(
            name=request.name.strip(),
            email=request.email.lower(),
            password_hash=password_hasher.hash(request.password),
            role="user",
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token(user)

        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
            ),
        )

    finally:
        db.close()


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
    db = SessionLocal()

    try:
        user = (
            db.query(User)
            .filter(User.email == request.email.lower())
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        try:
            password_hasher.verify(
                user.password_hash,
                request.password,
            )
        except VerifyMismatchError:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        token = create_access_token(user)

        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
            ),
        )

    finally:
        db.close()
        