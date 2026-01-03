import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Users, MessageSquare, Gift, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

type ApprovalAction = "approve" | "reject" | "uncompleted";

export default function CampaignApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: ApprovalAction | null }>({
    open: false,
    action: null,
  });

  // Current approver is Technology Manager (step 2)
  const currentApproverStep = 2;
  const isCurrentApprover = true; // In production, check against logged-in user

  const handleAction = (action: ApprovalAction) => {
    if (!comment.trim()) {
      toast.error("Please enter a comment before proceeding");
      return;
    }
    setConfirmDialog({ open: true, action });
  };

  const confirmAction = () => {
    const actionLabels = {
      approve: "approved",
      reject: "rejected",
      uncompleted: "marked as uncompleted",
    };
    
    toast.success(`Campaign ${actionLabels[confirmDialog.action!]} successfully`);
    setConfirmDialog({ open: false, action: null });
    navigate("/campaigns");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      case "uncompleted":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Uncompleted</Badge>;
      case "pending":
      default:
        return <Badge className="bg-muted text-muted-foreground">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Campaign Approval</h1>
              {getStatusBadge(mockCampaign.status)}
            </div>
            <p className="text-muted-foreground">{mockCampaign.name}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate("/campaigns")}>
          Back to Campaigns
        </Button>
      </div>

      {/* Read-only notice */}
      <div className="bg-info/10 border border-info/20 p-3 text-sm text-info flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <span>Read-only for approval. Campaign configuration cannot be modified.</span>
      </div>

      {/* Campaign Summary (Read-only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Details */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <CheckCircle className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Campaign Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
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
              <span className="font-medium max-w-[250px] text-right">{mockCampaign.objective}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Description</span>
              <p className="mt-1">{mockCampaign.description}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner</span>
              <span className="font-medium">{mockCampaign.owner}</span>
            </div>
          </div>
        </div>

        {/* Audience Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Audience Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
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
          </div>
        </div>

        {/* Channel Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Channel Summary</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockCampaign.channels.map((channel) => (
              <Badge key={channel} variant="secondary">{channel}</Badge>
            ))}
          </div>
        </div>

        {/* Reward Summary */}
        <div className="border p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Gift className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Reward Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
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
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="border p-4 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Schedule & Controls</h3>
          </div>
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
        </div>
      </div>

      {/* Approval Progress Tracker */}
      <div className="border p-4 space-y-4">
        <h3 className="font-semibold">Approval Progress</h3>
        <div className="flex items-center justify-between">
          {approvalSteps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center border-2 ${
                    step.status === "approved"
                      ? "bg-success border-success text-success-foreground"
                      : step.status === "rejected"
                      ? "bg-destructive border-destructive text-destructive-foreground"
                      : step.id === currentApproverStep
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {step.status === "approved" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : step.status === "rejected" ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-xs font-medium ${
                    step.id === currentApproverStep ? "text-primary" : "text-foreground"
                  }`}>
                    {step.role}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.name}</p>
                  {getStatusBadge(step.status)}
                </div>
              </div>
              {index < approvalSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  step.status === "approved" ? "bg-success" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Approver Action Panel */}
      {isCurrentApprover && (
        <div className="border p-4 space-y-4 bg-primary/5 border-primary/20">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Your Action Required
          </h3>
          
          <div className="space-y-2">
            <Label>Approval Comment <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Enter your comment (required for all actions)"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">{comment.length}/500 characters</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleAction("approve")}
              disabled={!comment.trim()}
              className="bg-success hover:bg-success/90 text-success-foreground gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction("reject")}
              disabled={!comment.trim()}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAction("uncompleted")}
              disabled={!comment.trim()}
              className="gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Mark as Uncompleted
            </Button>
          </div>
        </div>
      )}

      {/* Approval History */}
      <div className="border p-4 space-y-4">
        <h3 className="font-semibold">Approval History</h3>
        {approvalHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Role</th>
                  <th className="text-left py-2 font-medium">Name</th>
                  <th className="text-left py-2 font-medium">Decision</th>
                  <th className="text-left py-2 font-medium">Comment</th>
                  <th className="text-left py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {approvalHistory.map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{entry.role}</td>
                    <td className="py-2">{entry.name}</td>
                    <td className="py-2">
                      <Badge className={
                        entry.decision === "Approved" 
                          ? "bg-success/10 text-success" 
                          : entry.decision === "Rejected"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }>
                        {entry.decision}
                      </Badge>
                    </td>
                    <td className="py-2 max-w-[300px] truncate">{entry.comment}</td>
                    <td className="py-2 text-muted-foreground">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No approval history yet</p>
        )}
      </div>

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
          <div className="p-3 bg-muted text-sm">
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
