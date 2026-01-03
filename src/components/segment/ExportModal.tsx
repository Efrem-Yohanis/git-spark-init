import { useState } from "react";
import { Download, FileSpreadsheet, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: {
    name: string;
    customerCount: number;
  };
  filters: {
    activityDays: string;
    valueTier: string;
  };
}

export function ExportModal({ open, onOpenChange, segment, filters }: ExportModalProps) {
  const [format, setFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);

  const estimatedCustomers = filters.valueTier === "all" 
    ? segment.customerCount 
    : Math.floor(segment.customerCount * 0.35);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      onOpenChange(false);
      toast.success("Export started", {
        description: `${segment.name} export will be ready in a few minutes.`,
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Customer List
          </DialogTitle>
          <DialogDescription>
            Export MSISDN list for "{segment.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning for large exports */}
          {estimatedCustomers > 100000 && (
            <Alert className="border-warning/50 bg-warning/10">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <AlertDescription className="text-warning">
                Large export ({estimatedCustomers.toLocaleString()} customers). This may take several minutes.
              </AlertDescription>
            </Alert>
          )}

          {/* Export Format Selection */}
          <div className="space-y-3">
            <Label className="font-medium">Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat} className="space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer flex-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CSV</p>
                    <p className="text-sm text-muted-foreground">Comma-separated values</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer flex-1">
                  <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Excel</p>
                    <p className="text-sm text-muted-foreground">Microsoft Excel format (.xlsx)</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Export Summary */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customers to export:</span>
              <span className="font-medium">{estimatedCustomers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Filters:</span>
              <span className="font-medium">{filters.activityDays}D, {filters.valueTier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MSISDN masking:</span>
              <span className="font-medium">Enabled</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="gap-2">
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {format.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
