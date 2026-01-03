import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ConfigSummary {
  configurationName: string;
  versionId: string;
  environment: string;
  status: "ACTIVE" | "INACTIVE";
  createdBy: string;
  lastUpdated: string;
}

interface AuditInfo {
  createdBy: string;
  createdDate: string;
  lastUpdatedBy: string;
  lastUpdatedDate: string;
}

interface ConfigDetailLayoutProps {
  serviceName: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  summary: ConfigSummary;
  audit: AuditInfo;
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
}

export function ConfigDetailLayout({
  serviceName,
  description,
  status,
  summary,
  audit,
  children,
  onEdit,
  onDelete,
  onActivate,
}: ConfigDetailLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{serviceName}</h1>
            <Badge
              variant="outline"
              className={
                status === "ACTIVE"
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-muted text-muted-foreground"
              }
            >
              {status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Configuration
          </Button>
          <Button variant="outline" onClick={() => navigate("/configuration")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Configuration List
          </Button>
        </div>
      </div>

      {/* Active Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Configuration Name</p>
              <p className="font-medium">{summary.configurationName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version / ID</p>
              <p className="font-medium">{summary.versionId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>
              <Badge variant="secondary">{summary.environment}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={
                  summary.status === "ACTIVE"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {summary.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-medium">{summary.createdBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{summary.lastUpdated}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Details (Read Only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration Details</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onEdit} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              disabled={status === "ACTIVE"}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            {status === "INACTIVE" && (
              <Button variant="default" onClick={onActivate} className="gap-2">
                <Power className="w-4 h-4" />
                Activate
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate("/configuration")}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-medium">{audit.createdBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created Date</p>
              <p className="font-medium">{audit.createdDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated By</p>
              <p className="font-medium">{audit.lastUpdatedBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated Date</p>
              <p className="font-medium">{audit.lastUpdatedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: string | number | boolean | string[];
  masked?: boolean;
}

export function DetailField({ label, value, masked }: DetailFieldProps) {
  const displayValue = () => {
    if (masked && typeof value === "string") {
      return "••••••••••••";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{displayValue()}</p>
    </div>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{children}</div>
      <Separator className="my-4" />
    </div>
  );
}
