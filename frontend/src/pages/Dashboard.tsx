import { Users, CalendarCheck, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useEmployees } from '../hooks/useEmployees';
import { useAttendance } from '../hooks/useAttendance';

export function Dashboard() {
    const { data: employeesData, isLoading: loadingEmployees } = useEmployees();
    const { data: attendanceData, isLoading: loadingAttendance } = useAttendance();

    // Calculate today's attendance stats
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendanceData?.records.filter(r => r.date === today) || [];
    const presentToday = todayAttendance.filter(r => r.status === 'Present').length;
    const absentToday = todayAttendance.filter(r => r.status === 'Absent').length;

    const stats = [
        {
            title: 'Total Employees',
            value: employeesData?.count || 0,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Present Today',
            value: presentToday,
            icon: UserCheck,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Absent Today',
            value: absentToday,
            icon: UserX,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50',
        },
        {
            title: 'Attendance Records',
            value: attendanceData?.count || 0,
            icon: CalendarCheck,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    const isLoading = loadingEmployees || loadingAttendance;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here's an overview of your HRMS.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`h-5 w-5 bg-gradient-to-r ${stat.color} [background-clip:text] [-webkit-background-clip:text] text-transparent`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('green') ? '#22c55e' : stat.color.includes('red') ? '#ef4444' : '#a855f7' }} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                )}
                            </CardContent>
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">Recent Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 bg-slate-100 animate-pulse rounded"></div>
                            ))}
                        </div>
                    ) : attendanceData?.records.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <CalendarCheck className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                            <p>No attendance records yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {attendanceData?.records.slice(0, 5).map((record) => (
                                <div
                                    key={record._id}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">{record.employee_name || record.employee_id}</p>
                                        <p className="text-sm text-slate-500">{new Date(record.date).toLocaleDateString()}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${record.status === 'Present'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {record.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
