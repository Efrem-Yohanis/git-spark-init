import { toast } from "sonner";
import { ConfigDetailLayout, DetailField, DetailSection, CustomParametersTable } from "./ConfigDetailLayout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mockData = {
  serviceName: "App Push",
  description: "Push notification service configuration for mobile applications",
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
    endpoint: {
      fcmUrl: "https://fcm.googleapis.com/fcm/send",
      apnsUrl: "https://api.push.apple.com",
      timeout: 30000,
    },
    authentication: {
      apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
      projectId: "mpesa-app-prod",
      appId: "com.safaricom.mpesa",
      serviceAccountKey: "service-account.json",
    },
    delivery: {
      retryCount: 3,
      ttl: 86400,
      priority: "high",
      collapseKey: "mpesa_notification",
    },
    platforms: [
      { name: "Android", bundleId: "com.safaricom.mpesa", status: "Active" },
      { name: "iOS", bundleId: "com.safaricom.mpesa", status: "Active" },
      { name: "Web", bundleId: "web.mpesa.co.ke", status: "Inactive" },
    ],
  },
  customParameters: [
    { name: "analyticsEnabled", value: "true", type: "Boolean" },
    { name: "silentPushEnabled", value: "true", type: "Boolean" },
    { name: "badgeCount", value: "auto", type: "String" },
  ],
  health: {
    uptime: "99.6%",
    lastSuccessfulCall: "2 min ago",
    errorRate24h: "0.4%",
  },
};

export default function AppPushDetail() {
  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = () => {
    toast.error("Cannot delete active configuration");
  };

  const handleTestConnection = () => {
    toast.success("Push notification test successful", {
      description: "Test notification sent to registered devices",
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
      serviceType="push"
      supportsMultipleConnections={false}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onTestConnection={handleTestConnection}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-3 bg-muted rounded-md">
          <span className="text-sm font-medium">Push Provider:</span>
          <Badge variant="default">{mockData.config.provider.pushProvider}</Badge>
          <span className="text-sm text-muted-foreground">Firebase Cloud Messaging</span>
        </div>

        <DetailSection title="Provider Configuration">
          <DetailField label="Push Provider" value={mockData.config.provider.pushProvider} />
          <DetailField label="App Name" value={mockData.config.provider.appName} />
          <DetailField label="Platform" value={mockData.config.provider.platform} />
        </DetailSection>

        <DetailSection title="Endpoint Configuration">
          <DetailField label="FCM URL" value={mockData.config.endpoint.fcmUrl} />
          <DetailField label="APNs URL" value={mockData.config.endpoint.apnsUrl} />
          <DetailField label="Timeout" value={`${mockData.config.endpoint.timeout}ms`} />
        </DetailSection>

        <DetailSection title="Authentication">
          <DetailField label="API Key" value={mockData.config.authentication.apiKey} masked />
          <DetailField label="Project ID" value={mockData.config.authentication.projectId} />
          <DetailField label="App ID / Bundle ID" value={mockData.config.authentication.appId} />
          <DetailField label="Service Account Key" value={mockData.config.authentication.serviceAccountKey} />
        </DetailSection>

        <DetailSection title="Delivery Settings">
          <DetailField label="Retry Count" value={mockData.config.delivery.retryCount} />
          <DetailField label="TTL (Time to Live)" value={`${mockData.config.delivery.ttl} seconds`} />
          <DetailField label="Priority" value={mockData.config.delivery.priority} />
          <DetailField label="Collapse Key" value={mockData.config.delivery.collapseKey} />
        </DetailSection>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Platform Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mockData.config.platforms.map((p, idx) => (
              <div key={idx} className="p-3 border rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{p.name}</p>
                  <Badge variant="outline" className={p.status === "Active" ? "bg-success/10 text-success" : "bg-muted"}>
                    {p.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{p.bundleId}</p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
        </div>

        <CustomParametersTable parameters={mockData.customParameters} />
      </div>
    </ConfigDetailLayout>
  );
}
