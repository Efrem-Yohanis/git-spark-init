import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Archive,
  Github,
  Link as LinkIcon,
  Video,
  Calendar,
  LayoutGrid,
  List,
  ChevronDown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  githubLink: string;
  demoVideo: string;
  otherLinks: string[];
  team: string[];
  totalTickets: number;
  completedTickets: number;
  openTickets: number;
}

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "E-Commerce Platform",
      description: "Full-featured online shopping platform with payment integration and inventory management",
      status: "Developing",
      progress: 75,
      startDate: "2024-10-01",
      endDate: "2024-12-20",
      githubLink: "https://github.com/example/ecommerce",
      demoVideo: "https://youtube.com/watch?v=demo1",
      otherLinks: ["https://figma.com/design1"],
      team: ["JD", "SM", "AK"],
      totalTickets: 12,
      completedTickets: 9,
      openTickets: 3
    },
    {
      id: "2",
      name: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      status: "Testing",
      progress: 45,
      startDate: "2024-09-15",
      endDate: "2024-12-15",
      githubLink: "https://github.com/example/banking",
      demoVideo: "https://youtube.com/watch?v=demo2",
      otherLinks: [],
      team: ["RK", "PM"],
      totalTickets: 8,
      completedTickets: 4,
      openTickets: 4
    },
    {
      id: "3",
      name: "CRM Dashboard",
      description: "Customer relationship management system with analytics",
      status: "Deployed",
      progress: 90,
      startDate: "2024-08-01",
      endDate: "2024-11-30",
      githubLink: "https://github.com/example/crm",
      demoVideo: "https://youtube.com/watch?v=demo3",
      otherLinks: ["https://app.crm-demo.com"],
      team: ["LM", "TS", "NK"],
      totalTickets: 15,
      completedTickets: 14,
      openTickets: 1
    },
    {
      id: "4",
      name: "Analytics Platform",
      description: "Real-time data analytics and visualization platform",
      status: "New",
      progress: 30,
      startDate: "2024-11-10",
      endDate: "2025-01-10",
      githubLink: "https://github.com/example/analytics",
      demoVideo: "",
      otherLinks: [],
      team: ["BJ", "HS"],
      totalTickets: 6,
      completedTickets: 2,
      openTickets: 4
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "progress":
        return b.progress - a.progress;
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const handleCreateProject = () => {
    toast.success("Project created successfully!");
    setIsCreateOpen(false);
  };

  const stats = [
    { label: "Total Projects", value: projects.length },
    { label: "Active", value: projects.filter(p => p.status === "Developing").length },
    { label: "Completed", value: projects.filter(p => p.status === "Deployed").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage all your development projects</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Sort: {sortBy}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("recent")}>Recent</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("progress")}>Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects List */}
      {sortedProjects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
              <Archive className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or create a new project</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create First Project
            </Button>
          </div>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {sortedProjects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/admin-site/projects/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center py-2 border-t border-b">
                  <div>
                    <div className="text-lg font-bold">{project.totalTickets}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#4ade80]">{project.completedTickets}</div>
                    <div className="text-xs text-muted-foreground">Done</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#4361ee]">{project.openTickets}</div>
                    <div className="text-xs text-muted-foreground">Open</div>
                  </div>
                </div>

                {/* Team & Links */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.team.map((member, idx) => (
                      <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                          {member}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {project.githubLink && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.githubLink, '_blank');
                        }}
                      >
                        <Github className="h-3 w-3" />
                      </Button>
                    )}
                    {project.demoVideo && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.demoVideo, '_blank');
                        }}
                      >
                        <Video className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{project.startDate} - {project.endDate}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin-site/projects/${project.id}`);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Edit functionality coming soon");
                    }}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to track development progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input id="name" placeholder="E-Commerce Platform" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the project..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="New">
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
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Repository</Label>
              <Input id="github" placeholder="https://github.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo">Demo Video</Label>
              <Input id="demo" placeholder="https://youtube.com/..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
