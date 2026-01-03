import { Link } from "react-router-dom";
import { ExternalLink, Calendar, Clock, Repeat, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OverviewTabProps {
  campaign: {
    segment: {
      name: string;
      id: string;
      filters: string;
    };
    schedule: {
      startDate: string;
      endDate: string;
      triggerType: string;
      frequencyCap: string;
    };
    aiRecommendation: boolean;
  };
}

export function OverviewTab({ campaign }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Target Segment */}
      <div className="bg-card border p-6 space-y-4">
        <h3 className="font-semibold text-lg">Target Segment</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Segment Name</span>
            <Link 
              to={`/segmentation/${campaign.segment.id}`}
              className="font-medium text-primary hover:underline flex items-center gap-1"
            >
              {campaign.segment.name}
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">Applied Filters</span>
            <div className="mt-2 bg-muted/50 p-3 text-sm font-mono">
              {campaign.segment.filters}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Schedule */}
      <div className="bg-card border p-6 space-y-4">
        <h3 className="font-semibold text-lg">Campaign Schedule</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start / End Date</p>
              <p className="font-medium">{campaign.schedule.startDate} — {campaign.schedule.endDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info/10">
              <Clock className="w-4 h-4 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trigger Type</p>
              <p className="font-medium">{campaign.schedule.triggerType}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10">
              <Repeat className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Frequency Cap</p>
              <p className="font-medium">{campaign.schedule.frequencyCap}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-card border p-6 space-y-4 lg:col-span-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">AI Recommendation</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">AI-Assisted Campaign Creation:</span>
          <Badge variant={campaign.aiRecommendation ? "default" : "secondary"}>
            {campaign.aiRecommendation ? "Yes" : "No"}
          </Badge>
        </div>

        {campaign.aiRecommendation && (
          <div className="bg-primary/5 border border-primary/20 p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              This campaign was created using AI recommendations for optimal segment targeting, 
              channel selection, and reward configuration.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Suggested Channel: SMS + Push Notification</li>
              <li>• Suggested Reward: 10 ETB Cashback</li>
              <li>• Expected Uplift: +15% activation rate</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
