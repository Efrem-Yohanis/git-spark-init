import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreVertical,
  MessageSquare,
  Paperclip,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Link2,
  GitPullRequest,
  GitCommit,
  ChevronRight,
  AlertCircle,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  isResolution?: boolean;
}

interface TimeLog {
  id: string;
  developer: string;
  date: string;
  hours: number;
  description: string;
}

interface StatusHistory {
  status: string;
  changedBy: string;
  changedAt: string;
  note?: string;
}

const TicketDetailPage = () => {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [isResolution, setIsResolution] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Developing");
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "John Doe",
      authorInitials: "JD",
      content: "I've started working on this. Will have an update by tomorrow.",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      author: "Sarah Miller",
      authorInitials: "SM",
      content: "Great! Let me know if you need any help with the API integration.",
      timestamp: "1 hour ago",
    }
  ]);

  const [timeLogs] = useState<TimeLog[]>([
    {
      id: "1",
      developer: "John Doe",
      date: "2024-11-15",
      hours: 4,
      description: "Initial setup and authentication flow"
    },
    {
      id: "2",
      developer: "John Doe",
      date: "2024-11-16",
      hours: 3,
      description: "Implemented registration form validation"
    },
    {
      id: "3",
      developer: "Sarah Miller",
      date: "2024-11-16",
      hours: 2,
      description: "Code review and testing"
    }
  ]);

  const [statusHistory] = useState<StatusHistory[]>([
    {
      status: "New",
      changedBy: "System",
      changedAt: "2024-11-01 10:00",
    },
    {
      status: "Developing",
      changedBy: "John Doe",
      changedAt: "2024-11-02 14:30",
      note: "Started implementation"
    },
  ]);

  const ticket = {
    id: id || "TCK-001",
    title: "Implement user authentication system",
    description: "Create a complete authentication system with login and registration functionality. This includes email/password authentication, social login options (Google, Facebook), password reset functionality, and email verification. The system should be secure, follow best practices, and provide a seamless user experience.",
    requirements: [
      "Email/password authentication",
      "Social login integration (Google, Facebook)",
      "Password reset via email",
      "Email verification for new users",
      "JWT token-based session management",
      "Role-based access control (RBAC)"
    ],
    acceptanceCriteria: [
      { text: "Users can register with email and password", completed: true },
      { text: "Users can log in with valid credentials", completed: true },
      { text: "Password reset email is sent successfully", completed: false },
      { text: "Social login works for Google", completed: false },
      { text: "Email verification is required for new accounts", completed: false },
      { text: "Sessions expire after 24 hours of inactivity", completed: true }
    ],
    status: currentStatus,
    priority: "High",
    assignee: "John Doe",
    assigneeInitials: "JD",
    project: "E-Commerce Platform",
    projectId: "1",
    createdBy: "Sarah Miller",
    createdAt: "2024-11-01",
    lastUpdated: "2024-11-16 10:30",
    startDate: "2024-11-02",
    dueDate: "2024-11-20",
    estimatedHours: 20,
    loggedHours: timeLogs.reduce((sum, log) => sum + log.hours, 0),
    labels: ["authentication", "security", "high-priority"],
    attachments: [
      { name: "auth-flow-diagram.png", size: "245 KB", uploadedAt: "2024-11-05" },
      { name: "api-spec.pdf", size: "1.2 MB", uploadedAt: "2024-11-03" }
    ],
    relatedTickets: [
      { id: "TCK-005", title: "Setup JWT middleware", type: "blocks" },
      { id: "TCK-012", title: "User profile page", type: "is blocked by" }
    ],
    relatedPRs: [
      { id: "#45", title: "Add authentication routes", status: "merged" },
      { id: "#52", title: "Implement JWT validation", status: "open" }
    ],
    relatedCommits: [
      { hash: "a3f5c2d", message: "Add login endpoint", author: "JD" },
      { hash: "b7e9f1a", message: "Implement password hashing", author: "JD" }
    ]
  };

  const workflowSteps = ["New", "Developing", "Testing", "Deployed"];
  const currentStepIndex = workflowSteps.indexOf(currentStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Developing": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Testing": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Deployed": return "bg-green-500/10 text-green-600 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "text-red-600 bg-red-500/10";
      case "High": return "text-orange-600 bg-orange-500/10";
      case "Medium": return "text-yellow-600 bg-yellow-500/10";
      case "Low": return "text-green-600 bg-green-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: String(comments.length + 1),
      author: "Current User",
      authorInitials: "CU",
      content: newComment,
      timestamp: "Just now",
      isResolution: isResolution
    };
    
    setComments([...comments, comment]);
    setNewComment("");
    setIsResolution(false);
    toast.success(isResolution ? "Resolution added" : "Comment added");
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  const isDueDateOverdue = new Date(ticket.dueDate) < new Date() && ticket.status !== "Deployed";

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/admin-site/projects" className="hover:text-foreground transition-colors">
          Projects
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/admin-site/projects/${ticket.projectId}`} className="hover:text-foreground transition-colors">
          {ticket.project}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/admin-site/tickets" className="hover:text-foreground transition-colors">
          Tickets
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{ticket.title}</span>
      </div>

      {/* Ticket Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{ticket.title}</h1>
              <Badge variant="outline" className="text-sm">{ticket.id}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Ticket
            </Button>
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workflowSteps.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <Separator className="my-1" />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two Columns */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column (70%) - Ticket Details */}
        <div className="col-span-2 space-y-6">
          {/* ... keep existing code (all ticket details cards) */}
        </div>

        {/* Right Column (30%) - Sidebar */}
        <div className="space-y-6">
          {/* ... keep existing code (all sidebar cards) */}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
