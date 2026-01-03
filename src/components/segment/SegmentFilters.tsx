import { Calendar, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SegmentFiltersProps {
  filters: {
    activityDays: string;
    valueTier: string;
  };
  onFiltersChange: (filters: { activityDays: string; valueTier: string }) => void;
}

export function SegmentFilters({ filters, onFiltersChange }: SegmentFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-end gap-6">
          {/* Activity Filter */}
          <div className="space-y-2 min-w-[180px]">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Last Activity
            </Label>
            <Select 
              value={filters.activityDays}
              onValueChange={(value) => onFiltersChange({ ...filters, activityDays: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="60">60+ days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Value Filter */}
          <div className="space-y-2 min-w-[200px]">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              Value Tier
            </Label>
            <Select 
              value={filters.valueTier}
              onValueChange={(value) => onFiltersChange({ ...filters, valueTier: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="high">High Value Customers</SelectItem>
                <SelectItem value="medium">Medium Value Customers</SelectItem>
                <SelectItem value="low">Low Value Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Summary */}
          <div className="ml-auto text-sm text-muted-foreground">
            Filters applied: {filters.activityDays} days activity, {filters.valueTier === "all" ? "all tiers" : `${filters.valueTier} value`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
