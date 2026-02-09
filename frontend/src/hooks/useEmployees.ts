import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../services/api';
import type { EmployeeCreate } from '../types';

export function useEmployees() {
    return useQuery({
        queryKey: ['employees'],
        queryFn: employeeApi.getAll,
    });
}

export function useEmployee(employeeId: string) {
    return useQuery({
        queryKey: ['employee', employeeId],
        queryFn: () => employeeApi.getById(employeeId),
        enabled: !!employeeId,
    });
}

export function useCreateEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (employee: EmployeeCreate) => employeeApi.create(employee),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
}

export function useDeleteEmployee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (employeeId: string) => employeeApi.delete(employeeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
}
