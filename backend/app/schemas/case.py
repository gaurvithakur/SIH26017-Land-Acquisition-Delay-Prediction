from pydantic import BaseModel, ConfigDict


class CaseBase(BaseModel):
    case_id: str
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


class CaseCreate(CaseBase):
    predicted_delay_days: float | None = None


class CaseUpdate(BaseModel):
    state: str | None = None
    district: str | None = None
    project_type: str | None = None
    land_area_acres: float | None = None
    number_of_landowners: int | None = None
    acquisition_stage: str | None = None
    number_of_objections: int | None = None
    number_of_court_cases: int | None = None
    compensation_completed_pct: float | None = None
    pending_approvals: int | None = None
    days_in_current_stage: int | None = None
    sanction_amount_lakh: float | None = None
    land_acquisition_agency: str | None = None
    environmental_clearance: str | None = None
    forest_clearance: str | None = None
    relocation_required: str | None = None
    structures_affected: int | None = None
    dispute_severity: str | None = None
    payment_status: str | None = None
    document_verification_status: str | None = None
    project_length_km: float | None = None
    last_review_days_ago: int | None = None
    predicted_delay_days: float | None = None


class CaseResponse(CaseBase):
    id: int
    predicted_delay_days: float | None = None

    model_config = ConfigDict(from_attributes=True)