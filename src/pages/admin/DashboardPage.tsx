import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  FolderKanban, 
  Ticket, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: "Total Projects", 
      value: "24", 
      change: "+12%", 
      trend: "up",
      icon: FolderKanban,
      color: "#4361ee"
    },
    { 
      title: "Active Tickets", 
      value: "156", 
      change: "+8%", 
      trend: "up",
      icon: Ticket,
      color: "#3f37c9"
    },
    { 
      title: "Team Members", 
      value: "12", 
      change: "+2", 
      trend: "up",
      icon: Users,
      color: "#4cc9f0"
    },
    { 
      title: "Completion Rate", 
      value: "87%", 
      change: "+5%", 
      trend: "up",
      icon: TrendingUp,
      color: "#4ade80"
    },
  ];

  const recentProjects = [
    { 
      id: "1",
      name: "E-Commerce Platform", 
      progress: 75, 
      status: "Developing",
      team: ["JD", "SM", "AK"],
      dueDate: "2024-12-20",
      totalTickets: 12,
      completedTickets: 9
    },
    { 
      id: "2",
      name: "Mobile Banking App", 
      progress: 45, 
      status: "Testing",
      team: ["RK", "PM"],
      dueDate: "2024-12-15",
      totalTickets: 8,
      completedTickets: 4
    },
    { 
      id: "3",
      name: "CRM Dashboard", 
      progress: 90, 
      status: "Deployed",
      team: ["LM", "TS", "NK"],
      dueDate: "2024-11-30",
      totalTickets: 15,
      completedTickets: 14
    },
    { 
      id: "4",
      name: "Analytics Platform", 
      progress: 30, 
      status: "New",
      team: ["BJ", "HS"],
      dueDate: "2025-01-10",
      totalTickets: 6,
      completedTickets: 2
    },
  ];

  const recentActivity = [
    { 
      action: "Ticket #156 assigned to John Doe", 
      time: "5 minutes ago",
      type: "assign",
      user: "System"
    },
    { 
      action: "Project 'Mobile App' moved to Testing", 
      time: "1 hour ago",
      type: "status",
      user: "Sarah Miller"
    },
    { 
      action: "New ticket #157 created: Fix payment gateway", 
      time: "2 hours ago",
      type: "create",
      user: "John Doe"
    },
    { 
      action: "Sarah completed ticket #145", 
      time: "3 hours ago",
      type: "complete",
      user: "Sarah Miller"
    },
    { 
      action: "Team member Mike joined", 
      time: "5 hours ago",
      type: "join",
      user: "Admin"
    },
    { 
      action: "Comment added on ticket #142", 
      time: "6 hours ago",
      type: "comment",
      user: "Alex Kumar"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-[#4cc9f0] text-white";
      case "Developing": return "bg-[#4361ee] text-white";
      case "Testing": return "bg-[#f72585] text-white";
      case "Deployed": return "bg-[#4ade80] text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assign": return <Users className="h-4 w-4" />;
      case "status": return <TrendingUp className="h-4 w-4" />;
      case "create": return <Ticket className="h-4 w-4" />;
      case "complete": return <CheckCircle2 className="h-4 w-4" />;
      case "join": return <Users className="h-4 w-4" />;
      case "comment": return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of all projects and recent activity</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin-site/projects')} variant="outline">
            <FolderKanban className="h-4 w-4" />
            View All Projects
          </Button>
          <Button onClick={() => navigate('/admin-site/tickets')}>
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="text-[#4ade80] flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </span> 
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-[#4361ee]" />
                Recent Projects
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin-site/projects')}>
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project, index) => (
              <div 
                key={index} 
                className="border border-border rounded-lg p-4 hover:border-[#4361ee]/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin-site/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due {project.dueDate}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.completedTickets}/{project.totalTickets} tickets
                      </span>
                    </div>
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
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#4361ee]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3 relative">
                  {index !== recentActivity.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-full bg-border" />
                  )}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4361ee]/10 flex items-center justify-center text-[#4361ee] relative z-10">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
