import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock current approver
const currentApprover = {
  name: "Abebe Kebede",
  role: "Technology Manager",
  pendingCount: 3,
};

// Mock pending approvals for notification dropdown
const pendingApprovals = [
  { id: "camp-1", name: "Meskel Season Rewards", submittedOn: "2024-01-16" },
  { id: "camp-2", name: "Timket Loyalty Push", submittedOn: "2024-01-17" },
  { id: "camp-3", name: "New User Onboarding", submittedOn: "2024-01-18" },
];

export function ApproverHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b bg-card px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary flex items-center justify-center cursor-pointer" onClick={() => navigate("/list_comain_to_me")}>
          <span className="text-primary-foreground font-bold text-sm">MP</span>
        </div>
        <span className="font-semibold text-lg">M-Pesa Campaign Portal</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Notification Bell with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative gap-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                {currentApprover.pendingCount}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 border-b">
              <p className="font-medium text-sm">Pending Approvals</p>
            </div>
            {pendingApprovals.map((approval) => (
              <DropdownMenuItem 
                key={approval.id} 
                className="flex flex-col items-start p-3 cursor-pointer" 
                onClick={() => navigate(`/campaigns/${approval.id}/approval`)}
              >
                <span className="font-medium text-sm">{approval.name}</span>
                <span className="text-xs text-muted-foreground">Submitted: {approval.submittedOn}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary" onClick={() => navigate("/list_comain_to_me")}>
              View All Approvals
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Info with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{currentApprover.name}</span>
              <span className="text-muted-foreground text-xs">({currentApprover.role})</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
