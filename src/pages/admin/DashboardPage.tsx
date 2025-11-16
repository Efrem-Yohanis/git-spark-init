import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  FolderKanban, 
  Ticket, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const DashboardPage = () => {
  const stats = [
    { 
      title: "Total Projects", 
      value: "24", 
      change: "+12%", 
      icon: FolderKanban,
      color: "#4361ee"
    },
    { 
      title: "Active Tickets", 
      value: "156", 
      change: "+8%", 
      icon: Ticket,
      color: "#3f37c9"
    },
    { 
      title: "Team Members", 
      value: "12", 
      change: "+2", 
      icon: Users,
      color: "#4cc9f0"
    },
    { 
      title: "Completion Rate", 
      value: "87%", 
      change: "+5%", 
      icon: TrendingUp,
      color: "#4ade80"
    },
  ];

  const recentProjects = [
    { 
      name: "E-Commerce Platform", 
      progress: 75, 
      status: "Developing",
      team: ["JD", "SM", "AK"],
      dueDate: "2024-12-20"
    },
    { 
      name: "Mobile Banking App", 
      progress: 45, 
      status: "Testing",
      team: ["RK", "PM"],
      dueDate: "2024-12-15"
    },
    { 
      name: "CRM Dashboard", 
      progress: 90, 
      status: "Deployed",
      team: ["LM", "TS", "NK"],
      dueDate: "2024-11-30"
    },
    { 
      name: "Analytics Platform", 
      progress: 30, 
      status: "New",
      team: ["BJ", "HS"],
      dueDate: "2025-01-10"
    },
  ];

  const recentActivity = [
    { 
      action: "Ticket #156 assigned to John Doe", 
      time: "5 minutes ago",
      type: "assign"
    },
    { 
      action: "Project 'Mobile App' moved to Testing", 
      time: "1 hour ago",
      type: "status"
    },
    { 
      action: "New ticket #157 created", 
      time: "2 hours ago",
      type: "create"
    },
    { 
      action: "Sarah completed ticket #145", 
      time: "3 hours ago",
      type: "complete"
    },
    { 
      action: "Team member Mike joined", 
      time: "5 hours ago",
      type: "join"
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
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
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
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-[#4ade80]">{stat.change}</span> from last month
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
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-[#4361ee]" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:border-[#4361ee]/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Due {project.dueDate}
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
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4361ee]/10 flex items-center justify-center text-[#4361ee]">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
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
