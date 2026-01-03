import { useNavigate } from "react-router-dom";
import { Megaphone, Users, Sparkles, MessageSquare, Gift, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: {
    id: number;
    name: string;
    customerCount: number;
    type: string;
  };
  filters: {
    activityDays: string;
    valueTier: string;
  };
}

export function CreateCampaignModal({ open, onOpenChange, segment, filters }: CreateCampaignModalProps) {
  const navigate = useNavigate();

  // Calculate estimated customers based on filters (mock)
  const estimatedCustomers = filters.valueTier === "all" 
    ? segment.customerCount 
    : Math.floor(segment.customerCount * 0.35);

  const handleContinue = () => {
    onOpenChange(false);
    navigate("/campaigns?create=true&segment=" + segment.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" />
            Create Campaign from Segment
          </DialogTitle>
          <DialogDescription>
            Launch a targeted campaign for this customer segment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Segment Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Segment</span>
                <span className="font-semibold">{segment.name}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Filters Applied</span>
                <div className="flex gap-2">
                  <Badge variant="outline">{filters.activityDays} days</Badge>
                  <Badge variant="outline">{filters.valueTier === "all" ? "All tiers" : filters.valueTier}</Badge>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Est. Customers</span>
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {estimatedCustomers.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="font-semibold text-sm">AI Recommendations</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Best Channel:</strong> SMS + App Push</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Suggested Incentive:</strong> 2% cashback on next 3 TXNs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span><strong>Best Time:</strong> Sunday 10AM - 2PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinue} className="gap-2">
            <Megaphone className="w-4 h-4" />
            Continue to Campaign Wizard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
