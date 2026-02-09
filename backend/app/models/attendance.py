from pydantic import BaseModel, Field
from typing import List, Literal
from datetime import date, datetime


class AttendanceCreate(BaseModel):
    """Schema for marking attendance."""
    employee_id: str = Field(..., min_length=1, description="Employee ID")
    date: date = Field(..., description="Attendance date")
    status: Literal["Present", "Absent"] = Field(..., description="Attendance status")

    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "EMP001",
                "date": "2024-01-15",
                "status": "Present"
            }
        }


class AttendanceResponse(BaseModel):
    """Schema for attendance response."""
    id: str = Field(..., alias="_id")
    employee_id: str
    employee_name: str | None = None
    date: date
    status: str
    created_at: datetime

    class Config:
        populate_by_name = True


class AttendanceList(BaseModel):
    """Schema for list of attendance records."""
    records: List[AttendanceResponse]
    count: int


class AttendanceSummary(BaseModel):
    """Schema for attendance summary per employee."""
    employee_id: str
    employee_name: str
    total_present: int
    total_absent: int
