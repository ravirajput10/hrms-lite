from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime
from typing import List

from ..database import get_employees_collection
from ..models.employee import EmployeeCreate, EmployeeResponse, EmployeeList

router = APIRouter(prefix="/employees", tags=["Employees"])


def employee_helper(employee: dict) -> dict:
    """Convert MongoDB document to response format."""
    return {
        "_id": str(employee["_id"]),
        "employee_id": employee["employee_id"],
        "full_name": employee["full_name"],
        "email": employee["email"],
        "department": employee["department"],
        "created_at": employee["created_at"]
    }


@router.get("", response_model=EmployeeList)
async def get_all_employees():
    """Retrieve all employees."""
    collection = get_employees_collection()
    employees = []
    async for employee in collection.find():
        employees.append(employee_helper(employee))
    return {"employees": employees, "count": len(employees)}


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    """Create a new employee."""
    import random
    collection = get_employees_collection()
    
    # Auto-generate unique employee_id (6-digit random number)
    while True:
        employee_id = str(random.randint(100000, 999999))
        existing = await collection.find_one({"employee_id": employee_id})
        if not existing:
            break
    
    # Check for duplicate email
    existing_email = await collection.find_one({"email": employee.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with email '{employee.email}' already exists"
        )

    
    # Create employee document
    employee_doc = {
        **employee.model_dump(),
        "employee_id": employee_id,
        "created_at": datetime.utcnow()
    }
    
    result = await collection.insert_one(employee_doc)
    created_employee = await collection.find_one({"_id": result.inserted_id})
    
    return employee_helper(created_employee)



@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str):
    """Get a specific employee by employee_id."""
    collection = get_employees_collection()
    employee = await collection.find_one({"employee_id": employee_id})
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    return employee_helper(employee)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    """Delete an employee."""
    collection = get_employees_collection()
    result = await collection.delete_one({"employee_id": employee_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    return None
