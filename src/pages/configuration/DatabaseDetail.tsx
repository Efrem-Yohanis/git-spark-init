import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection } from "./ConfigDetailLayout";

const mockData = {
  serviceName: "Database",
  description: "Primary database connection configuration",
  status: "ACTIVE" as const,
  summary: {
    configurationName: "DB_ORACLE_PROD",
    versionId: "v4.2.0",
    environment: "PROD",
    status: "ACTIVE" as const,
    createdBy: "System Admin",
    lastUpdated: "2024-01-08 12:10",
  },
  audit: {
    createdBy: "System Admin",
    createdDate: "2022-06-01 10:00:00",
    lastUpdatedBy: "System Admin",
    lastUpdatedDate: "2024-01-08 12:10:00",
  },
  config: {
    database: {
      databaseType: "Oracle",
      host: "db.mpesa.internal",
      port: 1521,
      schemaName: "MPESA_PROD",
    },
    authentication: {
      username: "mpesa_app_user",
      password: "xxxxxxxxxxxx",
    },
    connection: {
      poolSize: 50,
      timeout: 30000,
      readOnly: false,
    },
  },
};

export default function DatabaseDetail() {
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
        <DetailSection title="Database Info">
          <DetailField label="Database Type" value={mockData.config.database.databaseType} />
          <DetailField label="Host" value={mockData.config.database.host} />
          <DetailField label="Port" value={mockData.config.database.port} />
          <DetailField label="Schema / DB Name" value={mockData.config.database.schemaName} />
        </DetailSection>

        <DetailSection title="Authentication">
          <DetailField label="Username" value={mockData.config.authentication.username} />
          <DetailField label="Password" value={mockData.config.authentication.password} masked />
        </DetailSection>

        <DetailSection title="Connection Settings">
          <DetailField label="Pool Size" value={mockData.config.connection.poolSize} />
          <DetailField label="Timeout" value={`${mockData.config.connection.timeout}ms`} />
          <DetailField label="Read-only Flag" value={mockData.config.connection.readOnly} />
        </DetailSection>
      </div>
    </ConfigDetailLayout>
  );
}
