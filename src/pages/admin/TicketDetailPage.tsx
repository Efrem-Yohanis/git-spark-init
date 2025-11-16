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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const TicketDetailPage = () => {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [isResolution, setIsResolution] = useState(false);
  
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
    }
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
    status: "Developing",
    priority: "High",
    assignee: "John Doe",
    assigneeInitials: "JD",
    project: "E-Commerce Platform",
    projectId: "1",
    createdBy: "Sarah Miller",
    createdAt: "2024-11-01",
    updatedAt: "2024-11-15 10:30 AM",
    startDate: "2024-11-05",
    dueDate: "2024-11-20",
    estimatedHours: 24,
    labels: ["authentication", "security", "backend"],
    attachments: [
      { name: "auth-flow-diagram.png", size: "245 KB", type: "image" },
      { name: "api-specs.pdf", size: "1.2 MB", type: "pdf" }
    ],
    relatedTickets: [
      { id: "TCK-002", title: "Design login page UI", relation: "blocks" },
      { id: "TCK-005", title: "Set up email service", relation: "blocked by" }
    ],
    pullRequests: [
      { id: "#42", title: "Add login endpoint", status: "merged" },
      { id: "#45", title: "Implement JWT tokens", status: "open" }
    ],
    commits: [
      { hash: "a1b2c3d", message: "Initial auth setup", author: "JD" },
      { hash: "e4f5g6h", message: "Add password validation", author: "JD" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-[#4cc9f0] text-white";
      case "Developing": return "bg-[#4361ee] text-white";
      case "Testing": return "bg-[#f72585] text-white";
      case "Deployed": return "bg-[#4ade80] text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-500 text-white";
      case "Low": return "bg-green-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        authorInitials: "CU",
        content: newComment,
        timestamp: "Just now",
        isResolution: isResolution
      };
      setComments([...comments, comment]);
      setNewComment("");
      setIsResolution(false);
      toast.success("Comment added successfully");
    }
  };

  const totalLoggedHours = timeLogs.reduce((sum, log) => sum + log.hours, 0);
  const completedCriteria = ticket.acceptanceCriteria.filter(c => c.completed).length;
  const criteriaProgress = (completedCriteria / ticket.acceptanceCriteria.length) * 100;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/admin-site/projects" className="hover:text-foreground">Projects</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/admin-site/projects/${ticket.projectId}`} className="hover:text-foreground">
            {ticket.project}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/admin-site/tickets" className="hover:text-foreground">Tickets</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{ticket.id}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">{ticket.id}</Badge>
              <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
              <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{ticket.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Select defaultValue={ticket.status}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Developing">Developing</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Deployed">Deployed</SelectItem>
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
                  <Clock className="h-4 w-4 mr-2" />
                  Log Time
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (70%) - Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Information */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {ticket.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[#4361ee] mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Acceptance Criteria */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Acceptance Criteria</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {completedCriteria} of {ticket.acceptanceCriteria.length} completed
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={criteriaProgress} className="h-2" />
              <div className="space-y-2">
                {ticket.acceptanceCriteria.map((criteria, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    {criteria.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-[#4ade80] mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <span className={criteria.completed ? "line-through text-muted-foreground" : ""}>
                      {criteria.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attachments</CardTitle>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ticket.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity & Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Activity & Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                        {comment.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        {comment.isResolution && (
                          <Badge variant="secondary" className="text-xs">Resolution</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Textarea 
                  placeholder="Add a comment or @mention team members..."
                  className="min-h-[100px]"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </Button>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isResolution}
                        onChange={(e) => setIsResolution(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-muted-foreground">Mark as resolution</span>
                    </label>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#4361ee] hover:bg-[#3f37c9]"
                    onClick={handleAddComment}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (30%) - Sidebar */}
        <div className="space-y-6">
          {/* Ticket Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Status</Label>
                <Select defaultValue={ticket.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Developing">Developing</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Deployed">Deployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Priority</Label>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Assignee</Label>
                <Select defaultValue={ticket.assigneeInitials}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JD">John Doe</SelectItem>
                    <SelectItem value="SM">Sarah Miller</SelectItem>
                    <SelectItem value="AK">Alex Kumar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Project</Label>
                <Link 
                  to={`/admin-site/projects/${ticket.projectId}`}
                  className="text-sm font-medium text-[#4361ee] hover:underline flex items-center gap-1"
                >
                  {ticket.project}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Labels</Label>
                <div className="flex flex-wrap gap-1">
                  {ticket.labels.map((label, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dates & Time Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Created</Label>
                <p className="text-sm">{ticket.createdAt}</p>
                <p className="text-xs text-muted-foreground">by {ticket.createdBy}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Last Updated</Label>
                <p className="text-sm">{ticket.updatedAt}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Start Date</Label>
                <Input type="date" defaultValue={ticket.startDate} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Due Date</Label>
                <Input type="date" defaultValue={ticket.dueDate} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Time Estimate</Label>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{totalLoggedHours}</span>
                  <span className="text-sm text-muted-foreground">/ {ticket.estimatedHours}h</span>
                </div>
                <Progress value={(totalLoggedHours / ticket.estimatedHours) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Related Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Linked Tickets</Label>
                {ticket.relatedTickets.map((related, idx) => (
                  <Link
                    key={idx}
                    to={`/admin-site/tickets/${related.id}`}
                    className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{related.id}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">{related.relation}</Badge>
                  </Link>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Pull Requests</Label>
                {ticket.pullRequests.map((pr, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{pr.id}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={pr.status === "merged" ? "bg-[#4ade80] text-white" : ""}
                    >
                      {pr.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Commits</Label>
                {ticket.commits.map((commit, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 text-xs">
                    <GitCommit className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-muted-foreground truncate">{commit.hash}</p>
                      <p className="truncate">{commit.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {["New", "Developing", "Testing", "Deployed"].map((status, idx, arr) => (
                    <div key={status} className="flex items-center gap-2 flex-1">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                          status === ticket.status
                            ? "border-[#4361ee] bg-[#4361ee] text-white"
                            : "border-muted bg-background"
                        }`}
                      >
                        {status === ticket.status ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="flex-1 h-0.5 bg-muted" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-muted-foreground">
                  <span>New</span>
                  <span>Dev</span>
                  <span>Test</span>
                  <span>Done</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Time Logs</CardTitle>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded-lg border text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{log.developer}</span>
                      <span className="text-[#4361ee] font-semibold">{log.hours}h</span>
                    </div>
                    <p className="text-muted-foreground mb-1">{log.description}</p>
                    <p className="text-muted-foreground">{log.date}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Total Hours</span>
                  <span className="text-[#4361ee]">{totalLoggedHours}h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
