import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Shield, Plus, X, Check, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock user data
const mockUser = {
  id: "1",
  name: "Abebe Kebede",
  email: "abebe.k@mpesa.et",
  roles: ["Admin", "Super User"],
};

const allRoles = [
  { 
    id: "admin", 
    name: "Admin", 
    description: "Full system access including user management, system configuration, and all operations",
    permissions: ["User Management", "System Config", "All Campaigns", "All Reports", "Financial Access"]
  },
  { 
    id: "super_user", 
    name: "Super User", 
    description: "Advanced access to most features without admin-level controls",
    permissions: ["All Campaigns", "All Segments", "All Reports", "Reward Management"]
  },
  { 
    id: "marketing", 
    name: "Marketing", 
    description: "Campaign creation, segment management, and marketing analytics",
    permissions: ["Create Campaigns", "Manage Segments", "Marketing Reports", "Customer Insights"]
  },
  { 
    id: "operations", 
    name: "Operations", 
    description: "Day-to-day operational tasks and monitoring",
    permissions: ["View Campaigns", "Monitor Performance", "Operational Reports", "Issue Management"]
  },
  { 
    id: "finance", 
    name: "Finance", 
    description: "Financial reports, reward budgets, and transaction oversight",
    permissions: ["Financial Reports", "Reward Budgets", "Transaction Logs", "Cost Analysis"]
  },
  { 
    id: "viewer", 
    name: "Viewer", 
    description: "Read-only access to dashboards and basic reports",
    permissions: ["View Dashboard", "View Reports", "View Campaigns"]
  },
];

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

export default function ManageRoles() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userRoles, setUserRoles] = useState(mockUser.roles);
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roleToRevoke, setRoleToRevoke] = useState<string>("");

  const availableRoles = allRoles.filter(role => !userRoles.includes(role.name));

  const handleAddRole = () => {
    if (selectedRole) {
      const roleToAdd = allRoles.find(r => r.id === selectedRole);
      if (roleToAdd) {
        setUserRoles([...userRoles, roleToAdd.name]);
        toast.success(`${roleToAdd.name} role assigned to ${mockUser.name}`);
        setAddRoleDialogOpen(false);
        setSelectedRole("");
      }
    }
  };

  const handleRevokeRole = () => {
    if (roleToRevoke) {
      if (userRoles.length === 1) {
        toast.error("User must have at least one role");
        return;
      }
      setUserRoles(userRoles.filter(r => r !== roleToRevoke));
      toast.success(`${roleToRevoke} role revoked from ${mockUser.name}`);
      setRevokeDialogOpen(false);
      setRoleToRevoke("");
    }
  };

  const openRevokeDialog = (role: string) => {
    setRoleToRevoke(role);
    setRevokeDialogOpen(true);
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
          <div>
            <h1 className="text-2xl font-bold">Manage User Roles</h1>
            <p className="text-muted-foreground">Assign or revoke roles for {mockUser.name}</p>
          </div>
        </div>
        <Button 
          onClick={() => setAddRoleDialogOpen(true)}
          disabled={availableRoles.length === 0}
          className="gap-2 rounded-none"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </Button>
      </div>

      {/* User Info Card */}
      <Card className="rounded-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {mockUser.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <p className="font-semibold text-lg">{mockUser.name}</p>
              <p className="text-muted-foreground">{mockUser.email}</p>
            </div>
            <div className="ml-auto flex gap-2">
              {userRoles.map(role => (
                <Badge key={role} variant="outline" className={cn("rounded-none", getRoleColor(role))}>
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Roles */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Assigned Roles ({userRoles.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userRoles.map(roleName => {
            const roleData = allRoles.find(r => r.name === roleName);
            return (
              <Card key={roleName} className="rounded-none">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-none", getRoleColor(roleName))}>
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{roleName}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {roleData?.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => openRevokeDialog(roleName)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {roleData?.permissions.map(perm => (
                      <Badge key={perm} variant="secondary" className="text-xs rounded-none">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Available Roles */}
      {availableRoles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRoles.map(role => (
              <Card key={role.id} className="rounded-none border-dashed opacity-60 hover:opacity-100 transition-opacity">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-none bg-muted")}>
                        <Shield className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {role.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none gap-1"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setAddRoleDialogOpen(true);
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Role Dialog */}
      <Dialog open={addRoleDialogOpen} onOpenChange={setAddRoleDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription>
              Select a role to assign to {mockUser.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {role.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && (
              <div className="mt-4 p-3 bg-muted rounded-none">
                <p className="text-sm font-medium mb-2">
                  {allRoles.find(r => r.id === selectedRole)?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {allRoles.find(r => r.id === selectedRole)?.description}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRoleDialogOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button onClick={handleAddRole} disabled={!selectedRole} className="rounded-none gap-2">
              <Check className="w-4 h-4" />
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Role Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Revoke Role
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke the <span className="font-semibold">{roleToRevoke}</span> role from {mockUser.name}?
              This will remove their access to associated permissions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeRole} className="rounded-none">
              Revoke Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
