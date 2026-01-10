import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSegments } from "@/hooks/useSegments";
import { format } from "date-fns";

export default function Segmentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, error } = useSegments();

  const segments = data?.segments || [];

  const filteredSegments = segments.filter((segment) =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">Failed to load segments</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Segmentation</h1>
          <p className="text-muted-foreground">View and manage customer segments</p>
          {data?.summary && (
            <p className="text-sm text-muted-foreground mt-1">
              {data.summary.total_segments} segments • {data.summary.total_customers_in_segments.toLocaleString()} total customers
            </p>
          )}
        </div>
        <Button className="gap-2" onClick={() => navigate("/segmentation/create")}>
          <Plus className="w-4 h-4" />
          Create Segment
        </Button>
      </div>

      {/* Search Bar Only */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search segments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-card border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Segment Name</TableHead>
              <TableHead className="font-semibold text-right">Customer Count</TableHead>
              <TableHead className="font-semibold">Last Refresh</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSegments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No segments match your search" : "No segments found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredSegments.map((segment) => (
                <TableRow key={segment.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent">
                        <Users className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{segment.name}</p>
                        {segment.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {segment.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {segment.formatted_customer_count || segment.customer_count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(segment.last_refresh)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => navigate(`/segmentation/${segment.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
