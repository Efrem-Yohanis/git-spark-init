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
  Calendar
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
import { toast } from "sonner";

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
}

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "E-Commerce Platform",
      description: "Full-featured online shopping platform with payment integration",
      status: "Developing",
      progress: 75,
      startDate: "2024-10-01",
      endDate: "2024-12-20",
      githubLink: "https://github.com/example/ecommerce",
      demoVideo: "https://youtube.com/watch?v=demo1",
      otherLinks: ["https://figma.com/design1"],
      team: ["JD", "SM", "AK"]
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
      team: ["RK", "PM"]
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
      team: ["LM", "TS", "NK"]
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
      team: ["BJ", "HS"]
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
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
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
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#4361ee] hover:bg-[#3f37c9]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex -space-x-2">
                  {project.team.map((member, idx) => (
                    <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                        {member}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{project.endDate}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsViewOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Edit functionality coming soon")}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Archive functionality coming soon")}
                >
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the project details to get started
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input id="name" placeholder="Enter project name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Project description" rows={3} />
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
              <Label htmlFor="github">GitHub Repository</Label>
              <Input id="github" placeholder="https://github.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo">Demo Video</Label>
              <Input id="demo" placeholder="https://youtube.com/..." />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#4361ee] hover:bg-[#3f37c9]"
              onClick={() => {
                toast.success("Project created successfully");
                setIsCreateOpen(false);
              }}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Project Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
            <Badge className={getStatusColor(selectedProject?.status || "")}>
              {selectedProject?.status}
            </Badge>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Start Date</h4>
                  <p className="text-sm text-muted-foreground">{selectedProject.startDate}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">End Date</h4>
                  <p className="text-sm text-muted-foreground">{selectedProject.endDate}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Progress</h4>
                <div className="space-y-1">
                  <Progress value={selectedProject.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{selectedProject.progress}% Complete</p>
                </div>
              </div>
              <div className="space-y-2">
                {selectedProject.githubLink && (
                  <a 
                    href={selectedProject.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#4361ee] hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </a>
                )}
                {selectedProject.demoVideo && (
                  <a 
                    href={selectedProject.demoVideo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#4361ee] hover:underline"
                  >
                    <Video className="h-4 w-4" />
                    Demo Video
                  </a>
                )}
                {selectedProject.otherLinks.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#4361ee] hover:underline"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Additional Link {idx + 1}
                  </a>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Team Members</h4>
                <div className="flex gap-2">
                  {selectedProject.team.map((member, idx) => (
                    <Avatar key={idx} className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                        {member}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
