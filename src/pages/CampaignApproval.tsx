import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Users, MessageSquare, Gift, Calendar, Clock, Mail, Smartphone, Radio, Send, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ApproverHeader } from "@/components/approver/ApproverHeader";
import { ApproverFooter } from "@/components/approver/ApproverFooter";

// Mock campaign data
const mockCampaign = {
  id: "camp-1",
  name: "Meskel Reactivation Campaign",
  type: "incentive",
  objective: "Activate dormant high-value customers through targeted incentives",
  description: "This campaign targets customers who have been inactive for 60+ days with personalized rewards.",
  owner: "Abebe Kebede",
  status: "pending", // pending | uncompleted_resubmitted | approved | rejected
  submittedOn: "2024-01-16",
  segments: ["seg-1", "seg-2"],
  totalCustomers: 45000,
  activePercent: 0,
  dormantPercent: 100,
  rewardType: "Other",
  rewardValue: 8,
  dailyCap: 1,
  perCustomerCap: 1,
  rewardAccount: "Main Rewards Pool",
  estimatedCost: 360000,
  scheduleType: "Immediate",
  frequencyCap: "Once per day",
  createdAt: "2024-01-15",
};

// Mock channel data with multiple languages
const mockChannels = [
  {
    id: "sms",
    name: "SMS",
    icon: MessageSquare,
    enabled: true,
    capPerChannel: 100000,
    retryOnFailure: true,
    priority: 1,
    languages: [
      { code: "en", name: "English", content: "Hello {{FirstName}}, enjoy 50 ETB reward" },
      { code: "am", name: "Amharic", content: "ሰላም {{FirstName}}, 50 ብር እንዲያገኙ ይችላሉ" },
      { code: "om", name: "Afaan Oromo", content: "Akkam {{FirstName}}, 50 ETB argadhu" },
      { code: "ti", name: "Tigrigna", content: "ሰላም {{FirstName}}, 50 ብር ተቀባ" },
    ],
  },
  {
    id: "ussd",
    name: "USSD",
    icon: Radio,
    enabled: true,
    capPerChannel: 50000,
    retryOnFailure: false,
    priority: 2,
    languages: [
      { code: "en", name: "English", content: "Welcome {{FirstName}}! Dial *123# to claim your 50 ETB reward." },
      { code: "am", name: "Amharic", content: "እንኳን ደህና መጡ {{FirstName}}! *123# ይደውሉ" },
    ],
  },
  {
    id: "app_push",
    name: "App Push",
    icon: Smartphone,
    enabled: true,
    capPerChannel: 80000,
    retryOnFailure: true,
    priority: 3,
    languages: [
      { code: "en", name: "English", content: "🎉 {{FirstName}}, you have a 50 ETB reward waiting! Tap to claim." },
      { code: "am", name: "Amharic", content: "🎉 {{FirstName}}, 50 ብር ሽልማት አለዎት! ለመውሰድ ይንኩ።" },
      { code: "om", name: "Afaan Oromo", content: "🎉 {{FirstName}}, badhaasni 50 ETB si eeggataa jira!" },
    ],
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    enabled: false,
    capPerChannel: 0,
    retryOnFailure: false,
    priority: 4,
    languages: [],
    subject: "Your Exclusive 50 ETB Reward Awaits!",
    body: "<p>Dear {{FirstName}},</p><p>We miss you! Here's a special 50 ETB reward just for you.</p>",
  },
];

// Mock approval trail (history of actions by logged-in approver)
const mockApprovalTrail = [
  { 
    decision: "uncompleted", 
    comment: "Please correct reward caps", 
    date: "2024-01-12 09:40 AM" 
  },
  { 
    decision: "approved", 
    comment: "Corrections verified", 
    date: "2024-01-18 02:15 PM" 
  },
];

type ApprovalAction = "approve" | "reject" | "uncompleted";
type CampaignStatus = "pending" | "uncompleted_resubmitted" | "approved" | "rejected";

export default function CampaignApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [selectedAction, setSelectedAction] = useState<ApprovalAction | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: ApprovalAction | null }>({
    open: false,
    action: null,
  });

  // Determine campaign status - in production this would come from API
  const campaignStatus: CampaignStatus = mockCampaign.status as CampaignStatus;
  
  // Show approval section only for pending or uncompleted_resubmitted
  const canTakeAction = campaignStatus === "pending" || campaignStatus === "uncompleted_resubmitted";
  
  // Get the final decision if already approved/rejected
  const finalDecision = mockApprovalTrail.length > 0 ? mockApprovalTrail[mockApprovalTrail.length - 1] : null;

  const handleSubmitDecision = () => {
    if (selectedAction !== "approve" && !comment.trim()) {
      toast.error("Please enter a comment for Reject or Uncompleted decisions");
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
    navigate("/list_comain_to_me");
  };

  const getDecisionIcon = (decision: string) => {
    if (decision === "approved") return <CheckCircle className="w-4 h-4 text-success" />;
    if (decision === "rejected") return <XCircle className="w-4 h-4 text-destructive" />;
    if (decision === "uncompleted") return <AlertTriangle className="w-4 h-4 text-warning" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  const getDecisionColor = (decision: string) => {
    if (decision === "approved") return "text-success";
    if (decision === "rejected") return "text-destructive";
    if (decision === "uncompleted") return "text-warning";
    return "text-muted-foreground";
  };

  const enabledChannels = mockChannels.filter(ch => ch.enabled);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ApproverHeader />

      {/* Sub-header with Back Button */}
      <div className="bg-muted/50 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/list_comain_to_me")} className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to My Approvals
          </Button>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Campaign Summary Card */}
            <Card className="rounded-none border w-full">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Campaign Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6 text-sm">
                {/* Campaign Info Section */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{mockCampaign.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <Badge variant="outline" className="capitalize rounded-none">{mockCampaign.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objective</span>
                    <span className="font-medium text-right max-w-[400px]">{mockCampaign.objective}</span>
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

                {/* Audience Summary Section */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Audience Summary
                  </h4>
                  <div>
                    <span className="text-muted-foreground">Selected Segments:</span>
                    <ul className="mt-1 list-disc list-inside">
                      {mockCampaign.segments.map((seg) => (
                        <li key={seg}>{seg}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Customers</span>
                    <span className="font-bold text-lg">{mockCampaign.totalCustomers.toLocaleString()}</span>
                  </div>
                </div>

                {/* Reward Summary Section */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Gift className="w-4 h-4 text-primary" />
                    Reward Summary
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward Type</span>
                    <span className="font-medium">{mockCampaign.rewardType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward Value</span>
                    <span className="font-medium">{mockCampaign.rewardValue} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Cap</span>
                    <span className="font-medium">{mockCampaign.dailyCap} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Per Customer Cap</span>
                    <span className="font-medium">{mockCampaign.perCustomerCap} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward Account</span>
                    <span className="font-medium">{mockCampaign.rewardAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Total Cost</span>
                    <span className="font-bold text-lg">{mockCampaign.estimatedCost.toLocaleString()} ETB</span>
                  </div>
                </div>

                {/* Schedule & Controls Section */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Schedule & Controls
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule Type</span>
                    <span className="font-medium">{mockCampaign.scheduleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency Cap</span>
                    <span className="font-medium">{mockCampaign.frequencyCap}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Channel Cards */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Channel Configuration
              </h2>
              
              {enabledChannels.map((channel) => {
                const IconComponent = channel.icon;
                return (
                  <Card key={channel.id} className="rounded-none border w-full">
                    <CardHeader className="pb-3 border-b">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-primary" />
                          Channel: {channel.name}
                        </div>
                        <Badge className="bg-success/10 text-success border-success/20 rounded-none">Enabled</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {/* Languages Section */}
                      {channel.languages && channel.languages.length > 0 && (
                        <div>
                          <p className="font-medium text-sm mb-3">Languages:</p>
                          <div className="space-y-3">
                            {channel.languages.map((lang) => (
                              <div key={lang.code} className="bg-muted/50 p-3 border-l-4 border-primary">
                                <p className="text-sm font-medium text-primary">{lang.name}</p>
                                <p className="text-sm mt-1">{lang.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Email specific content */}
                      {channel.id === "email" && channel.subject && (
                        <div>
                          <p className="font-medium text-sm mb-2">Subject:</p>
                          <p className="text-sm bg-muted/50 p-2">{channel.subject}</p>
                          <p className="font-medium text-sm mb-2 mt-3">Body:</p>
                          <div className="text-sm bg-muted/50 p-2" dangerouslySetInnerHTML={{ __html: channel.body || "" }} />
                        </div>
                      )}

                      {/* Channel Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t text-sm">
                        <div>
                          <span className="text-muted-foreground">Cap per Channel</span>
                          <p className="font-medium">{channel.capPerChannel.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Retry on Failure</span>
                          <p className="font-medium">{channel.retryOnFailure ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Channel Priority</span>
                          <p className="font-medium">{channel.priority}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Approval History Card - Above Approval Decision */}
            <Card className="rounded-none border w-full">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="w-4 h-4 text-primary" />
                  Approval History (Your Actions)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {mockApprovalTrail.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No previous actions on this campaign
                  </p>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                    
                    {/* Timeline items */}
                    <div className="space-y-6">
                      {mockApprovalTrail.map((item, index) => (
                        <div key={index} className="relative pl-6">
                          {/* Timeline dot */}
                          <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center ${
                            item.decision === "approved" 
                              ? "border-success" 
                              : item.decision === "rejected"
                              ? "border-destructive"
                              : "border-warning"
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              item.decision === "approved" 
                                ? "bg-success" 
                                : item.decision === "rejected"
                                ? "bg-destructive"
                                : "bg-warning"
                            }`} />
                          </div>
                          
                          {/* Content */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getDecisionIcon(item.decision)}
                              <span className={`font-medium text-sm capitalize ${getDecisionColor(item.decision)}`}>
                                {item.decision}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Comment: "{item.comment}"
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Date: {item.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approval Section - Only if can take action */}
            {canTakeAction && (
              <Card className="rounded-none border w-full">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base">Approval Decision</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Comment Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Approval Comment <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        placeholder="Enter your comment (required for Reject/Uncompleted)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value.slice(0, 500))}
                        rows={4}
                        className="resize-none rounded-none w-full"
                      />
                      <p className="text-xs text-muted-foreground text-right">{comment.length} / 500 characters</p>
                    </div>

                    {/* Decision Section */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Decision:</Label>
                        <RadioGroup
                          value={selectedAction || ""}
                          onValueChange={(value) => setSelectedAction(value as ApprovalAction)}
                          className="flex flex-wrap gap-6"
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
                              Uncompleted
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button
                        onClick={handleSubmitDecision}
                        disabled={!selectedAction || (selectedAction !== "approve" && !comment.trim())}
                        className="w-full gradient-primary text-primary-foreground rounded-none h-11"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Read-only status display when already approved/rejected */}
            {!canTakeAction && finalDecision && (
              <Card className="rounded-none border w-full">
                <CardContent className="py-6">
                  <div className="flex items-center justify-center gap-3">
                    {getDecisionIcon(finalDecision.decision)}
                    <span className={`font-medium ${getDecisionColor(finalDecision.decision)}`}>
                      Status: {finalDecision.decision.charAt(0).toUpperCase() + finalDecision.decision.slice(1)} on {finalDecision.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ApproverFooter />

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="rounded-none">
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
          {comment && (
            <div className="p-3 bg-muted text-sm">
              <p className="font-medium">Your Comment:</p>
              <p className="mt-1">{comment}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, action: null })} className="rounded-none">
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={`rounded-none ${
                confirmDialog.action === "approve" 
                  ? "bg-success hover:bg-success/90" 
                  : confirmDialog.action === "reject"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }`}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
