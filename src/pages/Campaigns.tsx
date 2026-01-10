import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const campaigns = [
  { id: 1, name: "Meskel Season Rewards", type: "Incentive", segment: "High Value Active", channels: ["SMS", "Push"], status: "Running", startDate: "2024-01-01", endDate: "2024-01-31" },
  { id: 2, name: "Timket Win-back", type: "Win-back", segment: "Dormant 60 Days", channels: ["SMS", "USSD"], status: "Running", startDate: "2024-01-10", endDate: "2024-02-10" },
  { id: 3, name: "Enkutatash Promo", type: "Incentive", segment: "All Active", channels: ["SMS"], status: "Completed", startDate: "2023-12-30", endDate: "2024-01-02" },
  { id: 4, name: "Genna Alert Update", type: "Info", segment: "All Customers", channels: ["SMS"], status: "Scheduled", startDate: "2024-01-20", endDate: "2024-01-20" },
  { id: 5, name: "Addis Ababa Youth Campaign", type: "Incentive", segment: "Addis Youth", channels: ["Push", "Email"], status: "Draft", startDate: "-", endDate: "-" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Running": return "bg-success/10 text-success border-success/20";
    case "Completed": return "bg-info/10 text-info border-info/20";
    case "Scheduled": return "bg-warning/10 text-warning border-warning/20";
    case "Draft": return "bg-muted text-muted-foreground border-muted";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Campaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10"><Megaphone className="w-6 h-6 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">View and manage engagement campaigns</p>
          </div>
        </div>
        <Button onClick={() => navigate("/campaigns/create")} className="gap-2">
          <Plus className="w-4 h-4" />Create Campaign
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Campaign Name</TableHead>
              <TableHead className="font-semibold">Campaign Type</TableHead>
              <TableHead className="font-semibold">Segment Name</TableHead>
              <TableHead className="font-semibold">Channels</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Start Date</TableHead>
              <TableHead className="font-semibold">End Date</TableHead>
              <TableHead className="font-semibold w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.map((campaign) => (
              <TableRow key={campaign.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{campaign.type}</TableCell>
                <TableCell>{campaign.segment}</TableCell>
                <TableCell><div className="flex gap-1">{campaign.channels.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}</div></TableCell>
                <TableCell><Badge variant="outline" className={cn("font-medium", getStatusColor(campaign.status))}>{campaign.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{campaign.startDate}</TableCell>
                <TableCell className="text-muted-foreground">{campaign.endDate}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/campaigns/${campaign.id}`)} className="gap-1">
                    <Eye className="w-3 h-3" />View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
