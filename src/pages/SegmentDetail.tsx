import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit, 
  Calendar,
  Trash2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SegmentKPICards } from "@/components/segment/SegmentKPICards";
import { CustomerListTable } from "@/components/segment/CustomerListTable";
import { ExportModal } from "@/components/segment/ExportModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useSegmentDetail, useDeleteSegment } from "@/hooks/useSegments";
import { format } from "date-fns";

const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "active":
    case "behavioral":
      return "bg-success/10 text-success border-success/20";
    case "dormant":
    case "activity":
      return "bg-warning/10 text-warning border-warning/20";
    case "value":
      return "bg-info/10 text-info border-info/20";
    case "demographic":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function SegmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filters, setFilters] = useState({
    activityDays: "30",
    valueTier: "all",
  });

  const { data, isLoading, error } = useSegmentDetail(id || "");
  const deleteSegmentMutation = useDeleteSegment();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteSegmentMutation.mutateAsync(id);
      navigate("/segmentation");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.segment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">Failed to load segment details</p>
        <Button onClick={() => navigate("/segmentation")}>Back to Segments</Button>
      </div>
    );
  }

  const segment = data.segment;

  // Transform API data for KPI cards
  const kpis = {
    activeRate: 78.5, // Not in API, using placeholder
    activeRateTrend: 2.3, // Not in API, using placeholder
    newUsers: segment.new_users_30d?.count || 0,
    newUsersPercent: segment.new_users_30d?.percentage || 0,
    highValue: segment.value_distribution?.high || 0,
    mediumValue: segment.value_distribution?.medium || 0,
    lowValue: segment.value_distribution?.low || 0,
    churnRiskCount: segment.churn_risk?.count || 0,
    avgChurnProbability: (segment.churn_risk?.avg_probability || 0) / 100,
  };

  // Transform customer preview for table
  const customerPreview = segment.customer_preview || [];

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
              <h1 className="text-2xl font-bold">{segment.name}</h1>
              <Badge 
                variant="outline" 
                className={cn("font-medium", getTypeColor(segment.type || segment.segment_type))}
              >
                {segment.type || segment.segment_type}
              </Badge>
            </div>
            {segment.description && (
              <p className="text-muted-foreground">{segment.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Last refreshed: {formatDate(segment.last_refresh)}
              </span>
              <span>
                {segment.formatted_customer_count || segment.customer_count?.toLocaleString()} customers
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate(`/segmentation/${id}/edit`)}
            >
              <Edit className="w-4 h-4" />
              Edit Segment
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards (without Active Rate) */}
      <SegmentKPICards kpis={kpis} hideActiveRate />

      {/* Customer List Table */}
      <CustomerListTable 
        filters={filters} 
        onExport={() => setShowExportModal(true)}
        customers={customerPreview}
      />

      {/* Modals */}
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        segment={{
          name: segment.name,
          customerCount: segment.customer_count,
        }}
        filters={filters}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Segment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{segment.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSegmentMutation.isPending}
            >
              {deleteSegmentMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
