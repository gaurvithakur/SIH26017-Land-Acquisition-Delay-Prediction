from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.db.models import Case
from app.schemas.case import CaseCreate, CaseResponse, CaseUpdate

router = APIRouter(prefix="/api/cases", tags=["Cases"])


@router.post("/", response_model=CaseResponse)
def create_case(
    case_data: CaseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing_case = db.query(Case).filter(
        Case.case_id == case_data.case_id
    ).first()

    if existing_case:
        raise HTTPException(
            status_code=400,
            detail="Case ID already exists",
        )

    case = Case(**case_data.model_dump())
    db.add(case)
    db.commit()
    db.refresh(case)

    return case


@router.get("/", response_model=list[CaseResponse])
def get_cases(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Case).order_by(Case.id.desc()).all()


@router.get("/{case_id}", response_model=CaseResponse)
def get_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = db.query(Case).filter(
        Case.case_id == case_id
    ).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found",
        )

    return case


@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: str,
    case_data: CaseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = db.query(Case).filter(
        Case.case_id == case_id
    ).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found",
        )

    update_data = case_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(case, field, value)

    db.commit()
    db.refresh(case)

    return case


@router.delete("/{case_id}")
def delete_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    case = db.query(Case).filter(
        Case.case_id == case_id
    ).first()

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found",
        )

    db.delete(case)
    db.commit()

    return {
        "message": "Case deleted successfully",
        "case_id": case_id,
    }