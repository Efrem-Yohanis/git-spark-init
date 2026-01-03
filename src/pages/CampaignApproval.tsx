import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Users, MessageSquare, Gift, Calendar, Clock, Bell, LogOut, User, Mail, Smartphone, Radio, Send, ChevronDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const approvalSteps = [
  { id: 1, role: "Department Manager", name: "Sarah Johnson", status: "approved", date: "2024-01-16 10:30 AM", comment: "Campaign objectives align with Q1 goals. Approved." },
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

// Mock pending approvals for notification dropdown
const pendingApprovals = [
  { id: "camp-1", name: "Q1 Reactivation Campaign", submittedOn: "2024-01-16" },
  { id: "camp-2", name: "February Loyalty Push", submittedOn: "2024-01-17" },
  { id: "camp-3", name: "New User Onboarding", submittedOn: "2024-01-18" },
];

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
    navigate("/approvals");
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle className="w-4 h-4 text-success" />;
    if (status === "rejected") return <XCircle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  const getStatusLabel = (status: string) => {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending";
  };

  const enabledChannels = mockChannels.filter(ch => ch.enabled);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Full Width, Sticky */}
      <header className="h-14 border-b bg-card px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-primary flex items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-lg">Campaign Approval</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                  {currentApprover.pendingCount}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 border-b">
                <p className="font-medium text-sm">Pending Approvals</p>
              </div>
              {pendingApprovals.map((approval) => (
                <DropdownMenuItem key={approval.id} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => navigate(`/campaigns/${approval.id}/approval`)}>
                  <span className="font-medium text-sm">{approval.name}</span>
                  <span className="text-xs text-muted-foreground">Submitted: {approval.submittedOn}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary" onClick={() => navigate("/approvals")}>
                View All Approvals
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Info with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{currentApprover.name}</span>
                <span className="text-muted-foreground text-xs">({currentApprover.role})</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-auto">
        {/* Review & Submit Section */}
        <div className="bg-muted/50 border-b px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate("/approvals")} className="gap-2 mb-3 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              Back to My Approvals
            </Button>
            <h1 className="text-xl font-semibold">Review & Submit</h1>
            <p className="text-sm text-muted-foreground">Verify all details before submitting for approval</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Cards - 2 Column Grid (50% each) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Summary Card */}
              <Card className="rounded-none border">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Campaign Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-sm">
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
                    <span className="font-medium text-right max-w-[250px]">{mockCampaign.objective}</span>
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
              <Card className="rounded-none border">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-4 h-4 text-primary" />
                    Audience Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Selected Segments:</span>
                    <ul className="mt-1 list-disc list-inside">
                      {mockCampaign.segments.map((seg) => (
                        <li key={seg}>{seg}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Total Customers</span>
                    <span className="font-bold text-lg">{mockCampaign.totalCustomers.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Reward Summary Card */}
              <Card className="rounded-none border">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Gift className="w-4 h-4 text-primary" />
                    Reward Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-sm">
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
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Estimated Total Cost</span>
                    <span className="font-bold text-lg">{mockCampaign.estimatedCost.toLocaleString()} ETB</span>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Controls Card */}
              <Card className="rounded-none border">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="w-4 h-4 text-primary" />
                    Schedule & Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule Type</span>
                    <span className="font-medium">{mockCampaign.scheduleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency Cap</span>
                    <span className="font-medium">{mockCampaign.frequencyCap}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Channel Cards - Full Width, Stacked Vertically */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Channel Configuration
              </h2>
              
              {enabledChannels.map((channel) => {
                const IconComponent = channel.icon;
                return (
                  <Card key={channel.id} className="rounded-none border">
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

            {/* Approval Progress - Full Width */}
            <Card className="rounded-none border">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base">Approval Progress / Approver List</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Role</th>
                        <th className="text-left py-2 px-3 font-medium">Approver</th>
                        <th className="text-left py-2 px-3 font-medium">Status</th>
                        <th className="text-left py-2 px-3 font-medium">Date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvalSteps.map((step) => (
                        <tr key={step.id} className={`border-b ${step.id === currentApproverStep ? "bg-primary/5" : ""}`}>
                          <td className="py-3 px-3 font-medium">{step.role}</td>
                          <td className="py-3 px-3">{step.name}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(step.status)}
                              <span className={
                                step.status === "approved" ? "text-success" :
                                step.status === "rejected" ? "text-destructive" :
                                "text-muted-foreground"
                              }>
                                {getStatusLabel(step.status)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{step.date || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Approval History - Full Width */}
            {approvalHistory.length > 0 && (
              <Card className="rounded-none border">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base">Approval History</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ScrollArea className="max-h-[300px]">
                    <div className="space-y-4">
                      {approvalHistory.map((entry, index) => (
                        <div key={index} className="p-4 bg-muted/50 border text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{entry.role} – {entry.name}</span>
                            <Badge className={`rounded-none ${
                              entry.decision === "Approved" 
                                ? "bg-success/10 text-success" 
                                : entry.decision === "Rejected"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-warning/10 text-warning"
                            }`}>
                              {entry.decision}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-1">Comment: "{entry.comment}"</p>
                          <p className="text-xs text-muted-foreground">Date: {entry.date}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Approval Action Bar - Full Width */}
      {isCurrentApprover && (
        <div className="sticky bottom-0 border-t bg-card p-6 shadow-lg shrink-0 z-40">
          <div className="max-w-7xl mx-auto">
            <Card className="rounded-none border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Comment Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Approval Comment <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      placeholder="Enter your comment (required for Reject/Uncompleted)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, 500))}
                      rows={3}
                      className="resize-none rounded-none"
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
                        className="flex flex-wrap gap-4"
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
                      Submit Decision
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-muted/30 px-6 py-4 text-center shrink-0">
        <p className="text-sm text-muted-foreground">© 2026 M-Pesa Ethiopia | Campaign Approval Portal</p>
        <div className="flex justify-center gap-4 mt-1">
          <a href="#" className="text-xs text-muted-foreground hover:text-primary">Privacy</a>
          <span className="text-xs text-muted-foreground">•</span>
          <a href="#" className="text-xs text-muted-foreground hover:text-primary">Security</a>
          <span className="text-xs text-muted-foreground">•</span>
          <a href="#" className="text-xs text-muted-foreground hover:text-primary">Support</a>
        </div>
      </footer>

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
