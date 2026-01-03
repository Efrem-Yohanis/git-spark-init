import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection } from "./ConfigDetailLayout";

const mockData = {
  serviceName: "M-Pesa Core API",
  description: "Core payment processing API for M-Pesa integration",
  status: "ACTIVE" as const,
  summary: {
    configurationName: "MPESA_CORE_PROD",
    versionId: "v2.3.1",
    environment: "PROD",
    status: "ACTIVE" as const,
    createdBy: "System Admin",
    lastUpdated: "2024-01-15 10:30",
  },
  audit: {
    createdBy: "System Admin",
    createdDate: "2023-06-15 09:00:00",
    lastUpdatedBy: "System Admin",
    lastUpdatedDate: "2024-01-15 10:30:00",
  },
  config: {
    connection: {
      baseUrl: "https://api.safaricom.co.ke/mpesa",
      apiVersion: "v2",
      timeout: 30000,
      retryCount: 3,
    },
    authentication: {
      clientId: "MPESA_CLIENT_2024",
      clientSecret: "sk_live_xxxxxxxxxxxxx",
      tokenUrl: "https://api.safaricom.co.ke/oauth/v1/generate",
    },
    security: {
      sslEnabled: true,
      ipWhitelist: ["192.168.1.1", "10.0.0.1", "172.16.0.1"],
    },
  },
};

export default function MpesaCoreDetail() {
  const navigate = useNavigate();

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
        <DetailSection title="Connection">
          <DetailField label="Base URL" value={mockData.config.connection.baseUrl} />
          <DetailField label="API Version" value={mockData.config.connection.apiVersion} />
          <DetailField label="Timeout (ms)" value={mockData.config.connection.timeout} />
          <DetailField label="Retry Count" value={mockData.config.connection.retryCount} />
        </DetailSection>

        <DetailSection title="Authentication">
          <DetailField label="Client ID" value={mockData.config.authentication.clientId} />
          <DetailField label="Client Secret" value={mockData.config.authentication.clientSecret} masked />
          <DetailField label="Token URL" value={mockData.config.authentication.tokenUrl} />
        </DetailSection>

        <DetailSection title="Security">
          <DetailField label="SSL Enabled" value={mockData.config.security.sslEnabled} />
          <DetailField label="IP Whitelist" value={mockData.config.security.ipWhitelist} />
        </DetailSection>
      </div>
    </ConfigDetailLayout>
  );
}
