import axios from 'axios';
import type {
    Employee,
    EmployeeCreate,
    EmployeeList,
    Attendance,
    AttendanceCreate,
    AttendanceList,
    AttendanceSummary
} from '../types';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Employee API
export const employeeApi = {
    getAll: async (): Promise<EmployeeList> => {
        const response = await api.get<EmployeeList>('/employees');
        return response.data;
    },

    getById: async (employeeId: string): Promise<Employee> => {
        const response = await api.get<Employee>(`/employees/${employeeId}`);
        return response.data;
    },

    create: async (employee: EmployeeCreate): Promise<Employee> => {
        const response = await api.post<Employee>('/employees', employee);
        return response.data;
    },

    delete: async (employeeId: string): Promise<void> => {
        await api.delete(`/employees/${employeeId}`);
    },
};

// Attendance API
export const attendanceApi = {
    getAll: async (filters?: { employee_id?: string; date?: string }): Promise<AttendanceList> => {
        const params = new URLSearchParams();
        if (filters?.employee_id) params.append('employee_id', filters.employee_id);
        if (filters?.date) params.append('date', filters.date);

        const response = await api.get<AttendanceList>(`/attendance?${params.toString()}`);
        return response.data;
    },

    getByEmployee: async (employeeId: string): Promise<AttendanceList> => {
        const response = await api.get<AttendanceList>(`/attendance/employee/${employeeId}`);
        return response.data;
    },

    create: async (attendance: AttendanceCreate): Promise<Attendance> => {
        const response = await api.post<Attendance>('/attendance', attendance);
        return response.data;
    },

    getSummary: async (employeeId: string): Promise<AttendanceSummary> => {
        const response = await api.get<AttendanceSummary>(`/attendance/summary/${employeeId}`);
        return response.data;
    },
};

export default api;
