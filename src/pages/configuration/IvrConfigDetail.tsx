import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection } from "./ConfigDetailLayout";

const mockData = {
  serviceName: "IVR Config",
  description: "Interactive Voice Response system configuration",
  status: "ACTIVE" as const,
  summary: {
    configurationName: "IVR_MAIN_PROD",
    versionId: "v1.0.1",
    environment: "PROD",
    status: "ACTIVE" as const,
    createdBy: "System Admin",
    lastUpdated: "2024-01-09 15:20",
  },
  audit: {
    createdBy: "System Admin",
    createdDate: "2023-09-01 12:00:00",
    lastUpdatedBy: "System Admin",
    lastUpdatedDate: "2024-01-09 15:20:00",
  },
  config: {
    provider: {
      ivrProviderName: "Twilio IVR",
      environment: "PROD",
    },
    callFlow: {
      callbackUrl: "https://api.mpesa.co.ke/ivr/callback",
      defaultLanguage: "English",
      maxRetries: 3,
    },
    timing: {
      callTimeout: 60000,
      retryInterval: 300000,
    },
  },
};

export default function IvrConfigDetail() {
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
          <DetailField label="IVR Provider Name" value={mockData.config.provider.ivrProviderName} />
          <DetailField label="Environment" value={mockData.config.provider.environment} />
        </DetailSection>

        <DetailSection title="Call Flow">
          <DetailField label="Callback URL" value={mockData.config.callFlow.callbackUrl} />
          <DetailField label="Default Language" value={mockData.config.callFlow.defaultLanguage} />
          <DetailField label="Max Retries" value={mockData.config.callFlow.maxRetries} />
        </DetailSection>

        <DetailSection title="Timing">
          <DetailField label="Call Timeout" value={`${mockData.config.timing.callTimeout}ms`} />
          <DetailField label="Retry Interval" value={`${mockData.config.timing.retryInterval}ms`} />
        </DetailSection>
      </div>
    </ConfigDetailLayout>
  );
}
