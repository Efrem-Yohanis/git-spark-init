import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  RefreshCw, 
  Edit, 
  Megaphone, 
  Download, 
  Share2, 
  Calendar,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SegmentKPICards } from "@/components/segment/SegmentKPICards";
import { SegmentFilters } from "@/components/segment/SegmentFilters";
import { CustomerListTable } from "@/components/segment/CustomerListTable";
import { CreateCampaignModal } from "@/components/segment/CreateCampaignModal";
import { ExportModal } from "@/components/segment/ExportModal";
import { cn } from "@/lib/utils";

// Mock segment data - in real app, fetch by ID
const segmentData = {
  id: 1,
  name: "High Value Active Users",
  type: "Value",
  customerCount: 125000,
  lastRefresh: "2024-01-15 14:30",
  status: "Active",
  description: "Users with >10 transactions/month, avg value >KES 5000",
  kpis: {
    activeRate: 78.5,
    activeRateTrend: 2.3,
    newUsers: 4520,
    newUsersPercent: 3.6,
    highValue: 35,
    mediumValue: 45,
    lowValue: 20,
    churnRiskCount: 8500,
    avgChurnProbability: 0.32,
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Dormant":
      return "bg-warning/10 text-warning border-warning/20";
    case "Value":
      return "bg-info/10 text-info border-info/20";
    case "Demographic":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function SegmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    activityDays: "30",
    valueTier: "all",
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Segment Header */}
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          className="w-fit gap-2 -ml-2"
          onClick={() => navigate("/segmentation")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Segments
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{segmentData.name}</h1>
              <Badge 
                variant="outline" 
                className={cn("font-medium", getTypeColor(segmentData.type))}
              >
                {segmentData.type}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Last refreshed: {segmentData.lastRefresh}
              </span>
              <span className="font-medium text-foreground">
                {segmentData.customerCount.toLocaleString()} customers
              </span>
            </div>
            <p className="text-muted-foreground">{segmentData.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              Refresh Segment
            </Button>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Segment
            </Button>
            <Button 
              className="gap-2"
              onClick={() => setShowCampaignModal(true)}
            >
              <Megaphone className="w-4 h-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <SegmentKPICards kpis={segmentData.kpis} />

      {/* Filters Panel */}
      <SegmentFilters filters={filters} onFiltersChange={setFilters} />

      {/* Customer List Table */}
      <CustomerListTable 
        filters={filters} 
        onExport={() => setShowExportModal(true)} 
      />

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share Preview
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Export
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing filtered results • Export will include all matching customers
        </p>
      </div>

      {/* Modals */}
      <CreateCampaignModal 
        open={showCampaignModal} 
        onOpenChange={setShowCampaignModal}
        segment={segmentData}
        filters={filters}
      />
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        segment={segmentData}
        filters={filters}
      />
    </div>
  );
}
