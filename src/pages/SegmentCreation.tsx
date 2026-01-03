import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Play, Calendar, HelpCircle, Sparkles, Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FilterState {
  lastActivity: string;
  transactionCountMin: string;
  transactionCountMax: string;
  transactionValueMin: string;
  transactionValueMax: string;
  rewardReceived: string;
  churnRisk: string;
  region: string;
  city: string;
  gender: string;
  ageGroup: string;
  kycLevel: string;
  deviceType: string;
  valueTier: string;
}

const initialFilters: FilterState = {
  lastActivity: "",
  transactionCountMin: "",
  transactionCountMax: "",
  transactionValueMin: "",
  transactionValueMax: "",
  rewardReceived: "",
  churnRisk: "",
  region: "",
  city: "",
  gender: "",
  ageGroup: "",
  kycLevel: "",
  deviceType: "",
  valueTier: "",
};

const sampleMSISDNs = [
  { msisdn: "2519****1234", regDate: "2023-06-15", lastActivity: "2024-01-14", txnCount: 45, txnValue: 12500, valueTier: "High" },
  { msisdn: "2519****5678", regDate: "2023-08-22", lastActivity: "2024-01-13", txnCount: 32, txnValue: 8900, valueTier: "Medium" },
  { msisdn: "2519****9012", regDate: "2023-03-10", lastActivity: "2024-01-15", txnCount: 67, txnValue: 25600, valueTier: "High" },
  { msisdn: "2519****3456", regDate: "2023-11-05", lastActivity: "2024-01-12", txnCount: 12, txnValue: 3200, valueTier: "Low" },
  { msisdn: "2519****7890", regDate: "2023-07-18", lastActivity: "2024-01-14", txnCount: 28, txnValue: 7500, valueTier: "Medium" },
];

export default function SegmentCreation() {
  const navigate = useNavigate();
  const [segmentName, setSegmentName] = useState("");
  const [segmentType, setSegmentType] = useState("");
  const [description, setDescription] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("daily");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [ruleLogic, setRuleLogic] = useState<"AND" | "OR">("AND");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);

  // Mock preview data based on filters
  const estimatedCount = 125000;
  const percentOfBase = 8.5;
  const activeRate = 78;
  const newRegistrations = 12500;
  const highValuePercent = 35;

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildRuleSummary = () => {
    const rules: string[] = [];
    if (filters.lastActivity) rules.push(`Active in last ${filters.lastActivity} days`);
    if (filters.transactionValueMin) rules.push(`TXN value ≥ ${filters.transactionValueMin} ETB`);
    if (filters.transactionValueMax) rules.push(`TXN value ≤ ${filters.transactionValueMax} ETB`);
    if (filters.region) rules.push(`Location = ${filters.region}`);
    if (filters.valueTier) rules.push(`Value Tier = ${filters.valueTier}`);
    if (filters.churnRisk) rules.push(`Churn Risk = ${filters.churnRisk}`);
    if (filters.gender) rules.push(`Gender = ${filters.gender}`);
    if (filters.ageGroup) rules.push(`Age Group = ${filters.ageGroup}`);
    
    return rules.length > 0 ? rules.join(` ${ruleLogic} `) : "No filters applied";
  };

  const handleSaveDraft = () => {
    console.log("Saving draft...");
    navigate("/segmentation");
  };

  const handleSaveAndActivate = () => {
    setShowConfirmModal(true);
  };

  const confirmActivation = () => {
    console.log("Activating segment...");
    setShowConfirmModal(false);
    navigate("/segmentation");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/segmentation")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Segment</h1>
            <p className="text-muted-foreground">Define segment rules and preview customers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button variant="outline" onClick={() => navigate("/segmentation")}>
            Cancel
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Need help? Check documentation</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Segment Name & Type */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="segmentName">Segment Name *</Label>
              <Input
                id="segmentName"
                placeholder="Enter segment name"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Segment Type *</Label>
              <Select value={segmentType} onValueChange={setSegmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="dormant">Dormant</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="value">Value-based</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe this segment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="autoRefresh"
                checked={autoRefresh}
                onCheckedChange={(checked) => setAutoRefresh(checked as boolean)}
              />
              <Label htmlFor="autoRefresh">Auto Refresh</Label>
            </div>
            {autoRefresh && (
              <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Define Segment Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Define Segment Filters</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rule Logic:</span>
            <Select value={ruleLogic} onValueChange={(v) => setRuleLogic(v as "AND" | "OR")}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">AND</SelectItem>
                <SelectItem value="OR">OR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Behavioral Filters */}
          <div>
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Behavioral Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Last Activity</Label>
                <Select value={filters.lastActivity} onValueChange={(v) => updateFilter("lastActivity", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="14">Last 14 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="60">Last 60 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transaction Count (Min)</Label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.transactionCountMin}
                  onChange={(e) => updateFilter("transactionCountMin", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Transaction Count (Max)</Label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.transactionCountMax}
                  onChange={(e) => updateFilter("transactionCountMax", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Transaction Value Min (ETB)</Label>
                <Input
                  type="number"
                  placeholder="Min value"
                  value={filters.transactionValueMin}
                  onChange={(e) => updateFilter("transactionValueMin", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Transaction Value Max (ETB)</Label>
                <Input
                  type="number"
                  placeholder="Max value"
                  value={filters.transactionValueMax}
                  onChange={(e) => updateFilter("transactionValueMax", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Reward Received</Label>
                <Select value={filters.rewardReceived} onValueChange={(v) => updateFilter("rewardReceived", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Churn Risk</Label>
                <Select value={filters.churnRisk} onValueChange={(v) => updateFilter("churnRisk", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Demographic Filters */}
          <div>
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Demographic / Profile Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={filters.region} onValueChange={(v) => updateFilter("region", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                    <SelectItem value="oromia">Oromia</SelectItem>
                    <SelectItem value="amhara">Amhara</SelectItem>
                    <SelectItem value="tigray">Tigray</SelectItem>
                    <SelectItem value="snnpr">SNNPR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addis">Addis Ababa City</SelectItem>
                    <SelectItem value="dire-dawa">Dire Dawa</SelectItem>
                    <SelectItem value="mekelle">Mekelle</SelectItem>
                    <SelectItem value="gondar">Gondar</SelectItem>
                    <SelectItem value="hawassa">Hawassa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={filters.gender} onValueChange={(v) => updateFilter("gender", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Age Group</Label>
                <Select value={filters.ageGroup} onValueChange={(v) => updateFilter("ageGroup", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18–24</SelectItem>
                    <SelectItem value="25-34">25–34</SelectItem>
                    <SelectItem value="35-44">35–44</SelectItem>
                    <SelectItem value="45+">45+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>KYC Level</Label>
                <Select value={filters.kycLevel} onValueChange={(v) => updateFilter("kycLevel", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select KYC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="semi">Semi-verified</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Device Type</Label>
                <Select value={filters.deviceType} onValueChange={(v) => updateFilter("deviceType", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature Phone</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Value Segmentation */}
          <div>
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Value Segmentation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Value Tier</Label>
                <Select value={filters.valueTier} onValueChange={(v) => updateFilter("valueTier", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Value</SelectItem>
                    <SelectItem value="medium">Medium Value</SelectItem>
                    <SelectItem value="low">Low Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Rule Summary */}
          <div className="p-4 bg-muted border">
            <h4 className="font-semibold mb-2 text-sm">Rule Summary</h4>
            <p className="text-sm text-muted-foreground">{buildRuleSummary()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Segment Preview Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Segment Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-muted border">
              <p className="text-sm text-muted-foreground">Estimated Count</p>
              <p className="text-2xl font-bold">{estimatedCount.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-muted border">
              <p className="text-sm text-muted-foreground">% of Total Base</p>
              <p className="text-2xl font-bold">{percentOfBase}%</p>
            </div>
            <div className="p-4 bg-muted border">
              <p className="text-sm text-muted-foreground">Active Rate</p>
              <p className="text-2xl font-bold text-success">{activeRate}%</p>
            </div>
            <div className="p-4 bg-muted border">
              <p className="text-sm text-muted-foreground">New Registrations</p>
              <p className="text-2xl font-bold">{newRegistrations.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-muted border">
              <p className="text-sm text-muted-foreground">High Value %</p>
              <p className="text-2xl font-bold text-info">{highValuePercent}%</p>
            </div>
          </div>

          {/* MSISDN Preview Table */}
          <div>
            <h4 className="font-semibold mb-2 text-sm">MSISDN Preview (First 50 rows)</h4>
            <div className="border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>MSISDN</TableHead>
                    <TableHead>Reg Date</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">TXN Count</TableHead>
                    <TableHead className="text-right">TXN Value (ETB)</TableHead>
                    <TableHead>Value Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleMSISDNs.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono">{row.msisdn}</TableCell>
                      <TableCell>{row.regDate}</TableCell>
                      <TableCell>{row.lastActivity}</TableCell>
                      <TableCell className="text-right">{row.txnCount}</TableCell>
                      <TableCell className="text-right">{row.txnValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium",
                            row.valueTier === "High" && "bg-success/10 text-success border-success/20",
                            row.valueTier === "Medium" && "bg-info/10 text-info border-info/20",
                            row.valueTier === "Low" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {row.valueTier}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendation Panel */}
      {showAIPanel && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Recommendation
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowAIPanel(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Based on your segment filters, we suggest adding <strong>churn risk = medium</strong> to capture 
              users who are likely to become inactive soon. This could increase campaign effectiveness by 15%.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Expected Uplift</p>
                <p className="font-bold text-primary">+15%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Suggested Campaign</p>
                <p className="font-bold">Win-back</p>
              </div>
              <div>
                <p className="text-muted-foreground">Best Channel</p>
                <p className="font-bold">SMS + App Push</p>
              </div>
              <div>
                <p className="text-muted-foreground">Suggested Reward</p>
                <p className="font-bold">50 ETB Cashback</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="gap-2">
                <Check className="w-4 h-4" />
                Apply Suggestion
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAIPanel(false)}>
                Ignore
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save / Activate Section */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => navigate("/segmentation")}>
          Cancel
        </Button>
        <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
          <Save className="w-4 h-4" />
          Save Draft
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Schedule Refresh
        </Button>
        <Button onClick={handleSaveAndActivate} className="gap-2">
          <Play className="w-4 h-4" />
          Save & Activate
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Segment Activation</DialogTitle>
            <DialogDescription>
              Please review the segment details before activation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Segment Name</p>
                <p className="font-medium">{segmentName || "Unnamed Segment"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{segmentType || "Not specified"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Customers</p>
                <p className="font-medium">{estimatedCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Auto Refresh</p>
                <p className="font-medium">{autoRefresh ? `Yes (${refreshInterval})` : "No"}</p>
              </div>
            </div>
            <div className="p-3 bg-muted border">
              <p className="text-sm font-medium mb-1">Applied Rules:</p>
              <p className="text-sm text-muted-foreground">{buildRuleSummary()}</p>
            </div>
            {estimatedCount > 1000000 && (
              <div className="p-3 bg-warning/10 border border-warning/30 text-warning">
                <p className="text-sm font-medium">⚠️ Large Segment Warning</p>
                <p className="text-sm">This segment contains more than 1 million users.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmActivation}>
              Confirm & Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
