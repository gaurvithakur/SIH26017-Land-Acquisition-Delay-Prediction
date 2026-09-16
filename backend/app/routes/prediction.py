from pathlib import Path

import joblib
import pandas as pd
from fastapi import APIRouter

from app.schemas.prediction import PredictionRequest, PredictionResponse


router = APIRouter(prefix="/api", tags=["Prediction"])


# Find project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]

MODEL_PATH = PROJECT_ROOT / "models" / "best_delay_model.joblib"

model = joblib.load(MODEL_PATH)


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    data = pd.DataFrame([request.model_dump()])

    prediction = model.predict(data)[0]

    return PredictionResponse(
        predicted_delay_days=round(float(prediction), 2)
    )