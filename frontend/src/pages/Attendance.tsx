import { useState } from 'react';
import { CalendarCheck, AlertCircle, Filter } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

import { useAttendance, useMarkAttendance } from '../hooks/useAttendance';
import { useEmployees } from '../hooks/useEmployees';

// Form validation schema
const attendanceSchema = z.object({
    employee_id: z.string().min(1, 'Please select an employee'),
    date: z.string().min(1, 'Date is required'),
    status: z.enum(['Present', 'Absent'], { message: 'Please select status' }),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export function Attendance() {
    const [isMarkDialogOpen, setIsMarkDialogOpen] = useState(false);
    const [filterEmployee, setFilterEmployee] = useState<string>('all');
    const [filterDate, setFilterDate] = useState<string>('');

    // Build filters
    const filters: { employee_id?: string; date?: string } = {};
    if (filterEmployee && filterEmployee !== 'all') filters.employee_id = filterEmployee;
    if (filterDate) filters.date = filterDate;

    const { data: attendanceData, isLoading, error } = useAttendance(filters);
    const { data: employeesData } = useEmployees();
    const markMutation = useMarkAttendance();

    const form = useForm<AttendanceFormData>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {
            employee_id: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            status: undefined,
        },
    });

    const onSubmit = async (formData: AttendanceFormData) => {
        try {
            await markMutation.mutateAsync(formData);
            toast.success('Attendance marked successfully!');
            form.reset({
                employee_id: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                status: undefined,
            });
            setIsMarkDialogOpen(false);
        } catch (err: any) {
            const message = err.response?.data?.detail || 'Failed to mark attendance';
            toast.error(message);
        }
    };

    const clearFilters = () => {
        setFilterEmployee('all');
        setFilterDate('');
    };

    const hasFilters = (filterEmployee && filterEmployee !== 'all') || filterDate;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
                    <p className="text-slate-500 mt-1">Track and manage employee attendance</p>
                </div>

                {/* Mark Attendance Dialog */}
                <Dialog open={isMarkDialogOpen} onOpenChange={setIsMarkDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                            <CalendarCheck className="h-4 w-4 mr-2" />
                            Mark Attendance
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Mark Attendance</DialogTitle>
                            <DialogDescription>
                                Record attendance for an employee.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Employee</Label>
                                <Controller
                                    name="employee_id"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select employee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employeesData?.employees.map((emp) => (
                                                    <SelectItem key={emp.employee_id} value={emp.employee_id}>
                                                        {emp.full_name} ({emp.employee_id})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.employee_id && (
                                    <p className="text-sm text-red-500">{form.formState.errors.employee_id.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    {...form.register('date')}
                                />
                                {form.formState.errors.date && (
                                    <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Controller
                                    name="status"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Present">Present</SelectItem>
                                                <SelectItem value="Absent">Absent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.status && (
                                    <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsMarkDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={markMutation.isPending}>
                                    {markMutation.isPending ? 'Marking...' : 'Mark Attendance'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Filter className="h-4 w-4" />
                            <span className="font-medium">Filters:</span>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Employee</Label>
                            <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="All employees" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Employees</SelectItem>
                                    {employeesData?.employees.map((emp) => (
                                        <SelectItem key={emp.employee_id} value={emp.employee_id}>
                                            {emp.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Date</Label>
                            <Input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-44"
                            />
                        </div>
                        {hasFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                Clear filters
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Error State */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load attendance records. Please try again later.
                    </AlertDescription>
                </Alert>
            )}

            {/* Attendance Table */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Attendance Records {attendanceData?.count !== undefined && `(${attendanceData.count})`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-14 bg-slate-100 animate-pulse rounded"></div>
                            ))}
                        </div>
                    ) : attendanceData?.records.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <CalendarCheck className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No attendance records</h3>
                            <p className="mb-4">
                                {hasFilters
                                    ? "No records match your filters. Try adjusting them."
                                    : "Start by marking attendance for your employees."
                                }
                            </p>
                            {!hasFilters && (
                                <Button onClick={() => setIsMarkDialogOpen(true)}>
                                    <CalendarCheck className="h-4 w-4 mr-2" />
                                    Mark Attendance
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceData?.records.map((record) => (
                                    <TableRow key={record._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
                                                    {(record.employee_name || record.employee_id).charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium">{record.employee_name || '-'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{record.employee_id}</TableCell>
                                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={record.status === 'Present' ? 'default' : 'destructive'}
                                                className={
                                                    record.status === 'Present'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                                                }
                                            >
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
