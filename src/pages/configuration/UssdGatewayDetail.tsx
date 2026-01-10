import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection, CustomParametersTable } from "./ConfigDetailLayout";

const mockData = {
  serviceName: "USSD Gateway",
  description: "USSD gateway configuration for interactive sessions",
  status: "ACTIVE" as const,
  summary: {
    configurationName: "USSD_GW_PROD",
    versionId: "v3.1.2",
    environment: "PROD",
    status: "ACTIVE" as const,
    createdBy: "System Admin",
    lastUpdated: "2024-01-13 09:15",
  },
  audit: {
    createdBy: "System Admin",
    createdDate: "2023-01-20 14:30:00",
    lastUpdatedBy: "System Admin",
    lastUpdatedDate: "2024-01-13 09:15:00",
  },
  config: {
    gateway: {
      gatewayName: "Safaricom USSD Gateway",
      shortCode: "*234#",
      environment: "PROD",
    },
    endpoint: {
      gatewayUrl: "https://ussd.safaricom.co.ke/api/v1",
      port: 443,
      protocol: "HTTPS",
      timeout: 30000,
    },
    session: {
      sessionTimeout: 180000,
      maxSessionDepth: 10,
      sessionCacheEnabled: true,
    },
    callbacks: {
      initiationCallback: "https://api.mpesa.co.ke/ussd/initiate",
      responseCallback: "https://api.mpesa.co.ke/ussd/response",
      timeoutCallback: "https://api.mpesa.co.ke/ussd/timeout",
    },
    ussdRules: {
      concurrentSessions: 5000,
      maxInputLength: 160,
      defaultLanguage: "English",
    },
  },
  customParameters: [
    { name: "serviceCode", value: "*234#", type: "String" },
    { name: "menuTimeout", value: "30", type: "Number" },
    { name: "inputValidation", value: "true", type: "Boolean" },
  ],
  health: {
    uptime: "99.9%",
    lastSuccessfulCall: "45 sec ago",
    errorRate24h: "0.1%",
  },
};

export default function UssdGatewayDetail() {
  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = () => {
    toast.error("Cannot delete active configuration");
  };

  const handleTestConnection = () => {
    toast.success("USSD Gateway connection successful", {
      description: "Session established. Response time: 85ms",
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
      serviceType="ussd"
      supportsMultipleConnections={false}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTestConnection={handleTestConnection}
    >
      <div className="space-y-6">
        <DetailSection title="Gateway Info">
          <DetailField label="Gateway Name" value={mockData.config.gateway.gatewayName} />
          <DetailField label="Short Code" value={mockData.config.gateway.shortCode} />
          <DetailField label="Environment" value={mockData.config.gateway.environment} />
        </DetailSection>

        <DetailSection title="Endpoint Configuration">
          <DetailField label="Gateway URL" value={mockData.config.endpoint.gatewayUrl} />
          <DetailField label="Port" value={mockData.config.endpoint.port} />
          <DetailField label="Protocol" value={mockData.config.endpoint.protocol} />
          <DetailField label="Timeout" value={`${mockData.config.endpoint.timeout}ms`} />
        </DetailSection>

        <DetailSection title="Session Settings">
          <DetailField label="Session Timeout" value={`${mockData.config.session.sessionTimeout}ms`} />
          <DetailField label="Max Session Depth" value={mockData.config.session.maxSessionDepth} />
          <DetailField label="Session Cache Enabled" value={mockData.config.session.sessionCacheEnabled} />
        </DetailSection>

        <DetailSection title="Callback URLs">
          <DetailField label="Initiation Callback" value={mockData.config.callbacks.initiationCallback} />
          <DetailField label="Response Callback" value={mockData.config.callbacks.responseCallback} />
          <DetailField label="Timeout Callback" value={mockData.config.callbacks.timeoutCallback} />
        </DetailSection>

        <DetailSection title="USSD Rules">
          <DetailField label="Concurrent Sessions" value={mockData.config.ussdRules.concurrentSessions.toLocaleString()} />
          <DetailField label="Max Input Length" value={mockData.config.ussdRules.maxInputLength} />
          <DetailField label="Default Language" value={mockData.config.ussdRules.defaultLanguage} />
        </DetailSection>

        <CustomParametersTable parameters={mockData.customParameters} />
      </div>
    </ConfigDetailLayout>
  );
}
