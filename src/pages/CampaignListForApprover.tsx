import { useNavigate } from "react-router-dom";
import { Search, X, Eye, Check, Clock, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ApproverHeader } from "@/components/approver/ApproverHeader";
import { ApproverFooter } from "@/components/approver/ApproverFooter";

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "uncompleted";
  submittedDate: string;
}

const mockCampaigns: Campaign[] = [
  { id: "1", name: "Meskel Reactivation Campaign", type: "Incentive", status: "pending", submittedDate: "2026-01-02" },
  { id: "2", name: "Timket Bonus Campaign", type: "Informational", status: "approved", submittedDate: "2026-01-01" },
  { id: "3", name: "Enkutatash Cashback", type: "Incentive", status: "rejected", submittedDate: "2025-12-30" },
  { id: "4", name: "Customer Onboarding", type: "Informational", status: "pending", submittedDate: "2026-01-03" },
  { id: "5", name: "Fasika Loyalty Program", type: "Incentive", status: "uncompleted", submittedDate: "2025-12-28" },
  { id: "6", name: "Genna Sale Alert", type: "Informational", status: "approved", submittedDate: "2025-12-25" },
  { id: "7", name: "High Value Win-back", type: "Incentive", status: "pending", submittedDate: "2026-01-02" },
  { id: "8", name: "Monthly Statement Reminder", type: "Informational", status: "approved", submittedDate: "2025-12-20" },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: Check },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
  uncompleted: { label: "Uncompleted", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", icon: AlertCircle },
};

export default function CampaignListForApprover() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || typeFilter !== "all";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ApproverHeader />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Approvals</h1>
          <p className="text-muted-foreground">Campaigns assigned to you for review</p>
        </div>

        {/* Filters */}
        <div className="bg-card border p-4 sticky top-14 z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by campaign name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="uncompleted">Uncompleted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Campaign Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Informational">Informational</SelectItem>
                <SelectItem value="Incentive">Incentive</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No campaigns found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCampaigns.map((campaign) => {
                  const StatusIcon = statusConfig[campaign.status].icon;
                  return (
                    <TableRow key={campaign.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.type}</TableCell>
                      <TableCell>{campaign.submittedDate}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${statusConfig[campaign.status].color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig[campaign.status].label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/campaigns/${campaign.id}/approval`)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border bg-card p-6">
              No campaigns found
            </div>
          ) : (
            filteredCampaigns.map((campaign) => {
              const StatusIcon = statusConfig[campaign.status].icon;
              return (
                <div key={campaign.id} className="border bg-card p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">{campaign.type}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${statusConfig[campaign.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[campaign.status].label}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Submitted: {campaign.submittedDate}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/campaigns/${campaign.id}/approval`)}
                    className="w-full gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCampaigns.length} of {mockCampaigns.length} campaigns
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </main>

      <ApproverFooter />
    </div>
  );
}
