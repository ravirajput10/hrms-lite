// Employee types
export interface Employee {
    _id: string;
    employee_id: string;
    full_name: string;
    email: string;
    department: string;
    created_at: string;
}

export interface EmployeeCreate {
    full_name: string;
    email: string;
    department: string;
}

export interface EmployeeList {
    employees: Employee[];
    count: number;
}

// Attendance types
export type AttendanceStatus = 'Present' | 'Absent';

export interface Attendance {
    _id: string;
    employee_id: string;
    employee_name?: string;
    date: string;
    status: AttendanceStatus;
    created_at: string;
}

export interface AttendanceCreate {
    employee_id: string;
    date: string;
    status: AttendanceStatus;
}

export interface AttendanceList {
    records: Attendance[];
    count: number;
}

export interface AttendanceSummary {
    employee_id: string;
    employee_name: string;
    total_present: number;
    total_absent: number;
}

// API Error
export interface ApiError {
    detail: string;
}
