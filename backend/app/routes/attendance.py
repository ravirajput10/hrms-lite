from fastapi import APIRouter, HTTPException, status, Query
from datetime import datetime, date
from typing import Optional

from ..database import get_attendance_collection, get_employees_collection
from ..models.attendance import AttendanceCreate, AttendanceResponse, AttendanceList, AttendanceSummary

router = APIRouter(prefix="/attendance", tags=["Attendance"])


def attendance_helper(record: dict, employee_name: str = None) -> dict:
    """Convert MongoDB document to response format."""
    return {
        "_id": str(record["_id"]),
        "employee_id": record["employee_id"],
        "employee_name": employee_name,
        "date": record["date"],
        "status": record["status"],
        "created_at": record["created_at"]
    }


@router.get("", response_model=AttendanceList)
async def get_attendance(
    employee_id: Optional[str] = Query(None, description="Filter by employee ID"),
    date_filter: Optional[date] = Query(None, alias="date", description="Filter by date")
):
    """Retrieve attendance records with optional filters."""
    attendance_collection = get_attendance_collection()
    employees_collection = get_employees_collection()
    
    # Build query filter
    query = {}
    if employee_id:
        query["employee_id"] = employee_id
    if date_filter:
        query["date"] = date_filter.isoformat()
    
    # Get employee names for lookup
    employees = {}
    async for emp in employees_collection.find():
        employees[emp["employee_id"]] = emp["full_name"]
    
    records = []
    async for record in attendance_collection.find(query).sort("date", -1):
        emp_name = employees.get(record["employee_id"])
        records.append(attendance_helper(record, emp_name))
    
    return {"records": records, "count": len(records)}


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate):
    """Mark attendance for an employee."""
    attendance_collection = get_attendance_collection()
    employees_collection = get_employees_collection()
    
    # Verify employee exists
    employee = await employees_collection.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found"
        )
    
    # Check for duplicate attendance on same date
    existing = await attendance_collection.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance.date.isoformat()
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance already marked for employee '{attendance.employee_id}' on {attendance.date}"
        )
    
    # Create attendance record
    attendance_doc = {
        "employee_id": attendance.employee_id,
        "date": attendance.date.isoformat(),
        "status": attendance.status,
        "created_at": datetime.utcnow()
    }
    
    result = await attendance_collection.insert_one(attendance_doc)
    created_record = await attendance_collection.find_one({"_id": result.inserted_id})
    
    return attendance_helper(created_record, employee["full_name"])


@router.get("/employee/{employee_id}", response_model=AttendanceList)
async def get_employee_attendance(employee_id: str):
    """Get all attendance records for a specific employee."""
    attendance_collection = get_attendance_collection()
    employees_collection = get_employees_collection()
    
    # Verify employee exists
    employee = await employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    records = []
    async for record in attendance_collection.find({"employee_id": employee_id}).sort("date", -1):
        records.append(attendance_helper(record, employee["full_name"]))
    
    return {"records": records, "count": len(records)}


@router.get("/summary/{employee_id}", response_model=AttendanceSummary)
async def get_attendance_summary(employee_id: str):
    """Get attendance summary for a specific employee."""
    attendance_collection = get_attendance_collection()
    employees_collection = get_employees_collection()
    
    # Verify employee exists
    employee = await employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    # Count present and absent
    present_count = await attendance_collection.count_documents({
        "employee_id": employee_id,
        "status": "Present"
    })
    absent_count = await attendance_collection.count_documents({
        "employee_id": employee_id,
        "status": "Absent"
    })
    
    return {
        "employee_id": employee_id,
        "employee_name": employee["full_name"],
        "total_present": present_count,
        "total_absent": absent_count
    }
