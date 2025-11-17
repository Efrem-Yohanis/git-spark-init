import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  AlertCircle,
  Clock,
  LayoutGrid,
  List,
  ChevronDown,
  Calendar as CalendarIcon,
  Eye
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface Ticket {
  id: string;
  title: string;
  description: string;
  project: string;
  projectId: string;
  assignee: string;
  assigneeAvatar: string;
  status: string;
  priority: string;
  dueDate: string;
  estimatedHours: number;
  createdDate: string;
}

const TicketsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  const [tickets] = useState<Ticket[]>([
    {
      id: "TK-001",
      title: "Implement user authentication",
      description: "Add JWT-based authentication with email/password",
      project: "E-Commerce Platform",
      projectId: "1",
      assignee: "John Doe",
      assigneeAvatar: "JD",
      status: "Developing",
      priority: "High",
      dueDate: "2024-12-01",
      estimatedHours: 16,
      createdDate: "2024-11-15"
    },
    {
      id: "TK-002",
      title: "Fix payment gateway bug",
      description: "Payment confirmation not working correctly",
      project: "E-Commerce Platform",
      projectId: "1",
      assignee: "Sarah Miller",
      assigneeAvatar: "SM",
      status: "Testing",
      priority: "Critical",
      dueDate: "2024-11-28",
      estimatedHours: 8,
      createdDate: "2024-11-10"
    },
    {
      id: "TK-003",
      title: "Design dashboard mockups",
      description: "Create high-fidelity mockups for analytics dashboard",
      project: "Analytics Platform",
      projectId: "4",
      assignee: "Alex Kumar",
      assigneeAvatar: "AK",
      status: "New",
      priority: "Medium",
      dueDate: "2024-12-05",
      estimatedHours: 12,
      createdDate: "2024-11-18"
    },
    {
      id: "TK-004",
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for automated deployment",
      project: "Mobile Banking App",
      projectId: "2",
      assignee: "Robert King",
      assigneeAvatar: "RK",
      status: "Deployed",
      priority: "Low",
      dueDate: "2024-11-25",
      estimatedHours: 20,
      createdDate: "2024-11-05"
    },
    {
      id: "TK-005",
      title: "Implement real-time notifications",
      description: "Add WebSocket support for live notifications",
      project: "CRM Dashboard",
      projectId: "3",
      assignee: "Linda Martinez",
      assigneeAvatar: "LM",
      status: "Developing",
      priority: "High",
      dueDate: "2024-12-03",
      estimatedHours: 14,
      createdDate: "2024-11-12"
    },
    {
      id: "TK-006",
      title: "Database performance optimization",
      description: "Optimize slow queries and add proper indexing",
      project: "E-Commerce Platform",
      projectId: "1",
      assignee: "Tom Sanders",
      assigneeAvatar: "TS",
      status: "New",
      priority: "Medium",
      dueDate: "2024-12-10",
      estimatedHours: 10,
      createdDate: "2024-11-20"
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Critical":
      case "High":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === "all" || ticket.assignee === assigneeFilter;
    const matchesProject = projectFilter === "all" || ticket.project === projectFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesProject;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    }
  });

  const stats = [
    { label: "Total Tickets", value: tickets.length, color: "#4361ee" },
    { label: "Open", value: tickets.filter(t => t.status !== "Deployed").length, color: "#3f37c9" },
    { label: "In Progress", value: tickets.filter(t => t.status === "Developing" || t.status === "Testing").length, color: "#4cc9f0" },
    { label: "Completed", value: tickets.filter(t => t.status === "Deployed").length, color: "#4ade80" },
  ];

  const uniqueAssignees = Array.from(new Set(tickets.map(t => t.assignee)));
  const uniqueProjects = Array.from(new Set(tickets.map(t => t.project)));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(sortedTickets.map(t => t.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId]);
    } else {
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground mt-1">Track and manage development tickets</p>
        </div>
        <Button onClick={() => navigate('/admin-site/tickets/new')}>
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <div 
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tickets by title, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "table" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "cards" ? "default" : "outline"} 
              size="icon"
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
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
            <SelectTrigger className="w-[160px]">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {uniqueAssignees.map(assignee => (
                <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map(project => (
                <SelectItem key={project} value={project}>{project}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort: {sortBy}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("recent")}>Recent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("priority")}>Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("dueDate")}>Due Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedTickets.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedTickets.length})
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Change Status</DropdownMenuItem>
                <DropdownMenuItem>Assign To</DropdownMenuItem>
                <DropdownMenuItem>Change Priority</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete Selected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Tickets View */}
      {sortedTickets.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No tickets found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or create a new ticket</p>
            </div>
            <Button onClick={() => navigate('/admin-site/tickets/new')}>
              <Plus className="h-4 w-4" />
              Create First Ticket
            </Button>
          </div>
        </Card>
      ) : viewMode === "table" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedTickets.length === sortedTickets.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/admin-site/tickets/${ticket.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedTickets.includes(ticket.id)}
                      onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {ticket.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{ticket.project}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                          {ticket.assigneeAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {getPriorityIcon(ticket.priority)}
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-sm ${isOverdue(ticket.dueDate) ? 'text-red-500 font-semibold' : ''}`}>
                        {ticket.dueDate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/admin-site/tickets/${ticket.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTickets.map((ticket) => (
            <Card 
              key={ticket.id}
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/admin-site/tickets/${ticket.id}`)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={selectedTickets.includes(ticket.id)}
                      onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                  </div>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {getPriorityIcon(ticket.priority)}
                    {ticket.priority}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold line-clamp-1">{ticket.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {ticket.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate">{ticket.project}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                        {ticket.assigneeAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{ticket.assignee}</span>
                  </div>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{ticket.estimatedHours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span className={isOverdue(ticket.dueDate) ? 'text-red-500 font-semibold' : ''}>
                      {ticket.dueDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
