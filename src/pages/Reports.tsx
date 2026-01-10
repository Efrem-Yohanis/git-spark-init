import { useNavigate } from "react-router-dom";
import { Download, Calendar, BarChart, FileText, Clock, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const recentReports = [
  {
    id: 1,
    name: "Campaign Performance - January 2024",
    type: "Campaign",
    generatedAt: "2024-01-15 09:00",
    format: "Excel",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Customer Segmentation Analysis",
    type: "Segmentation",
    generatedAt: "2024-01-14 14:30",
    format: "PDF",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Weekly Transaction Summary",
    type: "Transaction",
    generatedAt: "2024-01-14 08:00",
    format: "Excel",
    size: "5.2 MB",
  },
  {
    id: 4,
    name: "Churn Risk Report",
    type: "AI Insight",
    generatedAt: "2024-01-13 16:00",
    format: "PDF",
    size: "890 KB",
  },
];

const scheduledReports = [
  {
    id: 1,
    name: "Daily Transaction Summary",
    frequency: "Daily",
    nextRun: "2024-01-16 06:00",
    recipients: ["team@mpesa.co.ke"],
  },
  {
    id: 2,
    name: "Weekly Campaign Performance",
    frequency: "Weekly",
    nextRun: "2024-01-22 09:00",
    recipients: ["marketing@mpesa.co.ke", "ops@mpesa.co.ke"],
  },
  {
    id: 3,
    name: "Monthly Executive Summary",
    frequency: "Monthly",
    nextRun: "2024-02-01 08:00",
    recipients: ["executive@mpesa.co.ke"],
  },
];

export default function Reports() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and manage engagement reports</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/reports/create")}>
          <FileText className="w-4 h-4" />
          Create Report
        </Button>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Campaign Report</p>
                <p className="text-sm text-muted-foreground">Performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-info/10">
                <FileText className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="font-semibold">Segment Analysis</p>
                <p className="text-sm text-muted-foreground">Customer insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Calendar className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="font-semibold">Transaction Report</p>
                <p className="text-sm text-muted-foreground">Activity summary</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="font-semibold">Scheduled Reports</p>
                <p className="text-sm text-muted-foreground">Manage automation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="segment">Segmentation</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                      <FileText className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{report.type}</Badge>
                        <span className="text-xs text-muted-foreground">{report.generatedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{report.format}</p>
                      <p className="text-xs text-muted-foreground">{report.size}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Scheduled Reports</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Clock className="w-4 h-4" />
              Add Schedule
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{report.frequency}</Badge>
                        <span className="text-xs text-muted-foreground">Next: {report.nextRun}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {report.recipients.join(", ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
