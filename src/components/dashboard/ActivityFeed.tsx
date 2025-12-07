import { cn } from '@/lib/utils';
import { Clock, ChefHat, Users, CheckCircle, AlertCircle, Plus } from 'lucide-react';

interface Activity {
  id: string;
  type: 'new_order' | 'kitchen' | 'delivered' | 'chef_assigned' | 'waiter_pickup';
  message: string;
  time: string;
  actor?: string;
}

const mockActivities: Activity[] = [
  { id: '1', type: 'new_order', message: 'New order #ORD-006 received', time: '2 min ago', actor: 'Table 9' },
  { id: '2', type: 'chef_assigned', message: 'Order #ORD-005 assigned to Yuki Tanaka', time: '5 min ago' },
  { id: '3', type: 'delivered', message: 'Order #ORD-004 delivered successfully', time: '8 min ago', actor: 'Sarah Johnson' },
  { id: '4', type: 'kitchen', message: 'Order #ORD-003 moved to kitchen', time: '12 min ago' },
  { id: '5', type: 'waiter_pickup', message: 'Order #ORD-002 picked up by Mike Wilson', time: '15 min ago' },
  { id: '6', type: 'new_order', message: 'New order #ORD-005 received', time: '18 min ago', actor: 'Mobile App' },
  { id: '7', type: 'delivered', message: 'Order #ORD-001 delivered successfully', time: '22 min ago' },
  { id: '8', type: 'chef_assigned', message: 'Order #ORD-003 assigned to Marcus Chen', time: '25 min ago' },
];

const activityConfig = {
  new_order: { icon: Plus, color: 'text-status-new', bg: 'bg-status-new/10' },
  kitchen: { icon: ChefHat, color: 'text-status-kitchen', bg: 'bg-status-kitchen/10' },
  delivered: { icon: CheckCircle, color: 'text-status-delivered', bg: 'bg-status-delivered/10' },
  chef_assigned: { icon: ChefHat, color: 'text-status-info', bg: 'bg-status-info/10' },
  waiter_pickup: { icon: Users, color: 'text-status-pending', bg: 'bg-status-pending/10' },
};

export const ActivityFeed = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Live Activity</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-delivered opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-delivered"></span>
          </span>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
        {mockActivities.map((activity, index) => {
          const config = activityConfig[activity.type];
          return (
            <div
              key={activity.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0', config.bg)}>
                <config.icon className={cn('h-4 w-4', config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-tight">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  {activity.actor && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.actor}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
