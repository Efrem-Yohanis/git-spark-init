import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, BarChart3, PieChart, TrendingUp, Calendar, Clock, Mail, Plus, X, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const reportTypes = [
  {
    id: "campaign",
    name: "Campaign Performance",
    description: "Analyze campaign metrics, conversions, and ROI",
    icon: BarChart3,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "segment",
    name: "Segment Analysis",
    description: "Customer segmentation insights and trends",
    icon: PieChart,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    id: "transaction",
    name: "Transaction Summary",
    description: "Transaction volumes, values, and patterns",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "custom",
    name: "Custom Report",
    description: "Build a custom report with selected metrics",
    icon: FileText,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

const availableMetrics = [
  { id: "total_customers", label: "Total Customers", category: "Audience" },
  { id: "active_customers", label: "Active Customers", category: "Audience" },
  { id: "new_registrations", label: "New Registrations", category: "Audience" },
  { id: "churn_rate", label: "Churn Rate", category: "Audience" },
  { id: "messages_sent", label: "Messages Sent", category: "Campaign" },
  { id: "delivery_rate", label: "Delivery Rate", category: "Campaign" },
  { id: "open_rate", label: "Open Rate", category: "Campaign" },
  { id: "conversion_rate", label: "Conversion Rate", category: "Campaign" },
  { id: "total_transactions", label: "Total Transactions", category: "Transaction" },
  { id: "transaction_value", label: "Transaction Value", category: "Transaction" },
  { id: "avg_transaction", label: "Avg Transaction Size", category: "Transaction" },
  { id: "rewards_distributed", label: "Rewards Distributed", category: "Rewards" },
  { id: "reward_redemption", label: "Redemption Rate", category: "Rewards" },
  { id: "total_reward_cost", label: "Total Reward Cost", category: "Rewards" },
];

const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_90_days", label: "Last 90 Days" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_quarter", label: "This Quarter" },
  { value: "custom", label: "Custom Range" },
];

export default function ReportCreate() {
  const navigate = useNavigate();
  const [reportName, setReportName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("last_30_days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [format, setFormat] = useState("pdf");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleAddRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients(prev => [...prev, newRecipient]);
      setNewRecipient("");
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(prev => prev.filter(r => r !== email));
  };

  const handleGenerateReport = () => {
    if (!reportName || !selectedType) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("Report generated successfully!");
    navigate("/reports");
  };

  const handlePreview = () => {
    toast.info("Generating preview...");
  };

  const groupedMetrics = availableMetrics.reduce((acc, metric) => {
    if (!acc[metric.category]) acc[metric.category] = [];
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, typeof availableMetrics>);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/reports")}
          className="rounded-none"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Report</h1>
          <p className="text-muted-foreground">Configure and generate a new report</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">Report Type</CardTitle>
              <CardDescription>Select the type of report you want to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${type.bgColor}`}>
                          <Icon className={`w-5 h-5 ${type.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{type.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name *</Label>
                <Input
                  id="reportName"
                  placeholder="e.g., Monthly Campaign Performance Report"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the report purpose..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-none min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {dateRangeOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setDateRange(option.value)}
                    className={`p-3 text-center border cursor-pointer transition-all ${
                      dateRange === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                ))}
              </div>
              {dateRange === "custom" && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="rounded-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="rounded-none"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metrics Selection */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">Select Metrics</CardTitle>
              <CardDescription>Choose the metrics to include in your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedMetrics).map(([category, metrics]) => (
                <div key={category}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">{category}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {metrics.map((metric) => {
                      const isSelected = selectedMetrics.includes(metric.id);
                      return (
                        <div
                          key={metric.id}
                          onClick={() => handleMetricToggle(metric.id)}
                          className={`p-3 border cursor-pointer transition-all flex items-center gap-2 ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Checkbox checked={isSelected} className="pointer-events-none" />
                          <span className="text-sm">{metric.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="rounded-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <CardTitle className="text-lg">Schedule Report</CardTitle>
                </div>
                <Switch
                  checked={scheduleEnabled}
                  onCheckedChange={setScheduleEnabled}
                />
              </div>
              <CardDescription>Automatically generate and send this report</CardDescription>
            </CardHeader>
            {scheduleEnabled && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <RadioGroup value={frequency} onValueChange={setFrequency} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily" className="font-normal">Daily</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly" className="font-normal">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="font-normal">Monthly</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Recipients
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddRecipient()}
                      className="rounded-none flex-1"
                    />
                    <Button onClick={handleAddRecipient} variant="outline" className="rounded-none">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {recipients.map((email) => (
                        <Badge key={email} variant="secondary" className="gap-1 py-1">
                          {email}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => handleRemoveRecipient(email)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Export Format */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">Export Format</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={format} onValueChange={setFormat} className="space-y-3">
                <div className={`flex items-center p-3 border cursor-pointer ${format === 'pdf' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="pdf" id="pdf" className="mr-3" />
                  <Label htmlFor="pdf" className="flex-1 cursor-pointer">
                    <span className="font-medium">PDF</span>
                    <p className="text-xs text-muted-foreground">Best for sharing and printing</p>
                  </Label>
                </div>
                <div className={`flex items-center p-3 border cursor-pointer ${format === 'excel' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="excel" id="excel" className="mr-3" />
                  <Label htmlFor="excel" className="flex-1 cursor-pointer">
                    <span className="font-medium">Excel</span>
                    <p className="text-xs text-muted-foreground">Best for data analysis</p>
                  </Label>
                </div>
                <div className={`flex items-center p-3 border cursor-pointer ${format === 'csv' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <RadioGroupItem value="csv" id="csv" className="mr-3" />
                  <Label htmlFor="csv" className="flex-1 cursor-pointer">
                    <span className="font-medium">CSV</span>
                    <p className="text-xs text-muted-foreground">Best for data import</p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="rounded-none bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Report Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">
                    {selectedType ? reportTypes.find(t => t.id === selectedType)?.name : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Range</span>
                  <span className="font-medium">
                    {dateRangeOptions.find(d => d.value === dateRange)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metrics</span>
                  <span className="font-medium">{selectedMetrics.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium uppercase">{format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-medium">{scheduleEnabled ? `Yes (${frequency})` : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleGenerateReport}
              className="w-full gap-2 rounded-none"
            >
              <Download className="w-4 h-4" />
              Generate Report
            </Button>
            <Button
              onClick={handlePreview}
              variant="outline"
              className="w-full gap-2 rounded-none"
            >
              <Eye className="w-4 h-4" />
              Preview Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
