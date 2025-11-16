import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ExternalLink,
  Paperclip,
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
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [expandedDescription, setExpandedDescription] = useState(false);

  // Mock project data
  const project = {
    id: id || "1",
    name: "E-Commerce Platform",
    description: "Full-featured online shopping platform with payment integration, user authentication, and real-time inventory management. This project includes responsive design, admin dashboard, and analytics. The system is built with modern technologies and follows best practices for scalability and maintainability.",
    status: "Developing",
    progress: 75,
    startDate: "2024-10-01",
    endDate: "2024-12-20",
    createdBy: "John Doe",
    createdAt: "2024-09-25",
    lastUpdated: "2024-11-15 14:30",
    githubLink: "https://github.com/example/ecommerce",
    githubBranch: "main",
    demoVideo: "https://youtube.com/watch?v=demo1",
    otherLinks: [
      { name: "Figma Design", url: "https://figma.com/design1" },
      { name: "API Documentation", url: "https://docs.example.com" }
    ],
    documents: [
      { name: "Requirements.pdf", size: "2.4 MB", uploadedAt: "2024-09-26" },
      { name: "Architecture.pdf", size: "1.8 MB", uploadedAt: "2024-09-27" }
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
      description: "Add login and registration functionality with JWT tokens",
      status: "Developing",
      priority: "High",
      assignee: "JD",
      dueDate: "2024-11-20",
      createdAt: "2024-11-01"
    },
    {
      id: "TCK-002",
      title: "Design payment gateway integration",
      description: "Integrate Stripe payment system with webhooks",
      status: "Testing",
      priority: "Critical",
      assignee: "SM",
      dueDate: "2024-11-18",
      createdAt: "2024-11-05"
    },
    {
      id: "TCK-003",
      title: "Build product catalog page",
      description: "Create responsive product listing with filters",
      status: "Deployed",
      priority: "Medium",
      assignee: "AK",
      dueDate: "2024-11-10",
      createdAt: "2024-10-28"
    },
    {
      id: "TCK-004",
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing",
      status: "New",
      priority: "Low",
      assignee: "JD",
      dueDate: "2024-11-25",
      createdAt: "2024-11-12"
    },
  ]);

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
      case "Critical": return "text-red-600";
      case "High": return "text-orange-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== "all" && ticket.status !== statusFilter) return false;
    if (priorityFilter !== "all" && ticket.priority !== priorityFilter) return false;
    if (assigneeFilter !== "all" && ticket.assignee !== assigneeFilter) return false;
    return true;
  });

  const ticketStats = {
    total: tickets.length,
    completed: tickets.filter(t => t.status === "Deployed").length,
    open: tickets.filter(t => t.status !== "Deployed").length,
    overdue: tickets.filter(t => new Date(t.dueDate) < new Date() && t.status !== "Deployed").length,
  };

  const handleAddTicket = () => {
    toast.success("Ticket created successfully");
    setIsAddTicketOpen(false);
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Project Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
              <Badge className={getStatusColor(project.status)} variant="outline">
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{project.startDate} - {project.endDate}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span>Created by {project.createdBy} on {project.createdAt}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Last updated: {project.lastUpdated}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Ticket
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
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
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Overview</h3>
                <p className="text-sm text-muted-foreground">
                  {expandedDescription 
                    ? project.description 
                    : project.description.substring(0, 150) + "..."}
                </p>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs mt-1"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                >
                  {expandedDescription ? "Show less" : "Read more"}
                </Button>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Progress Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Team Members</h4>
                <div className="space-y-2">
                  {project.team.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{ticketStats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Tickets</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <p className="text-2xl font-bold text-green-600">{ticketStats.completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <p className="text-2xl font-bold text-blue-600">{ticketStats.open}</p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <p className="text-2xl font-bold text-red-600">{ticketStats.overdue}</p>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Links & Resources */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Links & Resources</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Github className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">GitHub Repository</p>
                        <p className="text-xs text-muted-foreground truncate">{project.githubLink}</p>
                        <Badge variant="outline" className="mt-1 text-xs">Branch: {project.githubBranch}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-red-500/10">
                        <Video className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Demo Video</p>
                        <p className="text-xs text-muted-foreground truncate">{project.demoVideo}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.demoVideo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Other Links</h4>
                <div className="space-y-2">
                  {project.otherLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{link.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Documents</h4>
                <div className="space-y-2">
                  {project.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size} • {doc.uploadedAt}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
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
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9">
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
                <SelectTrigger className="w-[140px] h-9">
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

              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="JD">John Doe</SelectItem>
                  <SelectItem value="SM">Sarah Miller</SelectItem>
                  <SelectItem value="AK">Alex Kumar</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
              >
                {viewMode === "table" ? "Card View" : "Table View"}
              </Button>

              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsAddTicketOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Get started by creating your first ticket</p>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsAddTicketOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Ticket
              </Button>
            </div>
          ) : viewMode === "table" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedTickets.length === filteredTickets.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={() => handleSelectTicket(ticket.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div>
                        <Link 
                          to={`/admin-site/tickets/${ticket.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">{ticket.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {ticket.assignee}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)} variant="outline">
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <AlertCircle className={`h-4 w-4 ${getPriorityColor(ticket.priority)}`} />
                        <span className={`text-sm ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{ticket.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin-site/tickets/${ticket.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-medium">{ticket.id}</CardTitle>
                        <Link 
                          to={`/admin-site/tickets/${ticket.id}`}
                          className="text-base font-semibold hover:text-primary transition-colors"
                        >
                          {ticket.title}
                        </Link>
                      </div>
                      <Badge className={getStatusColor(ticket.status)} variant="outline">
                        {ticket.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {ticket.assignee}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className={`h-4 w-4 ${getPriorityColor(ticket.priority)}`} />
                        <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{ticket.dueDate}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin-site/tickets/${ticket.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
              Add a new ticket to this project. Fill in the required information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Ticket Title *</Label>
              <Input id="title" placeholder="Enter ticket title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the ticket..." rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JD">John Doe</SelectItem>
                    <SelectItem value="SM">Sarah Miller</SelectItem>
                    <SelectItem value="AK">Alex Kumar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTicketOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddTicket}>
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailPage;
