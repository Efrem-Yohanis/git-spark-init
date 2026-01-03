import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection } from "./ConfigDetailLayout";

const mockData = {
  serviceName: "SMSC",
  description: "Short Message Service Center for SMS delivery",
  status: "ACTIVE" as const,
  summary: {
    configurationName: "SMSC_PROD_PRIMARY",
    versionId: "v1.8.0",
    environment: "PROD",
    status: "ACTIVE" as const,
    createdBy: "System Admin",
    lastUpdated: "2024-01-14 14:20",
  },
  audit: {
    createdBy: "System Admin",
    createdDate: "2023-03-10 11:00:00",
    lastUpdatedBy: "System Admin",
    lastUpdatedDate: "2024-01-14 14:20:00",
  },
  config: {
    provider: {
      smsProviderName: "Safaricom SMS Gateway",
      environment: "PROD",
    },
    connection: {
      host: "smsc.safaricom.co.ke",
      port: 2775,
      protocol: "SMPP",
    },
    authentication: {
      username: "SMS_USER_PROD",
      password: "xxxxxxxxxxxxxxxx",
      senderId: "MPESA",
    },
    limits: {
      tps: 500,
      dailyQuota: 1000000,
    },
  },
};

export default function SmscDetail() {
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
        <DetailSection title="Provider Info">
          <DetailField label="SMS Provider Name" value={mockData.config.provider.smsProviderName} />
          <DetailField label="Environment" value={mockData.config.provider.environment} />
        </DetailSection>

        <DetailSection title="Connection">
          <DetailField label="Host" value={mockData.config.connection.host} />
          <DetailField label="Port" value={mockData.config.connection.port} />
          <DetailField label="Protocol" value={mockData.config.connection.protocol} />
        </DetailSection>

        <DetailSection title="Authentication">
          <DetailField label="Username" value={mockData.config.authentication.username} />
          <DetailField label="Password" value={mockData.config.authentication.password} masked />
          <DetailField label="Sender ID" value={mockData.config.authentication.senderId} />
        </DetailSection>

        <DetailSection title="Limits">
          <DetailField label="TPS (Transactions per second)" value={mockData.config.limits.tps} />
          <DetailField label="Daily Quota" value={mockData.config.limits.dailyQuota.toLocaleString()} />
        </DetailSection>
      </div>
    </ConfigDetailLayout>
  );
}
