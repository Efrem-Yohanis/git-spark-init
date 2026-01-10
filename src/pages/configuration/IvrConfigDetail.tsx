import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection, CustomParametersTable } from "./ConfigDetailLayout";

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
      accountSid: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
    endpoint: {
      baseUrl: "https://api.twilio.com/2010-04-01",
      port: 443,
      protocol: "HTTPS",
    },
    callFlow: {
      callbackUrl: "https://api.mpesa.co.ke/ivr/callback",
      statusCallback: "https://api.mpesa.co.ke/ivr/status",
      defaultLanguage: "English",
      maxRetries: 3,
    },
    timing: {
      callTimeout: 60000,
      retryInterval: 300000,
      dtmfTimeout: 10000,
      speechTimeout: 5000,
    },
    voiceSettings: {
      voiceType: "neural",
      voiceName: "en-US-Neural2-D",
      speechRate: 1.0,
      pitch: 0,
    },
  },
  customParameters: [
    { name: "recordCalls", value: "true", type: "Boolean" },
    { name: "transcribeEnabled", value: "true", type: "Boolean" },
    { name: "fallbackNumber", value: "+254700000000", type: "String" },
  ],
  health: {
    uptime: "99.5%",
    lastSuccessfulCall: "10 min ago",
    errorRate24h: "0.5%",
  },
};

export default function IvrConfigDetail() {
  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = () => {
    toast.error("Cannot delete active configuration");
  };

  const handleTestConnection = () => {
    toast.success("IVR connection test successful", {
      description: "Voice endpoint responding. Latency: 200ms",
    });
  };

  return (
    <ConfigDetailLayout
      serviceName={mockData.serviceName}
      description={mockData.description}
      status={mockData.status}
      summary={mockData.summary}
      audit={mockData.audit}
      health={mockData.health}
      serviceType="ivr"
      supportsMultipleConnections={false}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTestConnection={handleTestConnection}
    >
      <div className="space-y-6">
        <DetailSection title="Provider Configuration">
          <DetailField label="IVR Provider Name" value={mockData.config.provider.ivrProviderName} />
          <DetailField label="Environment" value={mockData.config.provider.environment} />
          <DetailField label="Account SID" value={mockData.config.provider.accountSid} masked />
        </DetailSection>

        <DetailSection title="Endpoint Configuration">
          <DetailField label="Base URL" value={mockData.config.endpoint.baseUrl} />
          <DetailField label="Port" value={mockData.config.endpoint.port} />
          <DetailField label="Protocol" value={mockData.config.endpoint.protocol} />
        </DetailSection>

        <DetailSection title="Call Flow Settings">
          <DetailField label="Callback URL" value={mockData.config.callFlow.callbackUrl} />
          <DetailField label="Status Callback" value={mockData.config.callFlow.statusCallback} />
          <DetailField label="Default Language" value={mockData.config.callFlow.defaultLanguage} />
          <DetailField label="Max Retries" value={mockData.config.callFlow.maxRetries} />
        </DetailSection>

        <DetailSection title="Timing Configuration">
          <DetailField label="Call Timeout" value={`${mockData.config.timing.callTimeout}ms`} />
          <DetailField label="Retry Interval" value={`${mockData.config.timing.retryInterval}ms`} />
          <DetailField label="DTMF Timeout" value={`${mockData.config.timing.dtmfTimeout}ms`} />
          <DetailField label="Speech Timeout" value={`${mockData.config.timing.speechTimeout}ms`} />
        </DetailSection>

        <DetailSection title="Voice Settings">
          <DetailField label="Voice Type" value={mockData.config.voiceSettings.voiceType} />
          <DetailField label="Voice Name" value={mockData.config.voiceSettings.voiceName} />
          <DetailField label="Speech Rate" value={mockData.config.voiceSettings.speechRate} />
          <DetailField label="Pitch" value={mockData.config.voiceSettings.pitch} />
        </DetailSection>

        <CustomParametersTable parameters={mockData.customParameters} />
      </div>
    </ConfigDetailLayout>
  );
}
