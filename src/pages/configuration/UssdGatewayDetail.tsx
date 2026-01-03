import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection } from "./ConfigDetailLayout";

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
    connection: {
      gatewayUrl: "https://ussd.safaricom.co.ke/api/v1",
      timeout: 30000,
      sessionTimeout: 180000,
    },
    ussdRules: {
      maxSessionDepth: 10,
      concurrentSessions: 5000,
    },
  },
};

export default function UssdGatewayDetail() {
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
        <DetailSection title="Gateway Info">
          <DetailField label="Gateway Name" value={mockData.config.gateway.gatewayName} />
          <DetailField label="Short Code" value={mockData.config.gateway.shortCode} />
          <DetailField label="Environment" value={mockData.config.gateway.environment} />
        </DetailSection>

        <DetailSection title="Connection">
          <DetailField label="Gateway URL" value={mockData.config.connection.gatewayUrl} />
          <DetailField label="Timeout" value={`${mockData.config.connection.timeout}ms`} />
          <DetailField label="Session Timeout" value={`${mockData.config.connection.sessionTimeout}ms`} />
        </DetailSection>

        <DetailSection title="USSD Rules">
          <DetailField label="Max Session Depth" value={mockData.config.ussdRules.maxSessionDepth} />
          <DetailField label="Concurrent Sessions" value={mockData.config.ussdRules.concurrentSessions.toLocaleString()} />
        </DetailSection>
      </div>
    </ConfigDetailLayout>
  );
}
