import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../services/api';
import type { AttendanceCreate } from '../types';

export function useAttendance(filters?: { employee_id?: string; date?: string }) {
    return useQuery({
        queryKey: ['attendance', filters],
        queryFn: () => attendanceApi.getAll(filters),
    });
}

export function useEmployeeAttendance(employeeId: string) {
    return useQuery({
        queryKey: ['attendance', 'employee', employeeId],
        queryFn: () => attendanceApi.getByEmployee(employeeId),
        enabled: !!employeeId,
    });
}

export function useAttendanceSummary(employeeId: string) {
    return useQuery({
        queryKey: ['attendance', 'summary', employeeId],
        queryFn: () => attendanceApi.getSummary(employeeId),
        enabled: !!employeeId,
    });
}

export function useMarkAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attendance: AttendanceCreate) => attendanceApi.create(attendance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        },
    });
}
