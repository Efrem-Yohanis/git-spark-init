import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  AlertCircle,
  Clock,
  User
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface Ticket {
  id: string;
  title: string;
  project: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate: string;
  estimatedHours: number;
}

const TicketsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [tickets] = useState<Ticket[]>([
    {
      id: "TK-001",
      title: "Implement user authentication",
      project: "E-Commerce Platform",
      assignee: "John Doe",
      status: "Developing",
      priority: "High",
      dueDate: "2024-12-01",
      estimatedHours: 16
    },
    {
      id: "TK-002",
      title: "Fix payment gateway bug",
      project: "E-Commerce Platform",
      assignee: "Sarah Miller",
      status: "Testing",
      priority: "Critical",
      dueDate: "2024-11-28",
      estimatedHours: 8
    },
    {
      id: "TK-003",
      title: "Design dashboard mockups",
      project: "Analytics Platform",
      assignee: "Alex Kumar",
      status: "New",
      priority: "Medium",
      dueDate: "2024-12-05",
      estimatedHours: 12
    },
    {
      id: "TK-004",
      title: "Setup CI/CD pipeline",
      project: "Mobile Banking App",
      assignee: "Robert King",
      status: "Deployed",
      priority: "Low",
      dueDate: "2024-11-25",
      estimatedHours: 20
    },
    {
      id: "TK-005",
      title: "Implement real-time notifications",
      project: "CRM Dashboard",
      assignee: "Linda Martinez",
      status: "Developing",
      priority: "High",
      dueDate: "2024-12-03",
      estimatedHours: 14
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
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = [
    { label: "Total Tickets", value: tickets.length, color: "#4361ee" },
    { label: "In Progress", value: tickets.filter(t => t.status === "Developing").length, color: "#4361ee" },
    { label: "Testing", value: tickets.filter(t => t.status === "Testing").length, color: "#f72585" },
    { label: "Completed", value: tickets.filter(t => t.status === "Deployed").length, color: "#4ade80" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-4">
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-3xl font-bold mt-2" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
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
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
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
        </div>
        <Button className="bg-[#4361ee] hover:bg-[#3f37c9]">
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Tickets Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-muted/50">
                <TableCell className="font-mono font-semibold">
                  {ticket.id}
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="font-medium">{ticket.title}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {ticket.project}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                        {ticket.assignee.split(' ').map(n => n[0]).join('')}
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
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {ticket.dueDate}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {ticket.estimatedHours}h
                </TableCell>
                <TableCell>
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
    </div>
  );
};

export default TicketsPage;
