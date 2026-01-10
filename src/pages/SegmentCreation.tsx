import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, HelpCircle, Loader2 } from "lucide-react";
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
import { useCreateSegment } from "@/hooks/useSegments";
import type { SegmentCreateRequest, SegmentFilters } from "@/services/segmentApi";

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

export default function SegmentCreation() {
  const navigate = useNavigate();
  const [segmentName, setSegmentName] = useState("");
  const [description, setDescription] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("daily");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [ruleLogic, setRuleLogic] = useState<"AND" | "OR">("AND");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const createSegmentMutation = useCreateSegment();

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

  const buildApiPayload = (): SegmentCreateRequest => {
    const apiFilters: SegmentFilters = {
      behavioral: {
        lastActivityDays: filters.lastActivity ? parseInt(filters.lastActivity) : null,
        transactionCount: {
          min: filters.transactionCountMin ? parseInt(filters.transactionCountMin) : null,
          max: filters.transactionCountMax ? parseInt(filters.transactionCountMax) : null,
        },
        transactionValue: {
          min: filters.transactionValueMin ? parseInt(filters.transactionValueMin) : null,
          max: filters.transactionValueMax ? parseInt(filters.transactionValueMax) : null,
        },
        rewardReceived: filters.rewardReceived || null,
        churnRisk: filters.churnRisk || null,
      },
      demographic: {
        region: filters.region || null,
        city: filters.city || null,
        gender: filters.gender || null,
        ageGroup: filters.ageGroup || null,
        kycLevel: filters.kycLevel || null,
        deviceType: filters.deviceType || null,
      },
      value: {
        tier: filters.valueTier || null,
      },
    };

    return {
      name: segmentName,
      description,
      config: {
        autoRefresh,
        refreshInterval,
        ruleLogic,
        status: "active",
      },
      filters: apiFilters,
    };
  };

  const handleSaveAndActivate = () => {
    setShowConfirmModal(true);
  };

  const confirmActivation = async () => {
    try {
      await createSegmentMutation.mutateAsync(buildApiPayload());
      setShowConfirmModal(false);
      navigate("/segmentation");
    } catch (error) {
      // Error handled by mutation
    }
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

      {/* Segment Name & Type */}
      <Card>
        <CardHeader>
          <CardTitle>Segment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* Save / Activate Section */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button 
          onClick={handleSaveAndActivate} 
          className="gap-2"
          disabled={!segmentName || createSegmentMutation.isPending}
        >
          {createSegmentMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Save & Activate
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Segment Creation</DialogTitle>
            <DialogDescription>
              Please review the segment details before creating.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Segment Name</p>
                <p className="font-medium">{segmentName || "Unnamed Segment"}</p>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmActivation} 
              className="gap-2"
              disabled={createSegmentMutation.isPending}
            >
              {createSegmentMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Confirm & Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
