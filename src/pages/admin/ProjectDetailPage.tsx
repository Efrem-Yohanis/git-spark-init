import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Plus,
  Share2,
  Download,
  Github,
  Video,
  Link2,
  FileText,
  Calendar,
  Users,
  MoreVertical,
  Eye,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  createdAt: string;
}

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  // Mock project data
  const project = {
    id: id || "1",
    name: "E-Commerce Platform",
    description: "Full-featured online shopping platform with payment integration, user authentication, and real-time inventory management. This project includes responsive design, admin dashboard, and analytics.",
    status: "Developing",
    progress: 75,
    startDate: "2024-10-01",
    endDate: "2024-12-20",
    createdBy: "John Doe",
    createdAt: "2024-09-25",
    lastUpdated: "2024-11-15",
    githubLink: "https://github.com/example/ecommerce",
    githubBranch: "main",
    demoVideo: "https://youtube.com/watch?v=demo1",
    otherLinks: [
      { name: "Figma Design", url: "https://figma.com/design1" },
      { name: "API Documentation", url: "https://docs.example.com" }
    ],
    documents: [
      { name: "Requirements.pdf", size: "2.4 MB" },
      { name: "Architecture.pdf", size: "1.8 MB" }
    ],
    team: [
      { initials: "JD", name: "John Doe", role: "Lead Developer" },
      { initials: "SM", name: "Sarah Miller", role: "Frontend Developer" },
      { initials: "AK", name: "Alex Kumar", role: "Backend Developer" }
    ]
  };

  const [tickets] = useState<Ticket[]>([
    {
      id: "TCK-001",
      title: "Implement user authentication",
      description: "Add login and registration functionality",
      status: "Developing",
      priority: "High",
      assignee: "JD",
      dueDate: "2024-11-20",
      createdAt: "2024-11-01"
    },
    {
      id: "TCK-002",
      title: "Design payment gateway integration",
      description: "Integrate Stripe payment system",
      status: "Testing",
      priority: "Critical",
      assignee: "SM",
      dueDate: "2024-11-18",
      createdAt: "2024-11-05"
    },
    {
      id: "TCK-003",
      title: "Build product catalog page",
      description: "Create responsive product listing",
      status: "Deployed",
      priority: "Medium",
      assignee: "AK",
      dueDate: "2024-11-10",
      createdAt: "2024-10-28"
    },
    {
      id: "TCK-004",
      title: "Add shopping cart functionality",
      description: "Implement cart with localStorage",
      status: "New",
      priority: "High",
      assignee: "SM",
      dueDate: "2024-11-25",
      createdAt: "2024-11-12"
    }
  ]);

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

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || ticket.assignee === assigneeFilter;
    return matchesStatus && matchesPriority && matchesAssignee;
  });

  const ticketStats = {
    total: tickets.length,
    completed: tickets.filter(t => t.status === "Deployed").length,
    open: tickets.filter(t => t.status !== "Deployed").length,
    overdue: tickets.filter(t => new Date(t.dueDate) < new Date() && t.status !== "Deployed").length
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {project.startDate} - {project.endDate}
              </span>
              <span>Created by {project.createdBy}</span>
              <span>Last updated: {project.lastUpdated}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              size="sm"
              className="bg-[#4361ee] hover:bg-[#3f37c9]"
              onClick={() => setIsAddTicketOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ticket
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Project Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Completion</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Team Members</h4>
                <div className="space-y-2">
                  {project.team.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Links & Resources */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Links & Resources</h4>
                <div className="space-y-2">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <Github className="h-5 w-5 text-[#4361ee]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">GitHub Repository</p>
                      <p className="text-xs text-muted-foreground">Branch: {project.githubBranch}</p>
                    </div>
                  </a>

                  <a
                    href={project.demoVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <Video className="h-5 w-5 text-[#f72585]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Demo Video</p>
                      <p className="text-xs text-muted-foreground">Watch on YouTube</p>
                    </div>
                  </a>

                  {project.otherLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <Link2 className="h-5 w-5 text-[#4cc9f0]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{link.name}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Documents</h4>
                <div className="space-y-2">
                  {project.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-lg border"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold">{ticketStats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Tickets</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-[#4ade80]">{ticketStats.completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-[#4361ee]">{ticketStats.open}</p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-[#f72585]">{ticketStats.overdue}</p>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Tickets</CardTitle>
              <Badge variant="secondary">{filteredTickets.length}</Badge>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Developing">Developing</SelectItem>
                  <SelectItem value="Testing">Testing</SelectItem>
                  <SelectItem value="Deployed">Deployed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <Circle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first ticket
              </p>
              <Button
                onClick={() => setIsAddTicketOpen(true)}
                className="bg-[#4361ee] hover:bg-[#3f37c9]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/admin/tickets/${ticket.id}`}
                  className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {ticket.id}
                        </span>
                        <h4 className="font-medium">{ticket.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {ticket.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {ticket.assignee}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Ticket Dialog */}
      <Dialog open={isAddTicketOpen} onOpenChange={setIsAddTicketOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>
              Add a new ticket to {project.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-title">Title *</Label>
              <Input id="ticket-title" placeholder="Enter ticket title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea
                id="ticket-description"
                placeholder="Describe the ticket"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-assignee">Assignee *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {project.team.map((member) => (
                      <SelectItem key={member.initials} value={member.initials}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-priority">Priority</Label>
                <Select defaultValue="Medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-due">Due Date</Label>
                <Input id="ticket-due" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-hours">Estimated Hours</Label>
                <Input id="ticket-hours" type="number" placeholder="0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTicketOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#4361ee] hover:bg-[#3f37c9]"
              onClick={() => {
                toast.success("Ticket created successfully");
                setIsAddTicketOpen(false);
              }}
            >
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailPage;
