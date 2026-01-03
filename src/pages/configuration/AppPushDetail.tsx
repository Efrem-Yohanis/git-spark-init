import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection } from "./ConfigDetailLayout";

const mockData = {
  serviceName: "App Push",
  description: "Push notification service configuration",
  status: "ACTIVE" as const,
  summary: {
    configurationName: "APP_PUSH_FCM_PROD",
    versionId: "v2.0.0",
    environment: "PROD",
    status: "ACTIVE" as const,
    createdBy: "John K.",
    lastUpdated: "2024-01-12 16:45",
  },
  audit: {
    createdBy: "John K.",
    createdDate: "2023-08-05 10:15:00",
    lastUpdatedBy: "John K.",
    lastUpdatedDate: "2024-01-12 16:45:00",
  },
  config: {
    provider: {
      pushProvider: "FCM",
      appName: "M-Pesa App",
      platform: "Android / iOS",
    },
    authentication: {
      apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
      appId: "com.safaricom.mpesa",
    },
    delivery: {
      retryCount: 3,
      ttl: 86400,
    },
  },
};

export default function AppPushDetail() {
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
        <DetailSection title="Provider">
          <DetailField label="Push Provider" value={mockData.config.provider.pushProvider} />
          <DetailField label="App Name" value={mockData.config.provider.appName} />
          <DetailField label="Platform" value={mockData.config.provider.platform} />
        </DetailSection>

        <DetailSection title="Authentication">
          <DetailField label="API Key" value={mockData.config.authentication.apiKey} masked />
          <DetailField label="App ID" value={mockData.config.authentication.appId} />
        </DetailSection>

        <DetailSection title="Delivery Settings">
          <DetailField label="Retry Count" value={mockData.config.delivery.retryCount} />
          <DetailField label="TTL (Time to live)" value={`${mockData.config.delivery.ttl} seconds`} />
        </DetailSection>
      </div>
    </ConfigDetailLayout>
  );
}
