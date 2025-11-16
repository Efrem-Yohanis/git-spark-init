import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  BarChart3,
  CheckCircle2
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  status: string;
  skills: string[];
  activeTickets: number;
  completedTickets: number;
  performance: number;
  joinDate: string;
}

const TeamPage = () => {
  const team: TeamMember[] = [
    {
      id: "1",
      name: "John Doe",
      role: "Senior Developer",
      email: "john.doe@company.com",
      phone: "+1 234 567 8901",
      avatar: "JD",
      status: "Available",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      activeTickets: 5,
      completedTickets: 42,
      performance: 92,
      joinDate: "2023-01-15"
    },
    {
      id: "2",
      name: "Sarah Miller",
      role: "Full Stack Developer",
      email: "sarah.miller@company.com",
      phone: "+1 234 567 8902",
      avatar: "SM",
      status: "Busy",
      skills: ["Python", "Django", "React", "PostgreSQL"],
      activeTickets: 8,
      completedTickets: 38,
      performance: 88,
      joinDate: "2023-03-20"
    },
    {
      id: "3",
      name: "Alex Kumar",
      role: "UI/UX Designer",
      email: "alex.kumar@company.com",
      phone: "+1 234 567 8903",
      avatar: "AK",
      status: "Available",
      skills: ["Figma", "Adobe XD", "Illustrator", "CSS"],
      activeTickets: 3,
      completedTickets: 56,
      performance: 95,
      joinDate: "2022-11-10"
    },
    {
      id: "4",
      name: "Robert King",
      role: "DevOps Engineer",
      email: "robert.king@company.com",
      phone: "+1 234 567 8904",
      avatar: "RK",
      status: "Available",
      skills: ["Docker", "Kubernetes", "Jenkins", "AWS"],
      activeTickets: 4,
      completedTickets: 31,
      performance: 90,
      joinDate: "2023-05-08"
    },
    {
      id: "5",
      name: "Linda Martinez",
      role: "Backend Developer",
      email: "linda.martinez@company.com",
      phone: "+1 234 567 8905",
      avatar: "LM",
      status: "On Leave",
      skills: ["Java", "Spring Boot", "MySQL", "Redis"],
      activeTickets: 2,
      completedTickets: 45,
      performance: 87,
      joinDate: "2023-02-14"
    },
    {
      id: "6",
      name: "Tom Sanders",
      role: "Frontend Developer",
      email: "tom.sanders@company.com",
      phone: "+1 234 567 8906",
      avatar: "TS",
      status: "Busy",
      skills: ["React", "Vue.js", "Tailwind", "Next.js"],
      activeTickets: 6,
      completedTickets: 52,
      performance: 93,
      joinDate: "2022-09-25"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-[#4ade80] text-white";
      case "Busy": return "bg-[#f72585] text-white";
      case "On Leave": return "bg-gray-400 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "#4ade80";
    if (performance >= 75) return "#4361ee";
    if (performance >= 60) return "#f72585";
    return "#6b7280";
  };

  const totalMembers = team.length;
  const availableMembers = team.filter(m => m.status === "Available").length;
  const avgPerformance = Math.round(team.reduce((acc, m) => acc + m.performance, 0) / team.length);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Members
            </CardTitle>
            <Users className="h-5 w-5 text-[#4361ee]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Now
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-[#4ade80]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{availableMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Performance
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-[#4361ee]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgPerformance}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-[#4361ee] to-[#3f37c9] text-white">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {member.joinDate}</span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {member.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="font-semibold">{member.performance}%</span>
                </div>
                <Progress 
                  value={member.performance} 
                  className="h-2"
                  style={{ 
                    // @ts-ignore
                    '--progress-background': getPerformanceColor(member.performance)
                  }}
                />
              </div>

              {/* Workload */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <div className="text-2xl font-bold text-[#4361ee]">
                    {member.activeTickets}
                  </div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#4ade80]">
                    {member.completedTickets}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
