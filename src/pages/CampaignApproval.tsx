import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Users, MessageSquare, Gift, Calendar, Clock, Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock campaign data
const mockCampaign = {
  id: "camp-1",
  name: "Q1 Reactivation Campaign",
  type: "incentive",
  objective: "Activate dormant high-value customers through targeted incentives",
  description: "This campaign targets customers who have been inactive for 60+ days with personalized rewards.",
  owner: "John Doe",
  status: "pending_approval",
  submittedOn: "2024-01-16",
  segments: ["High Value Dormant", "Urban Youth"],
  totalCustomers: 45000,
  activePercent: 0,
  dormantPercent: 100,
  channels: ["SMS", "USSD", "App Push"],
  rewardType: "Cashback",
  rewardValue: 50,
  rewardAccount: "Main Rewards Pool",
  estimatedCost: 2250000,
  scheduleType: "scheduled",
  startDate: "2024-02-01",
  endDate: "2024-02-28",
  frequencyCap: "Once per day",
  createdAt: "2024-01-15",
};

const approvalSteps = [
  { id: 1, role: "Department Manager", name: "Sarah Johnson", status: "approved", date: "2024-01-16", comment: "Campaign objectives align with Q1 goals. Approved." },
  { id: 2, role: "Technology Manager", name: "Mike Chen", status: "pending", date: null, comment: null },
  { id: 3, role: "Operational Manager", name: "Emily Davis", status: "pending", date: null, comment: null },
  { id: 4, role: "Chief Manager", name: "Robert Wilson", status: "pending", date: null, comment: null },
];

const approvalHistory = [
  { role: "Department Manager", name: "Sarah Johnson", decision: "Approved", comment: "Campaign objectives align with Q1 goals. Approved.", date: "2024-01-16 10:30 AM" },
];

// Mock current approver
const currentApprover = {
  name: "Mike Chen",
  role: "Technology Manager",
  pendingCount: 3,
};

type ApprovalAction = "approve" | "reject" | "uncompleted";

export default function CampaignApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [selectedAction, setSelectedAction] = useState<ApprovalAction | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: ApprovalAction | null }>({
    open: false,
    action: null,
  });

  // Current approver is Technology Manager (step 2)
  const currentApproverStep = 2;
  const isCurrentApprover = true; // In production, check against logged-in user

  const handleSubmitDecision = () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment before proceeding");
      return;
    }
    if (!selectedAction) {
      toast.error("Please select a decision");
      return;
    }
    setConfirmDialog({ open: true, action: selectedAction });
  };

  const confirmAction = () => {
    const actionLabels = {
      approve: "approved",
      reject: "rejected",
      uncompleted: "marked as uncompleted",
    };
    
    toast.success(`Campaign ${actionLabels[confirmDialog.action!]} successfully`);
    setConfirmDialog({ open: false, action: null });
    navigate("/approvals");
  };

  const getStepIcon = (step: typeof approvalSteps[0]) => {
    if (step.status === "approved") {
      return <CheckCircle className="w-5 h-5 text-success" />;
    }
    if (step.status === "rejected") {
      return <XCircle className="w-5 h-5 text-destructive" />;
    }
    if (step.status === "pending") {
      return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Standalone Header */}
      <header className="h-14 border-b bg-card px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-lg">Campaign Approval</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <Badge variant="secondary">{currentApprover.pendingCount} Pending</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>{currentApprover.name}</span>
            <span className="text-muted-foreground">({currentApprover.role})</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Campaign Meta Strip */}
      <div className="bg-muted/50 border-b px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/approvals")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to My Approvals
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold text-lg">{mockCampaign.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Owner: {mockCampaign.owner}</span>
              <span>•</span>
              <span>Submitted: {mockCampaign.submittedOn}</span>
            </div>
          </div>
        </div>
        <Badge className="bg-warning/10 text-warning border-warning/20">Pending Approval</Badge>
      </div>

      {/* Main Content - 2 Column Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left Column - Campaign Details */}
          <div className="space-y-6">
            {/* Campaign Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Campaign Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{mockCampaign.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="outline" className="capitalize">{mockCampaign.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objective</span>
                  <span className="font-medium max-w-[300px] text-right">{mockCampaign.objective}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Description</span>
                  <p className="mt-1">{mockCampaign.description}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-medium">{mockCampaign.owner}</span>
                </div>
              </CardContent>
            </Card>

            {/* Audience Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-4 h-4 text-primary" />
                  Audience Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Segments</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mockCampaign.segments.map((seg) => (
                      <Badge key={seg} variant="outline">{seg}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Customers</span>
                  <span className="font-bold text-lg">{mockCampaign.totalCustomers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active / Dormant</span>
                  <span>{mockCampaign.activePercent}% / {mockCampaign.dormantPercent}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Channel Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Channel Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockCampaign.channels.map((channel) => (
                    <div key={channel} className="flex items-center gap-2 px-3 py-2 bg-success/10 text-success rounded-md text-sm">
                      <CheckCircle className="w-4 h-4" />
                      {channel}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reward Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gift className="w-4 h-4 text-primary" />
                  Reward Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reward Type</span>
                  <span className="font-medium">{mockCampaign.rewardType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reward Value</span>
                  <span className="font-medium">{mockCampaign.rewardValue} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reward Account</span>
                  <span className="font-medium">{mockCampaign.rewardAccount}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-bold text-lg">{mockCampaign.estimatedCost.toLocaleString()} ETB</span>
                </div>
              </CardContent>
            </Card>

            {/* Schedule & Controls Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-4 h-4 text-primary" />
                  Schedule & Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Schedule Type</p>
                    <p className="font-medium capitalize">{mockCampaign.scheduleType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{mockCampaign.startDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{mockCampaign.endDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequency Cap</p>
                    <p className="font-medium">{mockCampaign.frequencyCap}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Approval Context */}
          <div className="space-y-6">
            {/* Approval Progress Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Approval Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvalSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.status === "approved"
                          ? "bg-success/10"
                          : step.status === "rejected"
                          ? "bg-destructive/10"
                          : step.id === currentApproverStep
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "bg-muted"
                      }`}>
                        {getStepIcon(step)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-medium ${
                            step.id === currentApproverStep ? "text-primary" : ""
                          }`}>
                            {step.role}
                          </p>
                          <Badge variant={step.status === "approved" ? "default" : "secondary"} className={
                            step.status === "approved" 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-muted text-muted-foreground"
                          }>
                            {step.status === "approved" ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.name}</p>
                        {step.date && (
                          <p className="text-xs text-muted-foreground mt-1">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Approval History Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Approval History</CardTitle>
              </CardHeader>
              <CardContent>
                {approvalHistory.length > 0 ? (
                  <ScrollArea className="max-h-[300px]">
                    <div className="space-y-4">
                      {approvalHistory.map((entry, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{entry.role}</span>
                            <Badge className={
                              entry.decision === "Approved" 
                                ? "bg-success/10 text-success" 
                                : entry.decision === "Rejected"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-warning/10 text-warning"
                            }>
                              {entry.decision}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-1">{entry.name}</p>
                          <p className="text-foreground mb-2">"{entry.comment}"</p>
                          <p className="text-xs text-muted-foreground">{entry.date}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No approval history yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky Approval Action Bar */}
      {isCurrentApprover && (
        <div className="sticky bottom-0 border-t bg-card p-4 shadow-lg shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
              {/* Decision Radio Group */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Decision</Label>
                <RadioGroup
                  value={selectedAction || ""}
                  onValueChange={(value) => setSelectedAction(value as ApprovalAction)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approve" id="approve" />
                    <Label htmlFor="approve" className="flex items-center gap-1 cursor-pointer text-success">
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reject" id="reject" />
                    <Label htmlFor="reject" className="flex items-center gap-1 cursor-pointer text-destructive">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="uncompleted" id="uncompleted" />
                    <Label htmlFor="uncompleted" className="flex items-center gap-1 cursor-pointer text-warning">
                      <AlertTriangle className="w-4 h-4" />
                      Mark as Uncompleted
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Comment Input */}
              <div className="flex-1 w-full lg:w-auto space-y-1">
                <Label className="text-sm">
                  Approval Comment <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Enter your comment (required for all actions)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 500))}
                    rows={2}
                    className="flex-1 resize-none"
                  />
                  <Button
                    onClick={handleSubmitDecision}
                    disabled={!comment.trim() || !selectedAction}
                    className="bg-success hover:bg-success/90 text-success-foreground h-auto px-6"
                  >
                    Submit Decision
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-right">{comment.length}/500</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-muted/30 px-6 py-3 text-center text-xs text-muted-foreground shrink-0">
        © M-Pesa Ethiopia | Campaign Approval System
      </footer>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm {confirmDialog.action === "approve" ? "Approval" : confirmDialog.action === "reject" ? "Rejection" : "Uncompleted Status"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === "approve" && "This will approve the campaign and move it to the next approver."}
              {confirmDialog.action === "reject" && "This will reject the campaign and stop the approval flow."}
              {confirmDialog.action === "uncompleted" && "This will return the campaign to the creator for modifications."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 bg-muted rounded-md text-sm">
            <p className="font-medium">Your Comment:</p>
            <p className="mt-1">{comment}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, action: null })}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                confirmDialog.action === "approve" 
                  ? "bg-success hover:bg-success/90" 
                  : confirmDialog.action === "reject"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
