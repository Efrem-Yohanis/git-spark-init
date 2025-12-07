import { Campaign } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { Send, Mail, MessageSquare, QrCode, Users, Eye, MousePointer, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface CampaignCardProps {
  campaign: Campaign;
}

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  scheduled: { label: 'Scheduled', className: 'status-info' },
  active: { label: 'Active', className: 'status-delivered' },
  completed: { label: 'Completed', className: 'status-pending' },
};

const typeConfig = {
  push: { icon: Send, label: 'Push Notification' },
  sms: { icon: MessageSquare, label: 'SMS' },
  email: { icon: Mail, label: 'Email' },
  qr: { icon: QrCode, label: 'QR Code' },
};

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const navigate = useNavigate();
  const status = statusConfig[campaign.status];
  const type = typeConfig[campaign.type];

  return (
    <div 
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/advertisements/${campaign.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <type.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{campaign.name}</h4>
            <p className="text-sm text-muted-foreground">{type.label}</p>
          </div>
        </div>
        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.className)}>
          {status.label}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{campaign.content}</p>

      <div className="flex items-center gap-2 mb-4">
        <Users className="h-3 w-3 text-muted-foreground" />
        <div className="flex flex-wrap gap-1">
          {campaign.targetSegment.map((segment) => (
            <span key={segment} className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded capitalize">
              {segment}
            </span>
          ))}
        </div>
      </div>

      {campaign.status !== 'draft' && campaign.status !== 'scheduled' && (
        <div className="pt-4 border-t border-border grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Send className="h-3 w-3" />
            </div>
            <p className="text-sm font-semibold text-foreground">{campaign.sentCount}</p>
            <p className="text-xs text-muted-foreground">Sent</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Eye className="h-3 w-3" />
            </div>
            <p className="text-sm font-semibold text-foreground">{campaign.openRate}%</p>
            <p className="text-xs text-muted-foreground">Open</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <MousePointer className="h-3 w-3" />
            </div>
            <p className="text-sm font-semibold text-foreground">{campaign.clickRate}%</p>
            <p className="text-xs text-muted-foreground">Click</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Gift className="h-3 w-3" />
            </div>
            <p className="text-sm font-semibold text-foreground">{campaign.redemptionRate}%</p>
            <p className="text-xs text-muted-foreground">Redeem</p>
          </div>
        </div>
      )}

      {campaign.scheduledAt && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Scheduled for {format(campaign.scheduledAt, 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      )}
    </div>
  );
};
