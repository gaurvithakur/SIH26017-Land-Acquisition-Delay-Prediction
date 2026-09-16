from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.prediction import router as prediction_router


app = FastAPI(
    title="LANDPREDICT API",
    description="Backend API for Land Acquisition Delay Prediction",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "LANDPREDICT Backend is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


app.include_router(prediction_router)