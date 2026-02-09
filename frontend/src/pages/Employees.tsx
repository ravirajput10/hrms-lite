import { useState } from 'react';
import { Plus, Trash2, Mail, Building2, User, AlertCircle, BarChart3 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import { Alert, AlertDescription } from '../components/ui/alert';

import { useEmployees, useCreateEmployee, useDeleteEmployee } from '../hooks/useEmployees';
import { useAttendanceSummary } from '../hooks/useAttendance';
import type { Employee } from '../types';

// Form validation schema
const employeeSchema = z.object({
    employee_id: z.string().min(1, 'Employee ID is required').max(50),
    full_name: z.string().min(1, 'Full name is required').max(100),
    email: z.string().email('Invalid email address'),
    department: z.string().min(1, 'Department is required').max(50),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export function Employees() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    const { data, isLoading, error } = useEmployees();
    const createMutation = useCreateEmployee();
    const deleteMutation = useDeleteEmployee();

    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            employee_id: '',
            full_name: '',
            email: '',
            department: '',
        },
    });

    const onSubmit = async (formData: EmployeeFormData) => {
        try {
            await createMutation.mutateAsync(formData);
            toast.success('Employee added successfully!');
            form.reset();
            setIsAddDialogOpen(false);
        } catch (err: any) {
            const message = err.response?.data?.detail || 'Failed to add employee';
            toast.error(message);
        }
    };

    const handleDelete = async () => {
        if (!deleteEmployee) return;
        try {
            await deleteMutation.mutateAsync(deleteEmployee.employee_id);
            toast.success('Employee deleted successfully!');
            setDeleteEmployee(null);
        } catch (err: any) {
            const message = err.response?.data?.detail || 'Failed to delete employee';
            toast.error(message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
                    <p className="text-slate-500 mt-1">Manage your organization's employees</p>
                </div>

                {/* Add Employee Dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                            <DialogDescription>
                                Fill in the details to add a new employee to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Employee ID</Label>
                                <Input
                                    id="employee_id"
                                    placeholder="EMP001"
                                    {...form.register('employee_id')}
                                />
                                {form.formState.errors.employee_id && (
                                    <p className="text-sm text-red-500">{form.formState.errors.employee_id.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    placeholder="John Doe"
                                    {...form.register('full_name')}
                                />
                                {form.formState.errors.full_name && (
                                    <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@company.com"
                                    {...form.register('email')}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    placeholder="Engineering"
                                    {...form.register('department')}
                                />
                                {form.formState.errors.department && (
                                    <p className="text-sm text-red-500">{form.formState.errors.department.message}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? 'Adding...' : 'Add Employee'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Error State */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load employees. Please try again later.
                    </AlertDescription>
                </Alert>
            )}

            {/* Employee Table */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">
                        All Employees {data?.count !== undefined && `(${data.count})`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-14 bg-slate-100 animate-pulse rounded"></div>
                            ))}
                        </div>
                    ) : data?.employees.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <User className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No employees yet</h3>
                            <p className="mb-4">Get started by adding your first employee.</p>
                            <Button onClick={() => setIsAddDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Employee
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.employees.map((employee) => (
                                    <TableRow key={employee._id}>
                                        <TableCell className="font-medium">{employee.employee_id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                                    {employee.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                {employee.full_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Mail className="h-4 w-4" />
                                                {employee.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-slate-400" />
                                                {employee.department}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => setSelectedEmployeeId(employee.employee_id)}
                                                    title="View Attendance Summary"
                                                >
                                                    <BarChart3 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setDeleteEmployee(employee)}
                                                    title="Delete Employee"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteEmployee} onOpenChange={() => setDeleteEmployee(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{deleteEmployee?.full_name}</strong>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteEmployee(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Attendance Summary Dialog */}
            <AttendanceSummaryDialog
                employeeId={selectedEmployeeId}
                onClose={() => setSelectedEmployeeId(null)}
            />
        </div>
    );
}

function AttendanceSummaryDialog({ employeeId, onClose }: { employeeId: string | null; onClose: () => void }) {
    const { data: summary, isLoading } = useAttendanceSummary(employeeId || '');

    const totalDays = summary ? summary.total_present + summary.total_absent : 0;
    const attendancePercentage = totalDays > 0
        ? Math.round((summary!.total_present / totalDays) * 100)
        : 0;

    return (
        <Dialog open={!!employeeId} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Attendance Summary</DialogTitle>
                    <DialogDescription>
                        Overview for {summary?.employee_name || 'Employee'}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    </div>
                ) : summary ? (
                    <div className="py-4 space-y-6">
                        <div className="flex justify-center">
                            <div className="relative h-32 w-32 flex items-center justify-center">
                                <svg className="h-full w-full" viewBox="0 0 36 36">
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        className="stroke-slate-100"
                                        strokeWidth="3.5"
                                    />
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="16"
                                        fill="none"
                                        className="stroke-blue-600"
                                        strokeWidth="3.5"
                                        strokeDasharray={`${attendancePercentage}, 100`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 18 18)"
                                    />
                                </svg>
                                <div className="absolute text-center">
                                    <span className="text-2xl font-bold text-slate-900">{attendancePercentage}%</span>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Present</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                <p className="text-sm text-green-600 font-medium">Present</p>
                                <p className="text-2xl font-bold text-green-700">{summary.total_present}</p>
                                <p className="text-xs text-green-500">Days</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                <p className="text-sm text-red-600 font-medium">Absent</p>
                                <p className="text-2xl font-bold text-red-700">{summary.total_absent}</p>
                                <p className="text-xs text-red-500">Days</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-slate-500">
                        No summary data available.
                    </div>
                )}

                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
