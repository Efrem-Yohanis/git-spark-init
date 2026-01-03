import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection } from "./ConfigDetailLayout";

const mockData = {
  serviceName: "Email Service",
  description: "SMTP email service configuration",
  status: "INACTIVE" as const,
  summary: {
    configurationName: "EMAIL_SMTP_PROD",
    versionId: "v1.2.0",
    environment: "PROD",
    status: "INACTIVE" as const,
    createdBy: "Mary W.",
    lastUpdated: "2024-01-10 08:30",
  },
  audit: {
    createdBy: "Mary W.",
    createdDate: "2023-11-15 09:30:00",
    lastUpdatedBy: "Mary W.",
    lastUpdatedDate: "2024-01-10 08:30:00",
  },
  config: {
    smtp: {
      smtpHost: "smtp.safaricom.co.ke",
      port: 587,
      encryption: "TLS",
    },
    authentication: {
      username: "noreply@mpesa.co.ke",
      password: "xxxxxxxxxxxx",
    },
    emailSettings: {
      defaultSenderEmail: "noreply@mpesa.co.ke",
      senderName: "M-Pesa Notifications",
      dailySendLimit: 50000,
    },
  },
};

export default function EmailServiceDetail() {
  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = () => {
    toast.info("Delete functionality coming soon");
  };

  const handleActivate = () => {
    toast.success("Configuration activated");
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
      onActivate={handleActivate}
    >
      <div className="space-y-6">
        <DetailSection title="SMTP Info">
          <DetailField label="SMTP Host" value={mockData.config.smtp.smtpHost} />
          <DetailField label="Port" value={mockData.config.smtp.port} />
          <DetailField label="Encryption" value={mockData.config.smtp.encryption} />
        </DetailSection>

        <DetailSection title="Authentication">
          <DetailField label="Username" value={mockData.config.authentication.username} />
          <DetailField label="Password" value={mockData.config.authentication.password} masked />
        </DetailSection>

        <DetailSection title="Email Settings">
          <DetailField label="Default Sender Email" value={mockData.config.emailSettings.defaultSenderEmail} />
          <DetailField label="Sender Name" value={mockData.config.emailSettings.senderName} />
          <DetailField label="Daily Send Limit" value={mockData.config.emailSettings.dailySendLimit.toLocaleString()} />
        </DetailSection>
      </div>
    </ConfigDetailLayout>
  );
}
