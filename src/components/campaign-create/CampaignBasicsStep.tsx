import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface CampaignBasicsStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

export function CampaignBasicsStep({ formData, updateFormData }: CampaignBasicsStepProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold mb-1">Campaign Basics</h2>
        <p className="text-sm text-muted-foreground">Define what this campaign is about</p>
      </div>

      <div className="space-y-4">
        {/* Campaign Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name <span className="text-destructive">*</span></Label>
          <Input
            id="name"
            placeholder="Enter campaign name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
        </div>

        {/* Campaign Type - Radio Buttons */}
        <div className="space-y-3">
          <Label>Campaign Type <span className="text-destructive">*</span></Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value) => updateFormData({ type: value })}
            className="flex flex-col gap-3"
          >
            <label
              className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                formData.type === "informational" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="informational" id="informational" />
              <div>
                <p className="font-medium">Informational</p>
                <p className="text-sm text-muted-foreground">Send informational messages without rewards</p>
              </div>
            </label>
            <label
              className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                formData.type === "incentive" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="incentive" id="incentive" />
              <div>
                <p className="font-medium">Incentive</p>
                <p className="text-sm text-muted-foreground">Include rewards to incentivize customer action</p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* Campaign Objective - Text Input */}
        <div className="space-y-2">
          <Label htmlFor="objective">Campaign Objective <span className="text-destructive">*</span></Label>
          <Input
            id="objective"
            placeholder="e.g., Activate dormant high-value customers"
            value={formData.objective}
            onChange={(e) => updateFormData({ objective: e.target.value.slice(0, 100) })}
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground text-right">
            {formData.objective.length}/100 characters
          </p>
        </div>

        {/* Campaign Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe the campaign purpose and goals"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={3}
          />
        </div>

        {/* Owner */}
        <div className="space-y-2">
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            value={formData.owner}
            disabled
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
}
