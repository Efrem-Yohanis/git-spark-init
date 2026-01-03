import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection } from "./ConfigDetailLayout";
import { Badge } from "@/components/ui/badge";

const mockData = {
  serviceName: "Reward Account",
  description: "Reward account configuration for campaign payouts",
  status: "ACTIVE" as const,
  summary: {
    configurationName: "REWARD_ACC_MAIN",
    versionId: "v1.5.3",
    environment: "PROD",
    status: "ACTIVE" as const,
    createdBy: "System Admin",
    lastUpdated: "2024-01-11 11:00",
  },
  audit: {
    createdBy: "System Admin",
    createdDate: "2023-02-28 08:00:00",
    lastUpdatedBy: "System Admin",
    lastUpdatedDate: "2024-01-11 11:00:00",
  },
  config: {
    account: {
      rewardAccountId: "RWD-ACC-001",
      accountName: "Primary Reward Pool",
      currency: "KES",
    },
    balance: {
      minimumBalanceThreshold: 100000,
      autoDisableOnLowBalance: true,
    },
    usage: {
      assignedCampaigns: ["Holiday Promo 2024", "New User Welcome", "Loyalty Bonus Q1"],
      lastUsedDate: "2024-01-10 15:30:00",
    },
  },
};

export default function RewardAccountDetail() {
  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = () => {
    toast.error("Cannot delete active configuration");
  };

  return (
    <ConfigDetailLayout
      serviceName={mockData.serviceName}
      description={mockData.description}
      status={mockData.status}
      summary={mockData.summary}
      audit={mockData.audit}
      onEdit={handleEdit}
      onDelete={handleDelete}
    >
      <div className="space-y-6">
        <DetailSection title="Account Info">
          <DetailField label="Reward Account ID" value={mockData.config.account.rewardAccountId} />
          <DetailField label="Account Name" value={mockData.config.account.accountName} />
          <DetailField label="Currency" value={mockData.config.account.currency} />
        </DetailSection>

        <DetailSection title="Balance Rules">
          <DetailField label="Minimum Balance Threshold" value={`${mockData.config.balance.minimumBalanceThreshold.toLocaleString()} KES`} />
          <DetailField label="Auto-disable on Low Balance" value={mockData.config.balance.autoDisableOnLowBalance} />
        </DetailSection>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Usage</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Assigned Campaigns</p>
              <div className="flex flex-wrap gap-2">
                {mockData.config.usage.assignedCampaigns.map((campaign) => (
                  <Badge key={campaign} variant="secondary">{campaign}</Badge>
                ))}
              </div>
            </div>
            <DetailField label="Last Used Date" value={mockData.config.usage.lastUsedDate} />
          </div>
        </div>
      </div>
    </ConfigDetailLayout>
  );
}
