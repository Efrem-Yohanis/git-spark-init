import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AttendanceLog, LeaveRequest, AttendanceStatus, LeaveApprovalStatus } from '@/types/restaurant';
import { format } from 'date-fns';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ChefAttendanceSectionProps {
  attendanceLogs: AttendanceLog[];
  leaveRequests: LeaveRequest[];
}

const attendanceStatusColors: Record<AttendanceStatus, string> = {
  present: 'bg-status-success/20 text-status-success border-status-success/30',
  absent: 'bg-status-error/20 text-status-error border-status-error/30',
  late: 'bg-status-warning/20 text-status-warning border-status-warning/30',
  early_leave: 'bg-primary/20 text-primary border-primary/30',
};

const leaveApprovalColors: Record<LeaveApprovalStatus, string> = {
  pending: 'bg-status-warning/20 text-status-warning border-status-warning/30',
  approved: 'bg-status-success/20 text-status-success border-status-success/30',
  rejected: 'bg-status-error/20 text-status-error border-status-error/30',
};

const leaveTypeLabels: Record<string, string> = {
  sick: 'Sick Leave',
  annual: 'Annual Leave',
  emergency: 'Emergency Leave',
};

export const ChefAttendanceSection = ({ attendanceLogs, leaveRequests }: ChefAttendanceSectionProps) => {
  const [activeTab, setActiveTab] = useState('daily');

  // Calculate monthly stats
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyLogs = attendanceLogs.filter((log) => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === thisMonth && logDate.getFullYear() === thisYear;
  });

  const stats = {
    totalWorkingDays: 22,
    present: monthlyLogs.filter((l) => l.status === 'present').length,
    absent: monthlyLogs.filter((l) => l.status === 'absent').length,
    late: monthlyLogs.filter((l) => l.status === 'late').length,
    earlyLeave: monthlyLogs.filter((l) => l.status === 'early_leave').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Attendance Tracking</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily Log</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          {attendanceLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No attendance records</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Date</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceLogs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(new Date(log.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{log.timeIn ? format(new Date(log.timeIn), 'hh:mm a') : '-'}</TableCell>
                      <TableCell>{log.timeOut ? format(new Date(log.timeOut), 'hh:mm a') : '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={attendanceStatusColors[log.status]}>
                          {log.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          {leaveRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No leave requests</p>
          ) : (
            <div className="space-y-3">
              {leaveRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{leaveTypeLabels[request.leaveType]}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(request.startDate), 'MMM dd')} - {format(new Date(request.endDate), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                    </div>
                    <Badge variant="outline" className={leaveApprovalColors[request.approvalStatus]}>
                      {request.approvalStatus === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {request.approvalStatus === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {request.approvalStatus === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                      {request.approvalStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.totalWorkingDays}</p>
              <p className="text-sm text-muted-foreground">Working Days</p>
            </div>
            <div className="p-4 rounded-lg bg-status-success/10 text-center">
              <p className="text-2xl font-bold text-status-success">{stats.present}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
            <div className="p-4 rounded-lg bg-status-error/10 text-center">
              <p className="text-2xl font-bold text-status-error">{stats.absent}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
            <div className="p-4 rounded-lg bg-status-warning/10 text-center">
              <p className="text-2xl font-bold text-status-warning">{stats.late}</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 text-center">
              <p className="text-2xl font-bold text-primary">{stats.earlyLeave}</p>
              <p className="text-sm text-muted-foreground">Early Leave</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
