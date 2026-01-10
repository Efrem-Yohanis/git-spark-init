import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Database, Play, Clock, Mail, Plus, X, Code, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock running campaigns
const runningCampaigns = [
  { id: "camp-1", name: "Holiday Cashback Promo", status: "Active", startDate: "2024-01-01", customers: 45000 },
  { id: "camp-2", name: "New Year Bonus Points", status: "Active", startDate: "2024-01-05", customers: 32000 },
  { id: "camp-3", name: "Weekend Special Rewards", status: "Active", startDate: "2024-01-10", customers: 28000 },
  { id: "camp-4", name: "Loyalty Tier Upgrade", status: "Active", startDate: "2024-01-08", customers: 15000 },
  { id: "camp-5", name: "Referral Bonus Campaign", status: "Active", startDate: "2024-01-12", customers: 22000 },
];

const exportFormats = [
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel (.xlsx)" },
  { value: "csv", label: "CSV" },
];

const filterFields = [
  { value: "registration_date", label: "Registration Date" },
  { value: "last_activity", label: "Last Activity" },
  { value: "transaction_count", label: "Transaction Count" },
  { value: "transaction_value", label: "Transaction Value" },
  { value: "value_tier", label: "Value Tier" },
  { value: "churn_risk", label: "Churn Risk" },
  { value: "region", label: "Region" },
  { value: "age_group", label: "Age Group" },
];

const operators = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "contains", label: "Contains" },
  { value: "in", label: "In" },
];

interface FilterCriteria {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export default function ReportCreate() {
  const navigate = useNavigate();
  const [reportSource, setReportSource] = useState<"campaign" | "custom">("campaign");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [customMode, setCustomMode] = useState<"sql" | "filter">("filter");
  const [filters, setFilters] = useState<FilterCriteria[]>([
    { id: "1", field: "", operator: "", value: "" }
  ]);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [reportName, setReportName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [frequency, setFrequency] = useState("weekly");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");

  const handleAddFilter = () => {
    setFilters(prev => [...prev, { id: Date.now().toString(), field: "", operator: "", value: "" }]);
  };

  const handleRemoveFilter = (id: string) => {
    if (filters.length > 1) {
      setFilters(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleFilterChange = (id: string, key: keyof FilterCriteria, value: string) => {
    setFilters(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
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
    if (!reportName) {
      toast.error("Please enter a report name");
      return;
    }
    if (reportSource === "campaign" && !selectedCampaign) {
      toast.error("Please select a campaign");
      return;
    }
    if (reportSource === "custom" && customMode === "sql" && !sqlQuery.trim()) {
      toast.error("Please enter SQL query");
      return;
    }
    toast.success("Report generated successfully!");
    navigate("/reports");
  };

  const selectedCampaignData = runningCampaigns.find(c => c.id === selectedCampaign);

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
          <p className="text-muted-foreground">Generate reports from campaigns or custom queries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Source Selection */}
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">Report Source</CardTitle>
              <CardDescription>Choose how to generate your report</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={reportSource} 
                onValueChange={(value: "campaign" | "custom") => setReportSource(value)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div
                  className={`p-4 border-2 cursor-pointer transition-all ${
                    reportSource === "campaign"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setReportSource("campaign")}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="campaign" id="campaign" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-primary" />
                        <Label htmlFor="campaign" className="font-semibold cursor-pointer">
                          Running Campaign
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Generate report from an active campaign's data
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 cursor-pointer transition-all ${
                    reportSource === "custom"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setReportSource("custom")}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="custom" id="custom" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-info" />
                        <Label htmlFor="custom" className="font-semibold cursor-pointer">
                          Custom Query
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Write SQL or use filter criteria for custom reports
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Campaign Selection */}
          {reportSource === "campaign" && (
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Select Campaign
                </CardTitle>
                <CardDescription>Choose from currently running campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Select a running campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {runningCampaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        <div className="flex items-center gap-3">
                          <span>{campaign.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {campaign.customers.toLocaleString()} customers
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCampaignData && (
                  <div className="mt-4 p-4 bg-muted/50 border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Campaign Name</p>
                        <p className="font-medium">{selectedCampaignData.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge className="bg-success/20 text-success border-0">
                          {selectedCampaignData.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium">{selectedCampaignData.startDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Target Customers</p>
                        <p className="font-medium">{selectedCampaignData.customers.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Custom Query Options */}
          {reportSource === "custom" && (
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Custom Query
                </CardTitle>
                <CardDescription>Write SQL or create filter criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={customMode} onValueChange={(v) => setCustomMode(v as "sql" | "filter")}>
                  <TabsList className="grid w-full grid-cols-2 rounded-none">
                    <TabsTrigger value="filter" className="rounded-none flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter Criteria
                    </TabsTrigger>
                    <TabsTrigger value="sql" className="rounded-none flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      SQL Query
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="filter" className="mt-4 space-y-4">
                    <div className="space-y-3">
                      {filters.map((filter, index) => (
                        <div key={filter.id} className="flex items-center gap-2">
                          {index > 0 && (
                            <Badge variant="outline" className="shrink-0">AND</Badge>
                          )}
                          <Select 
                            value={filter.field} 
                            onValueChange={(v) => handleFilterChange(filter.id, "field", v)}
                          >
                            <SelectTrigger className="rounded-none flex-1">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {filterFields.map(f => (
                                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select 
                            value={filter.operator} 
                            onValueChange={(v) => handleFilterChange(filter.id, "operator", v)}
                          >
                            <SelectTrigger className="rounded-none w-[140px]">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map(op => (
                                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Value"
                            value={filter.value}
                            onChange={(e) => handleFilterChange(filter.id, "value", e.target.value)}
                            className="rounded-none flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFilter(filter.id)}
                            disabled={filters.length === 1}
                            className="shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" onClick={handleAddFilter} className="rounded-none">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Filter
                    </Button>
                  </TabsContent>

                  <TabsContent value="sql" className="mt-4">
                    <div className="space-y-2">
                      <Label>SQL Query</Label>
                      <Textarea
                        placeholder="SELECT * FROM customers WHERE..."
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        className="rounded-none min-h-[200px] font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Write SQL to query the main customer database. Results will be included in the report.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Report Details */}
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

          {/* Schedule Report */}
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
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="rounded-none">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {exportFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-medium capitalize">{reportSource}</span>
                </div>
                {reportSource === "campaign" && selectedCampaignData && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign</span>
                    <span className="font-medium text-right max-w-[150px] truncate">
                      {selectedCampaignData.name}
                    </span>
                  </div>
                )}
                {reportSource === "custom" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Query Type</span>
                    <span className="font-medium capitalize">{customMode}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium uppercase">{exportFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-medium">
                    {scheduleEnabled ? `Yes (${frequency})` : "No"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  onClick={handleGenerateReport}
                  className="w-full rounded-none bg-gradient-to-r from-primary to-primary/80"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
