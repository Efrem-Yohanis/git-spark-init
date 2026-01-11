import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Shield, 
  Key, 
  Trash2,
  UserCheck,
  UserX,
  Filter
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockUsers = [
  { id: "1", name: "Abebe Kebede", email: "abebe.k@mpesa.et", roles: ["Admin", "Super User"], status: "Active", lastLogin: "2024-01-15 09:30", createdAt: "2023-06-10" },
  { id: "2", name: "Tigist Haile", email: "tigist.h@mpesa.et", roles: ["Marketing"], status: "Active", lastLogin: "2024-01-15 08:45", createdAt: "2023-07-22" },
  { id: "3", name: "Bekele Tadesse", email: "bekele.t@mpesa.et", roles: ["Operations", "Viewer"], status: "Active", lastLogin: "2024-01-14 16:20", createdAt: "2023-08-15" },
  { id: "4", name: "Meron Assefa", email: "meron.a@mpesa.et", roles: ["Finance"], status: "Active", lastLogin: "2024-01-15 10:00", createdAt: "2023-09-01" },
  { id: "5", name: "Dawit Gebre", email: "dawit.g@mpesa.et", roles: ["Viewer"], status: "Inactive", lastLogin: "2024-01-10 11:30", createdAt: "2023-10-05" },
  { id: "6", name: "Sara Mohammed", email: "sara.m@mpesa.et", roles: ["Marketing", "Operations"], status: "Active", lastLogin: "2024-01-15 11:00", createdAt: "2023-11-12" },
  { id: "7", name: "Yonas Tesfaye", email: "yonas.t@mpesa.et", roles: ["Finance", "Viewer"], status: "Pending", lastLogin: "-", createdAt: "2024-01-14" },
];

const allRoles = ["Admin", "Super User", "Marketing", "Operations", "Finance", "Viewer"];

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Inactive":
      return "bg-muted text-muted-foreground border-muted";
    case "Pending":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast.success(`User ${selectedUser.name} has been deleted`);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleResetPassword = () => {
    if (selectedUser) {
      toast.success(`Password reset email sent to ${selectedUser.email}`);
      setResetPasswordDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleToggleStatus = (user: typeof mockUsers[0]) => {
    setUsers(users.map(u => {
      if (u.id === user.id) {
        const newStatus = u.status === "Active" ? "Inactive" : "Active";
        return { ...u, status: newStatus };
      }
      return u;
    }));
    toast.success(`User ${user.name} status updated`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-none bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage users, roles, and access permissions</p>
          </div>
        </div>
        <Button onClick={() => navigate("/admin/users/add")} className="gap-2 rounded-none">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 rounded-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-none">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-none">
              <UserCheck className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{users.filter(u => u.status === "Active").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-none">
              <UserX className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive Users</p>
              <p className="text-2xl font-bold">{users.filter(u => u.status === "Inactive").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 rounded-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-none">
              <Shield className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin Users</p>
              <p className="text-2xl font-bold">{users.filter(u => u.roles.includes("Admin")).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-none">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-none"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px] rounded-none">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {allRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] rounded-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="rounded-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Roles</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Login</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <Badge key={role} variant="outline" className={cn("font-medium rounded-none", getRoleColor(role))}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium rounded-none", getStatusColor(user.status))}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-none">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none">
                      <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}/edit`)}>
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}/roles`)}>
                        <Shield className="w-4 h-4 mr-2" />
                        Manage Roles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedUser(user);
                        setResetPasswordDialogOpen(true);
                      }}>
                        <Key className="w-4 h-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                        {user.status === "Active" ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedUser(user);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} className="rounded-none">
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to <span className="font-semibold">{selectedUser?.email}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button onClick={handleResetPassword} className="rounded-none">
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
