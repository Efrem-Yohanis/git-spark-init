import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Check, X, Edit2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const roles = ["Admin", "Super User", "Marketing", "Operations", "Finance", "Viewer"];

const permissionCategories = [
  {
    name: "User Management",
    permissions: [
      { id: "view_users", name: "View Users" },
      { id: "create_users", name: "Create Users" },
      { id: "edit_users", name: "Edit Users" },
      { id: "delete_users", name: "Delete Users" },
      { id: "manage_roles", name: "Manage Roles" },
    ]
  },
  {
    name: "Campaigns",
    permissions: [
      { id: "view_campaigns", name: "View Campaigns" },
      { id: "create_campaigns", name: "Create Campaigns" },
      { id: "edit_campaigns", name: "Edit Campaigns" },
      { id: "delete_campaigns", name: "Delete Campaigns" },
      { id: "approve_campaigns", name: "Approve Campaigns" },
    ]
  },
  {
    name: "Segments",
    permissions: [
      { id: "view_segments", name: "View Segments" },
      { id: "create_segments", name: "Create Segments" },
      { id: "edit_segments", name: "Edit Segments" },
      { id: "delete_segments", name: "Delete Segments" },
      { id: "export_segments", name: "Export Segments" },
    ]
  },
  {
    name: "Reports",
    permissions: [
      { id: "view_reports", name: "View Reports" },
      { id: "create_reports", name: "Create Reports" },
      { id: "export_reports", name: "Export Reports" },
      { id: "schedule_reports", name: "Schedule Reports" },
    ]
  },
  {
    name: "Finance",
    permissions: [
      { id: "view_rewards", name: "View Rewards" },
      { id: "manage_rewards", name: "Manage Rewards" },
      { id: "view_budgets", name: "View Budgets" },
      { id: "manage_budgets", name: "Manage Budgets" },
    ]
  },
  {
    name: "Configuration",
    permissions: [
      { id: "view_config", name: "View Configuration" },
      { id: "edit_config", name: "Edit Configuration" },
      { id: "manage_integrations", name: "Manage Integrations" },
    ]
  },
];

// Initial permission matrix
const initialPermissions: Record<string, Record<string, boolean>> = {
  "Admin": {
    view_users: true, create_users: true, edit_users: true, delete_users: true, manage_roles: true,
    view_campaigns: true, create_campaigns: true, edit_campaigns: true, delete_campaigns: true, approve_campaigns: true,
    view_segments: true, create_segments: true, edit_segments: true, delete_segments: true, export_segments: true,
    view_reports: true, create_reports: true, export_reports: true, schedule_reports: true,
    view_rewards: true, manage_rewards: true, view_budgets: true, manage_budgets: true,
    view_config: true, edit_config: true, manage_integrations: true,
  },
  "Super User": {
    view_users: true, create_users: false, edit_users: false, delete_users: false, manage_roles: false,
    view_campaigns: true, create_campaigns: true, edit_campaigns: true, delete_campaigns: true, approve_campaigns: true,
    view_segments: true, create_segments: true, edit_segments: true, delete_segments: true, export_segments: true,
    view_reports: true, create_reports: true, export_reports: true, schedule_reports: true,
    view_rewards: true, manage_rewards: true, view_budgets: true, manage_budgets: false,
    view_config: true, edit_config: false, manage_integrations: false,
  },
  "Marketing": {
    view_users: false, create_users: false, edit_users: false, delete_users: false, manage_roles: false,
    view_campaigns: true, create_campaigns: true, edit_campaigns: true, delete_campaigns: false, approve_campaigns: false,
    view_segments: true, create_segments: true, edit_segments: true, delete_segments: false, export_segments: true,
    view_reports: true, create_reports: true, export_reports: true, schedule_reports: false,
    view_rewards: true, manage_rewards: false, view_budgets: false, manage_budgets: false,
    view_config: false, edit_config: false, manage_integrations: false,
  },
  "Operations": {
    view_users: false, create_users: false, edit_users: false, delete_users: false, manage_roles: false,
    view_campaigns: true, create_campaigns: false, edit_campaigns: false, delete_campaigns: false, approve_campaigns: false,
    view_segments: true, create_segments: false, edit_segments: false, delete_segments: false, export_segments: false,
    view_reports: true, create_reports: false, export_reports: true, schedule_reports: false,
    view_rewards: true, manage_rewards: false, view_budgets: false, manage_budgets: false,
    view_config: true, edit_config: false, manage_integrations: false,
  },
  "Finance": {
    view_users: false, create_users: false, edit_users: false, delete_users: false, manage_roles: false,
    view_campaigns: true, create_campaigns: false, edit_campaigns: false, delete_campaigns: false, approve_campaigns: false,
    view_segments: true, create_segments: false, edit_segments: false, delete_segments: false, export_segments: false,
    view_reports: true, create_reports: true, export_reports: true, schedule_reports: true,
    view_rewards: true, manage_rewards: true, view_budgets: true, manage_budgets: true,
    view_config: false, edit_config: false, manage_integrations: false,
  },
  "Viewer": {
    view_users: false, create_users: false, edit_users: false, delete_users: false, manage_roles: false,
    view_campaigns: true, create_campaigns: false, edit_campaigns: false, delete_campaigns: false, approve_campaigns: false,
    view_segments: true, create_segments: false, edit_segments: false, delete_segments: false, export_segments: false,
    view_reports: true, create_reports: false, export_reports: false, schedule_reports: false,
    view_rewards: false, manage_rewards: false, view_budgets: false, manage_budgets: false,
    view_config: false, edit_config: false, manage_integrations: false,
  },
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Super User":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "Marketing":
      return "bg-primary/10 text-primary border-primary/20";
    case "Operations":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "Finance":
      return "bg-warning/10 text-warning border-warning/20";
    case "Viewer":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function RolePermissions() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState(initialPermissions);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePermissionChange = (role: string, permissionId: string, checked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionId]: checked
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success("Role permissions updated successfully");
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/admin/users")}
            className="rounded-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-none bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Role Permissions</h1>
              <p className="text-muted-foreground">Configure permissions for each role</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setPermissions(initialPermissions);
                  setHasChanges(false);
                }}
                className="rounded-none"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="rounded-none gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="rounded-none gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Permissions
            </Button>
          )}
        </div>
      </div>

      {/* Role Legend */}
      <Card className="rounded-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium">Roles:</span>
            {roles.map(role => (
              <Badge key={role} variant="outline" className={cn("rounded-none", getRoleColor(role))}>
                {role}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card className="rounded-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold w-[200px]">Permission</TableHead>
              {roles.map(role => (
                <TableHead key={role} className="font-semibold text-center">
                  <Badge variant="outline" className={cn("rounded-none", getRoleColor(role))}>
                    {role}
                  </Badge>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionCategories.map((category, categoryIndex) => (
              <>
                <TableRow key={category.name} className="bg-muted/30">
                  <TableCell colSpan={roles.length + 1} className="font-semibold">
                    {category.name}
                  </TableCell>
                </TableRow>
                {category.permissions.map(permission => (
                  <TableRow key={permission.id} className="hover:bg-muted/20">
                    <TableCell className="text-sm">{permission.name}</TableCell>
                    {roles.map(role => (
                      <TableCell key={role} className="text-center">
                        {isEditing ? (
                          <Checkbox
                            checked={permissions[role]?.[permission.id] || false}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(role, permission.id, checked as boolean)
                            }
                            disabled={role === "Admin"} // Admin always has all permissions
                          />
                        ) : permissions[role]?.[permission.id] ? (
                          <Check className="w-4 h-4 text-success mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
