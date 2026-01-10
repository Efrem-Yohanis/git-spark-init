import { Users, Gift, Calendar, MessageSquare, Bell, Smartphone, CheckCircle, AlertCircle, XCircle, Clock, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type CampaignStatus = "Draft" | "Pending_Approval" | "Scheduled" | "Running" | "Paused" | "Completed" | "Failed";

interface OverviewTabProps {
  campaign: {
    id: string;
    name: string;
    type: string;
    objective: string;
    owner: string;
    status: CampaignStatus;
    description?: string;
    segment: {
      name: string;
      id: string;
      filters: string;
    };
    schedule: {
      startDate: string;
      endDate: string;
      triggerType: string;
      frequencyCap: string;
    };
    aiRecommendation: boolean;
  };
}

// Mock data for the overview
const campaignSummary = {
  name: "Meskel Reactivation Campaign",
  type: "Incentive",
  objective: "Activate dormant high-value customers through targeted incentives",
  description: "This campaign targets customers who have been inactive for 60+ days with personalized rewards.",
  owner: "Abebe Kebede",
};

const audienceSummary = {
  segments: ["seg-1", "seg-2"],
  totalCustomers: 45000,
};

const rewardSummary = {
  rewardType: "Other",
  rewardValue: "8 ETB",
  dailyCap: "1 ETB",
  perCustomerCap: "1 ETB",
  rewardAccount: "Main Rewards Pool",
  estimatedTotalCost: "360,000 ETB",
};

const scheduleSummary = {
  scheduleType: "Immediate",
  frequencyCap: "Once per day",
};

const channelConfigs = [
  {
    channel: "SMS",
    enabled: true,
    icon: MessageSquare,
    languages: [
      { name: "English", message: "Hello {{FirstName}}, enjoy 50 ETB reward" },
      { name: "Amharic", message: "ሰላም {{FirstName}}, 50 ብር እንዲያገኙ ይችላሉ" },
      { name: "Afaan Oromo", message: "Akkam {{FirstName}}, 50 ETB argadhu" },
      { name: "Tigrigna", message: "ሰላም {{FirstName}}, 50 ብር ተቀባ" },
    ],
    capPerChannel: 100000,
    retryOnFailure: true,
    priority: 1,
  },
  {
    channel: "USSD",
    enabled: true,
    icon: Smartphone,
    languages: [
      { name: "English", message: "Welcome {{FirstName}}! Dial *123# to claim your 50 ETB reward." },
      { name: "Amharic", message: "እንኳን ደህና መጡ {{FirstName}}! *123# ይደውሉ" },
    ],
    capPerChannel: 50000,
    retryOnFailure: false,
    priority: 2,
  },
  {
    channel: "App Push",
    enabled: true,
    icon: Bell,
    languages: [
      { name: "English", message: "🎉 {{FirstName}}, you have a 50 ETB reward waiting! Tap to claim." },
      { name: "Amharic", message: "🎉 {{FirstName}}, 50 ብር ሽልማት አለዎት! ለመውሰድ ይንኩ።" },
      { name: "Afaan Oromo", message: "🎉 {{FirstName}}, badhaasni 50 ETB si eeggataa jira!" },
    ],
    capPerChannel: 80000,
    retryOnFailure: true,
    priority: 3,
  },
];

const approvalHistory = [
  {
    id: 1,
    status: "Uncompleted",
    comment: "Please correct reward caps",
    date: "2024-01-12 09:40 AM",
  },
  {
    id: 2,
    status: "Approved",
    comment: "Corrections verified",
    date: "2024-01-18 02:15 PM",
  },
];

const getApprovalStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "Uncompleted":
      return <AlertCircle className="w-4 h-4 text-warning" />;
    case "Rejected":
      return <XCircle className="w-4 h-4 text-destructive" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const getApprovalStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "text-success";
    case "Uncompleted":
      return "text-warning";
    case "Rejected":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

export function OverviewTab({ campaign }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Campaign Summary Card */}
      <div className="bg-card border p-6 space-y-4">
        <h3 className="font-semibold text-lg">Campaign Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Name</span>
            <p className="font-medium">{campaignSummary.name}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Type</span>
            <p className="font-medium">{campaignSummary.type}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm text-muted-foreground">Objective</span>
            <p className="font-medium">{campaignSummary.objective}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm text-muted-foreground">Description</span>
            <p className="font-medium">{campaignSummary.description}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Owner</span>
            <p className="font-medium">{campaignSummary.owner}</p>
          </div>
        </div>
      </div>

      {/* Audience Summary Card */}
      <div className="bg-card border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Audience Summary</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Selected Segments</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {audienceSummary.segments.map((segment) => (
                <Badge key={segment} variant="outline">{segment}</Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Total Customers</span>
            <p className="font-medium">{audienceSummary.totalCustomers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Reward Summary Card */}
      <div className="bg-card border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Reward Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Reward Type</span>
            <p className="font-medium">{rewardSummary.rewardType}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Reward Value</span>
            <p className="font-medium">{rewardSummary.rewardValue}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Daily Cap</span>
            <p className="font-medium">{rewardSummary.dailyCap}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Per Customer Cap</span>
            <p className="font-medium">{rewardSummary.perCustomerCap}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Reward Account</span>
            <p className="font-medium">{rewardSummary.rewardAccount}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Estimated Total Cost</span>
            <p className="font-medium">{rewardSummary.estimatedTotalCost}</p>
          </div>
        </div>
      </div>

      {/* Schedule & Controls Card */}
      <div className="bg-card border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Schedule & Controls</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Schedule Type</span>
            <p className="font-medium">{scheduleSummary.scheduleType}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Frequency Cap</span>
            <p className="font-medium">{scheduleSummary.frequencyCap}</p>
          </div>
        </div>
      </div>

      {/* Channel Configuration Cards */}
      {channelConfigs.map((config) => {
        const IconComponent = config.icon;
        return (
          <div key={config.channel} className="bg-card border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconComponent className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Channel: {config.channel}</h3>
              </div>
              <Badge variant={config.enabled ? "default" : "secondary"}>
                {config.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            {config.enabled && (
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground font-medium">Languages:</span>
                  <div className="mt-2 space-y-3">
                    {config.languages.map((lang) => (
                      <div key={lang.name} className="bg-muted/50 p-3">
                        <span className="text-sm font-medium text-primary">{lang.name}</span>
                        <p className="text-sm mt-1 font-mono">{lang.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
                  <div>
                    <span className="text-sm text-muted-foreground">Cap per Channel</span>
                    <p className="font-medium">{config.capPerChannel.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Retry on Failure</span>
                    <p className="font-medium">{config.retryOnFailure ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Channel Priority</span>
                    <p className="font-medium">{config.priority}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Approval History Card - Not shown for Draft campaigns */}
      {campaign.status !== "Draft" && (
        <div className="bg-card border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Approval History (Your Actions)</h3>
          </div>
          
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {approvalHistory.map((entry, index) => (
              <div key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {getApprovalStatusIcon(entry.status)}
                  {index < approvalHistory.length - 1 && (
                    <div className="w-px h-full bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className={`font-medium ${getApprovalStatusColor(entry.status)}`}>
                    {entry.status}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comment: "{entry.comment}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Date: {entry.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
