from pydantic import BaseModel


class PredictionRequest(BaseModel):
    state: str
    district: str
    project_type: str
    land_area_acres: float
    number_of_landowners: int
    acquisition_stage: str
    number_of_objections: int
    number_of_court_cases: int
    compensation_completed_pct: float
    pending_approvals: int
    days_in_current_stage: int
    sanction_amount_lakh: float
    land_acquisition_agency: str
    environmental_clearance: str
    forest_clearance: str
    relocation_required: str
    structures_affected: int
    dispute_severity: str
    payment_status: str
    document_verification_status: str
    project_length_km: float
    last_review_days_ago: int


class PredictionResponse(BaseModel):
    predicted_delay_days: float