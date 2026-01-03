import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { CampaignBasicsStep } from "@/components/campaign-create/CampaignBasicsStep";
import { AudienceSelectionStep } from "@/components/campaign-create/AudienceSelectionStep";
import { ChannelMessageStep } from "@/components/campaign-create/ChannelMessageStep";
import { RewardConfigStep } from "@/components/campaign-create/RewardConfigStep";
import { ScheduleControlsStep } from "@/components/campaign-create/ScheduleControlsStep";
import { ReviewSubmitStep } from "@/components/campaign-create/ReviewSubmitStep";

export interface ChannelMessages {
  sms: Record<string, string>;
  ussd: Record<string, string>;
  app: Record<string, string>;
}

export interface ChannelSettings {
  sms: { cap: number; retryOnFailure: boolean; priority: number };
  ussd: { cap: number; retryOnFailure: boolean; priority: number };
  app: { cap: number; retryOnFailure: boolean; priority: number };
  email: { cap: number; retryOnFailure: boolean; priority: number };
}

export interface CampaignFormData {
  // Step 1: Basics
  name: string;
  type: string; // "informational" | "incentive"
  objective: string;
  description: string;
  owner: string;
  
  // Step 2: Audience
  selectedSegmentIds: string[];
  uploadedFileName: string;
  uploadedFileCustomers: number;
  totalCustomers: number;
  
  // Step 3: Channels & Messages
  channels: {
    sms: boolean;
    ussd: boolean;
    app: boolean;
    email: boolean;
  };
  channelMessages: ChannelMessages;
  emailContent: {
    language: string;
    subject: string;
    body: string;
  };
  channelSettings: ChannelSettings;
  
  // Step 4: Rewards (only for incentive type)
  rewardType: string; // "cashback" | "bonus" | "other"
  rewardTypeOther: string;
  rewardValue: number;
  rewardCapPerDay: number;
  rewardCapPerCustomer: number;
  rewardAccountId: string;
  rewardAccountName: string;
  rewardAccountBalance: number;
  
  // Step 5: Schedule
  scheduleType: string;
  startDate: string;
  endDate: string;
  frequencyCap: string;
}

const initialFormData: CampaignFormData = {
  name: "",
  type: "",
  objective: "",
  description: "",
  owner: "Current User",
  
  selectedSegmentIds: [],
  uploadedFileName: "",
  uploadedFileCustomers: 0,
  totalCustomers: 0,
  
  channels: {
    sms: false,
    ussd: false,
    app: false,
    email: false,
  },
  channelMessages: {
    sms: {},
    ussd: {},
    app: {},
  },
  emailContent: {
    language: "en",
    subject: "",
    body: "",
  },
  channelSettings: {
    sms: { cap: 0, retryOnFailure: false, priority: 1 },
    ussd: { cap: 0, retryOnFailure: false, priority: 2 },
    app: { cap: 0, retryOnFailure: false, priority: 3 },
    email: { cap: 0, retryOnFailure: false, priority: 4 },
  },
  
  rewardType: "cashback",
  rewardTypeOther: "",
  rewardValue: 0,
  rewardCapPerDay: 0,
  rewardCapPerCustomer: 0,
  rewardAccountId: "",
  rewardAccountName: "",
  rewardAccountBalance: 0,
  
  scheduleType: "immediate",
  startDate: "",
  endDate: "",
  frequencyCap: "once_per_day",
};

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedSegment = searchParams.get("segment");
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CampaignFormData>(() => {
    if (preSelectedSegment) {
      return {
        ...initialFormData,
        selectedSegmentIds: [preSelectedSegment],
        totalCustomers: 45000,
      };
    }
    return initialFormData;
  });

  // Calculate steps based on campaign type
  const isIncentive = formData.type === "incentive";
  const steps = isIncentive
    ? [
        { id: 1, name: "Campaign Basics" },
        { id: 2, name: "Audience Selection" },
        { id: 3, name: "Channel & Message" },
        { id: 4, name: "Reward Configuration" },
        { id: 5, name: "Schedule & Controls" },
        { id: 6, name: "Review & Submit" },
      ]
    : [
        { id: 1, name: "Campaign Basics" },
        { id: 2, name: "Audience Selection" },
        { id: 3, name: "Channel & Message" },
        { id: 4, name: "Schedule & Controls" },
        { id: 5, name: "Review & Submit" },
      ];

  const maxStep = steps.length;

  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    // Map step numbers based on campaign type
    const actualStep = isIncentive ? step : (step >= 4 ? step + 1 : step);
    
    switch (actualStep) {
      case 1:
        if (!formData.name || !formData.type || !formData.objective) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (formData.selectedSegmentIds.length === 0 && !formData.uploadedFileName) {
          toast.error("Please select at least one segment or upload a file");
          return false;
        }
        return true;
      case 3:
        const hasChannel = Object.values(formData.channels).some(v => v);
        if (!hasChannel) {
          toast.error("Please select at least one channel");
          return false;
        }
        // Check channel priorities if multiple channels
        const selectedChannelsCount = Object.values(formData.channels).filter(Boolean).length;
        if (selectedChannelsCount > 1) {
          const priorities = [];
          if (formData.channels.sms) priorities.push(formData.channelSettings.sms.priority);
          if (formData.channels.ussd) priorities.push(formData.channelSettings.ussd.priority);
          if (formData.channels.app) priorities.push(formData.channelSettings.app.priority);
          if (formData.channels.email) priorities.push(formData.channelSettings.email.priority);
          
          if (priorities.some(p => !p || p <= 0)) {
            toast.error("Please set priority for all selected channels");
            return false;
          }
        }
        return true;
      case 4:
        if (isIncentive) {
          if (!formData.rewardValue || formData.rewardValue <= 0) {
            toast.error("Please enter a valid reward value");
            return false;
          }
          if (!formData.rewardAccountId) {
            toast.error("Please select a reward account");
            return false;
          }
          const estimatedCost = formData.rewardValue * formData.totalCustomers;
          if (estimatedCost > formData.rewardAccountBalance) {
            toast.error("Insufficient balance in reward account");
            return false;
          }
        }
        return true;
      case 5:
        if (formData.scheduleType === "scheduled") {
          if (!formData.startDate || !formData.endDate) {
            toast.error("Please set start and end dates");
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, maxStep));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    toast.success("Campaign saved as draft");
    navigate("/campaigns");
  };

  const handleSubmit = () => {
    toast.success("Campaign submitted for approval successfully.");
    navigate("/campaigns/approvals");
  };

  const handleCancel = () => {
    navigate("/campaigns");
  };

  const renderStep = () => {
    if (isIncentive) {
      switch (currentStep) {
        case 1:
          return <CampaignBasicsStep formData={formData} updateFormData={updateFormData} />;
        case 2:
          return <AudienceSelectionStep formData={formData} updateFormData={updateFormData} />;
        case 3:
          return <ChannelMessageStep formData={formData} updateFormData={updateFormData} />;
        case 4:
          return <RewardConfigStep formData={formData} updateFormData={updateFormData} />;
        case 5:
          return <ScheduleControlsStep formData={formData} updateFormData={updateFormData} />;
        case 6:
          return <ReviewSubmitStep formData={formData} />;
        default:
          return null;
      }
    } else {
      switch (currentStep) {
        case 1:
          return <CampaignBasicsStep formData={formData} updateFormData={updateFormData} />;
        case 2:
          return <AudienceSelectionStep formData={formData} updateFormData={updateFormData} />;
        case 3:
          return <ChannelMessageStep formData={formData} updateFormData={updateFormData} />;
        case 4:
          return <ScheduleControlsStep formData={formData} updateFormData={updateFormData} />;
        case 5:
          return <ReviewSubmitStep formData={formData} />;
        default:
          return null;
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground">Configure and launch your engagement campaign</p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border p-4">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center border-2 font-medium text-sm ${
                    currentStep > index + 1
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === index + 1
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {currentStep > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-xs mt-1 text-center max-w-[80px] ${
                  currentStep >= index + 1 ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > index + 1 ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card border p-6 min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex gap-3">
          {currentStep === maxStep ? (
            <>
              <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button onClick={handleSubmit} className="gap-2">
                <Send className="w-4 h-4" />
                Submit for Approval
              </Button>
            </>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
