import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreateCampaignDialog } from '@/components/campaigns/CreateCampaignDialog';
import { mockCampaigns } from '@/data/mockData';
import { Megaphone, Send, Eye, Gift, Plus } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Advertisements = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const activeCampaigns = mockCampaigns.filter((c) => c.status === 'active').length;
  const totalSent = mockCampaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const avgOpenRate = mockCampaigns.filter(c => c.sentCount > 0).reduce((acc, c) => acc + c.openRate, 0) / mockCampaigns.filter(c => c.sentCount > 0).length;
  const avgRedemption = mockCampaigns.filter(c => c.sentCount > 0).reduce((acc, c) => acc + c.redemptionRate, 0) / mockCampaigns.filter(c => c.sentCount > 0).length;

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-status-delivered/10 text-status-delivered border-status-delivered/20',
      scheduled: 'bg-status-info/10 text-status-info border-status-info/20',
      completed: 'bg-status-pending/10 text-status-pending border-status-pending/20',
      draft: 'bg-muted text-muted-foreground border-border',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advertisement Management</h1>
            <p className="text-muted-foreground mt-1">Targeted marketing and customer engagement</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Active Campaigns"
              value={activeCampaigns}
              icon={Megaphone}
              variant="delivered"
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Total Sent"
              value={totalSent.toLocaleString()}
              icon={Send}
              trend={{ value: 24, isPositive: true }}
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Avg Open Rate"
              value={`${avgOpenRate.toFixed(1)}%`}
              icon={Eye}
              variant="pending"
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Avg Redemption"
              value={`${avgRedemption.toFixed(1)}%`}
              icon={Gift}
            />
          </div>
        </div>

        {/* Campaigns List */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">All Campaigns</h2>
          </div>
          <div className="divide-y divide-border">
            {mockCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => navigate(`/advertisements/${campaign.id}`)}
                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.targetSegment.join(', ')} • {campaign.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{campaign.sentCount.toLocaleString()} sent</p>
                    <p className="text-xs text-muted-foreground">{campaign.openRate}% open rate</p>
                  </div>
                  <Badge variant="outline" className={cn('capitalize', getStatusBadge(campaign.status))}>
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Campaign Dialog */}
        <CreateCampaignDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </div>
    </MainLayout>
  );
};

export default Advertisements;
