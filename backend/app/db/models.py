from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    case_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    state: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    project_type: Mapped[str] = mapped_column(String(100), nullable=False)

    land_area_acres: Mapped[float] = mapped_column(Float, nullable=False)
    number_of_landowners: Mapped[int] = mapped_column(Integer, nullable=False)

    acquisition_stage: Mapped[str] = mapped_column(String(100), nullable=False)
    number_of_objections: Mapped[int] = mapped_column(Integer, nullable=False)
    number_of_court_cases: Mapped[int] = mapped_column(Integer, nullable=False)

    compensation_completed_pct: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    pending_approvals: Mapped[int] = mapped_column(Integer, nullable=False)
    days_in_current_stage: Mapped[int] = mapped_column(Integer, nullable=False)

    sanction_amount_lakh: Mapped[float] = mapped_column(Float, nullable=False)

    land_acquisition_agency: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    environmental_clearance: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    forest_clearance: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    relocation_required: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    structures_affected: Mapped[int] = mapped_column(Integer, nullable=False)

    dispute_severity: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    payment_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    document_verification_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    project_length_km: Mapped[float] = mapped_column(Float, nullable=False)

    last_review_days_ago: Mapped[int] = mapped_column(Integer, nullable=False)

    predicted_delay_days: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )