from pathlib import Path

import joblib
import pandas as pd
from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.schemas.prediction import PredictionRequest, PredictionResponse

router = APIRouter(prefix="/api", tags=["Prediction"])

# Works both locally and inside Docker
LOCAL_MODEL_PATH = Path(__file__).resolve().parents[3] / "models" / "best_delay_model.joblib"
DOCKER_MODEL_PATH = Path("/models/best_delay_model.joblib")

if DOCKER_MODEL_PATH.exists():
    MODEL_PATH = DOCKER_MODEL_PATH
else:
    MODEL_PATH = LOCAL_MODEL_PATH

model = joblib.load(MODEL_PATH)


@router.post("/predict", response_model=PredictionResponse)
def predict(
    request: PredictionRequest,
    current_user=Depends(get_current_user),
):
    data = pd.DataFrame([request.model_dump()])
    prediction = model.predict(data)[0]

    return PredictionResponse(
        predicted_delay_days=round(float(prediction), 2)
    )