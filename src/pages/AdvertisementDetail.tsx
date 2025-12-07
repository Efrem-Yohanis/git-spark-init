import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Bell,
  Mail,
  MessageSquare,
  QrCode,
  Calendar,
  Users,
  Eye,
  MousePointer,
  Gift,
  TrendingUp,
  Target,
  Clock,
  Send
} from 'lucide-react';
import { mockCampaigns, mockCustomers } from '@/data/mockData';
import { format } from 'date-fns';

const AdvertisementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = mockCampaigns.find(c => c.id === id);

  if (!campaign) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
      </MainLayout>
    );
  }

  const typeIcons = {
    push: Bell,
    sms: MessageSquare,
    email: Mail,
    qr: QrCode,
  };

  const typeColors = {
    push: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    sms: 'bg-green-500/20 text-green-400 border-green-500/30',
    email: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    qr: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  const statusColors = {
    draft: 'bg-muted text-muted-foreground',
    scheduled: 'bg-status-warning/20 text-status-warning',
    active: 'bg-status-success/20 text-status-success',
    completed: 'bg-blue-500/20 text-blue-400',
  };

  const TypeIcon = typeIcons[campaign.type];
  const targetedCustomers = mockCustomers.filter(c => campaign.targetSegment.includes(c.segment));

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/advertisements')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Campaign Details</h1>
          </div>
          {campaign.status === 'draft' && (
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2" />
              Launch Campaign
            </Button>
          )}
        </div>

        {/* Campaign Overview Card */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className={`p-6 rounded-2xl ${typeColors[campaign.type]}`}>
                  <TypeIcon className="h-12 w-12" />
                </div>
                <Badge className={`mt-4 ${statusColors[campaign.status]}`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">{campaign.name}</h2>
                  <p className="text-muted-foreground">ID: {campaign.id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={typeColors[campaign.type]}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {campaign.type.toUpperCase()}
                    </Badge>
                  </div>
                  {campaign.scheduledAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Scheduled: {format(campaign.scheduledAt, 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Target Segments</p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.targetSegment.map(segment => (
                      <Badge key={segment} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sent Count</p>
                  <p className="text-2xl font-bold">{campaign.sentCount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-status-success/20">
                  <Eye className="h-6 w-6 text-status-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <p className="text-2xl font-bold">{campaign.openRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-status-warning/20">
                  <MousePointer className="h-6 w-6 text-status-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                  <p className="text-2xl font-bold">{campaign.clickRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Gift className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Redemption Rate</p>
                  <p className="text-2xl font-bold">{campaign.redemptionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Campaign Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <p className="text-lg leading-relaxed">{campaign.content}</p>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{campaign.content.length} characters</span>
                <span>•</span>
                <span>{campaign.content.split(' ').length} words</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Performance Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Sent</span>
                  <span className="text-sm font-medium">{campaign.sentCount.toLocaleString()}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Opened</span>
                  <span className="text-sm font-medium">{Math.round(campaign.sentCount * campaign.openRate / 100).toLocaleString()}</span>
                </div>
                <Progress value={campaign.openRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Clicked</span>
                  <span className="text-sm font-medium">{Math.round(campaign.sentCount * campaign.clickRate / 100).toLocaleString()}</span>
                </div>
                <Progress value={campaign.clickRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Redeemed</span>
                  <span className="text-sm font-medium">{Math.round(campaign.sentCount * campaign.redemptionRate / 100).toLocaleString()}</span>
                </div>
                <Progress value={campaign.redemptionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Target Audience */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Target Audience ({targetedCustomers.length} customers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {targetedCustomers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {targetedCustomers.map(customer => (
                  <div 
                    key={customer.id}
                    className="p-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/80 transition-colors"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{customer.segment.replace('-', ' ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No customers match the target segments</p>
            )}
          </CardContent>
        </Card>

        {/* Campaign Timeline */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Campaign Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-status-success" />
                <div className="flex-1">
                  <p className="font-medium">Campaign Created</p>
                  <p className="text-sm text-muted-foreground">Draft saved and ready for review</p>
                </div>
              </div>
              {campaign.scheduledAt && (
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-status-warning" />
                  <div className="flex-1">
                    <p className="font-medium">Scheduled for Launch</p>
                    <p className="text-sm text-muted-foreground">{format(campaign.scheduledAt, 'MMMM dd, yyyy \'at\' HH:mm')}</p>
                  </div>
                </div>
              )}
              {campaign.status === 'active' && (
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <div className="flex-1">
                    <p className="font-medium">Currently Active</p>
                    <p className="text-sm text-muted-foreground">Sending to target audience</p>
                  </div>
                </div>
              )}
              {campaign.status === 'completed' && (
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Campaign Completed</p>
                    <p className="text-sm text-muted-foreground">All messages delivered</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdvertisementDetail;
