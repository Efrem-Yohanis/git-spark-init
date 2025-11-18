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
  const [newTimeHours, setNewTimeHours] = useState("");
  const [newTimeDesc, setNewTimeDesc] = useState("");
  
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

  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([
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
      "User registration with email and password",
      "User login with credentials",
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
      case "Developing": return "bg-primary/10 text-primary border-primary/20";
      case "Testing": return "bg-pink-500/10 text-pink-600 border-pink-500/20";
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

  const handleAddTimeLog = () => {
    if (!newTimeHours || !newTimeDesc.trim()) return;
    
    const timeLog: TimeLog = {
      id: String(timeLogs.length + 1),
      developer: "Current User",
      date: new Date().toISOString().split('T')[0],
      hours: parseFloat(newTimeHours),
      description: newTimeDesc
    };
    
    setTimeLogs([...timeLogs, timeLog]);
    setNewTimeHours("");
    setNewTimeDesc("");
    toast.success("Time logged successfully");
  };

  const isDueDateOverdue = new Date(ticket.dueDate) < new Date() && ticket.status !== "Deployed";

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb Card */}
      <Card>
        <CardContent className="p-4">
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
        </CardContent>
      </Card>

      {/* Ticket Header Card */}
      <Card>
        <CardContent className="p-6">
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
        </CardContent>
      </Card>

      {/* Main Content Area - Two Columns */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column (70%) - Ticket Details */}
        <div className="col-span-2 space-y-6">
          {/* Ticket Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{ticket.description}</p>
              
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Requirements</h4>
                <ul className="space-y-1.5">
                  {ticket.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Circle className="h-3 w-3 mt-1 fill-current" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-foreground">Acceptance Criteria</h4>
                <div className="space-y-2">
                  {ticket.acceptanceCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {criteria.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${criteria.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                        {criteria.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Attachments
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ticket.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size} • Uploaded {file.uploadedAt}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity & Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Activity & Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Comments Thread */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {comment.authorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        {comment.isResolution && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                            Resolution
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Add Comment Form */}
              <div className="space-y-3">
                <Label>Add Comment</Label>
                <Textarea
                  placeholder="Write your comment here... (Use @ to mention team members)"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="resolution"
                        checked={isResolution}
                        onCheckedChange={(checked) => setIsResolution(checked as boolean)}
                      />
                      <Label htmlFor="resolution" className="text-sm font-normal cursor-pointer">
                        Mark as resolution
                      </Label>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach file
                    </Button>
                  </div>
                  <Button onClick={handleAddComment}>
                    <Send className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Tracking Section */}
          <Card>
            <CardHeader>
              <CardTitle>Status Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visual Workflow */}
              <div className="flex items-center justify-between">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          index <= currentStepIndex
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        {index < currentStepIndex ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${
                        index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {step}
                      </span>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          index < currentStepIndex ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Status History Timeline */}
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Status History</h4>
                <div className="space-y-4">
                  {statusHistory.map((history, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(history.status).split(' ')[0]}`} />
                        {index < statusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={getStatusColor(history.status)}>
                            {history.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{history.changedAt}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Changed by <span className="font-medium text-foreground">{history.changedBy}</span>
                        </p>
                        {history.note && (
                          <p className="text-xs text-muted-foreground mt-1 italic">"{history.note}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Tracking Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Tracking
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{ticket.loggedHours}h</span> logged of{" "}
                  <span className="font-semibold text-foreground">{ticket.estimatedHours}h</span> estimated
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time Logs Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Developer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.developer}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.hours}h</TableCell>
                      <TableCell className="text-muted-foreground">{log.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator />

              {/* Add Time Entry Form */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-foreground">Log Time</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <Label htmlFor="hours" className="text-xs">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      placeholder="0"
                      value={newTimeHours}
                      onChange={(e) => setNewTimeHours(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor="description" className="text-xs">Description</Label>
                    <Input
                      id="description"
                      placeholder="What did you work on?"
                      value={newTimeDesc}
                      onChange={(e) => setNewTimeDesc(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button onClick={handleAddTimeLog} size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Log Time
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (30%) - Sidebar */}
        <div className="space-y-6">
          {/* Ticket Properties Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={currentStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowSteps.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Assignee
                </Label>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {ticket.assigneeInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{ticket.assignee}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Project</Label>
                <Link
                  to={`/admin-site/projects/${ticket.projectId}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {ticket.project}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-2">
                  <Tag className="h-3 w-3" />
                  Labels
                </Label>
                <div className="flex flex-wrap gap-1">
                  {ticket.labels.map((label) => (
                    <Badge key={label} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Tracking Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dates & Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium text-foreground">
                  {ticket.createdAt}
                  <span className="text-xs text-muted-foreground ml-1">by {ticket.createdBy}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-foreground">{ticket.lastUpdated}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </span>
                <span className="font-medium text-foreground">{ticket.startDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </span>
                <span className={`font-medium ${isDueDateOverdue ? 'text-red-600' : 'text-foreground'}`}>
                  {ticket.dueDate}
                  {isDueDateOverdue && (
                    <AlertCircle className="h-3 w-3 inline ml-1" />
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Hours</span>
                <span className="font-medium text-foreground">{ticket.estimatedHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Logged Hours</span>
                <span className="font-medium text-foreground">{ticket.loggedHours}h</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Items Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Related Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Linked Tickets */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Linked Tickets</Label>
                <div className="space-y-1.5">
                  {ticket.relatedTickets.map((related) => (
                    <Link
                      key={related.id}
                      to={`/admin-site/tickets/${related.id}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Link2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-foreground group-hover:text-primary">{related.id}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{related.type}</Badge>
                    </Link>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Related Pull Requests */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Pull Requests</Label>
                <div className="space-y-1.5">
                  {ticket.relatedPRs.map((pr) => (
                    <div
                      key={pr.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <GitPullRequest className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{pr.id}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          pr.status === 'merged'
                            ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                            : 'bg-green-500/10 text-green-600 border-green-500/20'
                        }`}
                      >
                        {pr.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Associated Commits */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Recent Commits</Label>
                <div className="space-y-1.5">
                  {ticket.relatedCommits.map((commit) => (
                    <div
                      key={commit.hash}
                      className="flex items-start gap-2 p-2 rounded hover:bg-accent transition-colors"
                    >
                      <GitCommit className="h-3 w-3 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-muted-foreground">{commit.hash}</p>
                        <p className="text-sm text-foreground truncate">{commit.message}</p>
                      </div>
                    </div>
                  ))}
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
