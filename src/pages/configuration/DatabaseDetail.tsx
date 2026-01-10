import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection, CustomParametersTable } from "./ConfigDetailLayout";
import { Badge } from "@/components/ui/badge";

const mockData = {
  serviceName: "Database",
  description: "Primary database connection configuration for data persistence",
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
  connections: [
    {
      id: "conn-1",
      name: "Primary Database",
      environment: "PROD" as const,
      status: "Connected" as const,
      endpoint: "db.mpesa.internal:1521",
      lastTested: "2024-01-15 10:30",
    },
    {
      id: "conn-2",
      name: "Read Replica",
      environment: "PROD" as const,
      status: "Connected" as const,
      endpoint: "db-replica.mpesa.internal:1521",
      lastTested: "2024-01-15 10:30",
    },
    {
      id: "conn-3",
      name: "UAT Database",
      environment: "UAT" as const,
      status: "Connected" as const,
      endpoint: "db-uat.mpesa.internal:1521",
      lastTested: "2024-01-14 16:00",
    },
  ],
  config: {
    database: {
      databaseType: "Oracle",
      host: "db.mpesa.internal",
      port: 1521,
      schemaName: "MPESA_PROD",
      serviceName: "MPESAPRD",
    },
    authentication: {
      username: "mpesa_app_user",
      password: "xxxxxxxxxxxx",
      authMethod: "Password",
    },
    connection: {
      poolSize: 50,
      minPoolSize: 10,
      maxPoolSize: 100,
      timeout: 30000,
      idleTimeout: 300000,
    },
    options: {
      readOnly: false,
      autoCommit: false,
      fetchSize: 1000,
      statementCacheSize: 25,
    },
  },
  customParameters: [
    { name: "oracle.jdbc.ReadTimeout", value: "60000", type: "Number" },
    { name: "connectionRetryCount", value: "3", type: "Number" },
    { name: "validateOnBorrow", value: "true", type: "Boolean" },
  ],
  health: {
    uptime: "99.99%",
    lastSuccessfulCall: "10 sec ago",
    errorRate24h: "0.01%",
  },
};

export default function DatabaseDetail() {
  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = () => {
    toast.error("Cannot delete active configuration");
  };

  const handleAddConnection = () => {
    toast.info("Add connection dialog coming soon");
  };

  const handleTestConnection = (connectionId?: string) => {
    toast.success("Database connection successful", {
      description: "Connection pool established. Query latency: 15ms",
    });
  };

  return (
    <ConfigDetailLayout
      serviceName={mockData.serviceName}
      description={mockData.description}
      status={mockData.status}
      summary={mockData.summary}
      audit={mockData.audit}
      connections={mockData.connections}
      health={mockData.health}
      serviceType="database"
      supportsMultipleConnections={true}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAddConnection={handleAddConnection}
      onTestConnection={handleTestConnection}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-3 bg-muted rounded-md">
          <span className="text-sm font-medium">Database Type:</span>
          <Badge variant="default">{mockData.config.database.databaseType}</Badge>
        </div>

        <DetailSection title="Database Connection">
          <DetailField label="Database Type" value={mockData.config.database.databaseType} />
          <DetailField label="Host" value={mockData.config.database.host} />
          <DetailField label="Port" value={mockData.config.database.port} />
          <DetailField label="Schema / DB Name" value={mockData.config.database.schemaName} />
        </DetailSection>

        <DetailSection title="Authentication">
          <DetailField label="Username" value={mockData.config.authentication.username} />
          <DetailField label="Password" value={mockData.config.authentication.password} masked />
          <DetailField label="Auth Method" value={mockData.config.authentication.authMethod} />
        </DetailSection>

        <DetailSection title="Connection Pooling">
          <DetailField label="Initial Pool Size" value={mockData.config.connection.poolSize} />
          <DetailField label="Min Pool Size" value={mockData.config.connection.minPoolSize} />
          <DetailField label="Max Pool Size" value={mockData.config.connection.maxPoolSize} />
          <DetailField label="Connection Timeout" value={`${mockData.config.connection.timeout}ms`} />
        </DetailSection>

        <DetailSection title="Connection Options">
          <DetailField label="Read-only Mode" value={mockData.config.options.readOnly} />
          <DetailField label="Auto Commit" value={mockData.config.options.autoCommit} />
          <DetailField label="Fetch Size" value={mockData.config.options.fetchSize} />
          <DetailField label="Statement Cache Size" value={mockData.config.options.statementCacheSize} />
        </DetailSection>

        <CustomParametersTable parameters={mockData.customParameters} />
      </div>
    </ConfigDetailLayout>
  );
}
