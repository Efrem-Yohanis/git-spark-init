import { Calendar, Zap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface ScheduleControlsStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const frequencyOptions = [
  { value: "once_per_day", label: "Once per day" },
  { value: "once_per_campaign", label: "Once per campaign" },
];

export function ScheduleControlsStep({ formData, updateFormData }: ScheduleControlsStepProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold mb-1">Schedule & Controls</h2>
        <p className="text-sm text-muted-foreground">Define when and how the campaign runs</p>
      </div>

      {/* Schedule Type */}
      <div className="space-y-3">
        <Label>Schedule Type <span className="text-destructive">*</span></Label>
        <RadioGroup
          value={formData.scheduleType}
          onValueChange={(value) => updateFormData({ scheduleType: value })}
          className="flex flex-col gap-3"
        >
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.scheduleType === "immediate" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value="immediate" id="immediate" />
            <Zap className="w-5 h-5" />
            <div>
              <p className="font-medium">Immediate</p>
              <p className="text-sm text-muted-foreground">Start campaign right after approval</p>
            </div>
          </label>
          <label
            className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
              formData.scheduleType === "scheduled" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value="scheduled" id="scheduled" />
            <Calendar className="w-5 h-5" />
            <div>
              <p className="font-medium">Scheduled</p>
              <p className="text-sm text-muted-foreground">Set specific start and end dates</p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* Scheduled Date/Time */}
      {formData.scheduleType === "scheduled" && (
        <div className="p-4 border space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData({ startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => updateFormData({ endDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
