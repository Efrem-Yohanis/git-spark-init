import { Gift, Wallet, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface RewardConfigStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const rewardAccounts = [
  { id: "acc-1", name: "Main Rewards Pool", balance: 5000000, reserved: 1200000, currency: "ETB" },
  { id: "acc-2", name: "Promo Budget Q1", balance: 2500000, reserved: 500000, currency: "ETB" },
  { id: "acc-3", name: "Win-back Fund", balance: 800000, reserved: 150000, currency: "ETB" },
];

export function RewardConfigStep({ formData, updateFormData }: RewardConfigStepProps) {
  const selectedAccount = rewardAccounts.find((a) => a.id === formData.rewardAccountId);
  const availableBalance = selectedAccount ? selectedAccount.balance - selectedAccount.reserved : 0;
  
  const estimatedCost = formData.rewardValue && formData.totalCustomers
    ? formData.rewardValue * formData.totalCustomers
    : 0;
  
  const isInsufficientBalance = estimatedCost > availableBalance;

  const handleAccountSelect = (accountId: string) => {
    const account = rewardAccounts.find((a) => a.id === accountId);
    if (account) {
      updateFormData({
        rewardAccountId: account.id,
        rewardAccountName: account.name,
        rewardAccountBalance: account.balance - account.reserved,
      });
    }
  };

  // This step should only be visible for Incentive campaigns
  if (formData.type !== "incentive") {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold mb-1">Reward Configuration</h2>
          <p className="text-sm text-muted-foreground">Configure incentives for this campaign</p>
        </div>
        <div className="border p-8 text-center text-muted-foreground bg-muted/20">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Rewards Not Applicable</p>
          <p className="text-sm mt-1">
            This campaign is set as Informational. Rewards are only available for Incentive campaigns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold mb-1">Reward Configuration</h2>
        <p className="text-sm text-muted-foreground">Configure incentives for this campaign</p>
      </div>

      <div className="space-y-4 p-4 border">
        {/* Reward Type */}
        <div className="space-y-3">
          <Label>Reward Type <span className="text-destructive">*</span></Label>
          <RadioGroup
            value={formData.rewardType}
            onValueChange={(value) => updateFormData({ rewardType: value })}
            className="flex flex-col gap-2"
          >
            <label
              className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                formData.rewardType === "cashback" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="cashback" id="cashback" />
              <span className="font-medium">Cashback</span>
            </label>
            <label
              className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                formData.rewardType === "bonus" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="bonus" id="bonus" />
              <span className="font-medium">Bonus</span>
            </label>
            <label
              className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                formData.rewardType === "other" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="other" id="other" />
              <span className="font-medium">Other</span>
            </label>
          </RadioGroup>
          {formData.rewardType === "other" && (
            <Input
              placeholder="Specify reward type"
              value={formData.rewardTypeOther || ""}
              onChange={(e) => updateFormData({ rewardTypeOther: e.target.value })}
              className="mt-2"
            />
          )}
        </div>

        {/* Reward Value */}
        <div className="space-y-2">
          <Label>Reward Value (ETB) <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="Enter amount"
              value={formData.rewardValue || ""}
              onChange={(e) => updateFormData({ rewardValue: Number(e.target.value) })}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              ETB
            </span>
          </div>
        </div>

        {/* Reward Cap */}
        <div className="space-y-3">
          <Label>Reward Cap</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Per Day (Global)</Label>
              <Input
                type="number"
                placeholder="Daily cap"
                value={formData.rewardCapPerDay || ""}
                onChange={(e) => updateFormData({ rewardCapPerDay: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Per Customer Per Day</Label>
              <Input
                type="number"
                placeholder="Per customer cap"
                value={formData.rewardCapPerCustomer || ""}
                onChange={(e) => updateFormData({ rewardCapPerCustomer: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Reward Account Selection */}
        <div className="space-y-2">
          <Label>Reward Account <span className="text-destructive">*</span></Label>
          <Select
            value={formData.rewardAccountId}
            onValueChange={handleAccountSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reward account" />
            </SelectTrigger>
            <SelectContent>
              {rewardAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>{account.name}</span>
                    <span className="text-muted-foreground">
                      {(account.balance - account.reserved).toLocaleString()} {account.currency} available
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Account Balance Display */}
        {selectedAccount && (
          <div className="p-4 border bg-background space-y-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-medium">{selectedAccount.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Balance</p>
                <p className="font-semibold">{selectedAccount.balance.toLocaleString()} ETB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reserved</p>
                <p className="font-semibold text-warning">{selectedAccount.reserved.toLocaleString()} ETB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Available</p>
                <p className="font-semibold text-success">{availableBalance.toLocaleString()} ETB</p>
              </div>
            </div>
          </div>
        )}

        {/* Estimated Cost */}
        {formData.totalCustomers > 0 && formData.rewardValue > 0 && (
          <div className={`p-4 border ${isInsufficientBalance ? "border-destructive bg-destructive/5" : "bg-info/5 border-info/20"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
                <p className="text-xl font-bold">
                  {estimatedCost.toLocaleString()} ETB
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.rewardValue} ETB × {formData.totalCustomers.toLocaleString()} customers
                </p>
              </div>
              {isInsufficientBalance && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">Insufficient Balance</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
