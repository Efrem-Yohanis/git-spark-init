import { Waiter, Chef } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { Clock, Star, TrendingUp, Award, Users, ChefHat } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface StaffCardProps {
  staff: Waiter | Chef;
}

const statusConfig = {
  available: { label: 'Available', className: 'status-delivered' },
  busy: { label: 'Busy', className: 'status-kitchen' },
  break: { label: 'On Break', className: 'status-pending' },
  offline: { label: 'Offline', className: 'bg-muted text-muted-foreground' },
};

export const StaffCard = ({ staff }: StaffCardProps) => {
  const navigate = useNavigate();
  const status = statusConfig[staff.status];
  const isWaiter = staff.role === 'waiter';
  const waiter = staff as Waiter;
  const chef = staff as Chef;

  const handleClick = () => {
    navigate(isWaiter ? `/waiters/${staff.id}` : `/chefs/${staff.id}`);
  };

  return (
    <div 
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border-2 border-border">
          <AvatarImage src={staff.avatar} alt={staff.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {staff.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">{staff.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                {isWaiter ? (
                  <Users className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChefHat className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground capitalize">{staff.role}</span>
                {!isWaiter && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground capitalize">{chef.station} Station</span>
                  </>
                )}
              </div>
            </div>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.className)}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          {isWaiter ? (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Orders Today</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{waiter.ordersServedToday}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" />
                  <span>Rating</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{waiter.rating.toFixed(1)}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Award className="h-3 w-3" />
                  <span>Avg. Order</span>
                </div>
                <p className="text-lg font-semibold text-foreground">${waiter.avgOrderValue.toFixed(0)}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Shift</span>
                </div>
                <p className="text-sm font-medium text-foreground">{staff.shift}</p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Orders Today</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{chef.ordersCompletedToday}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Avg. Cook Time</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{chef.avgCookingTime}m</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" />
                  <span>Accuracy</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{chef.accuracyRate}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Award className="h-3 w-3" />
                  <span>Expertise</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {chef.expertise.slice(0, 2).map((skill) => (
                    <span key={skill} className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {staff.currentOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Active Orders</p>
          <div className="flex flex-wrap gap-1.5">
            {staff.currentOrders.map((orderId) => (
              <span key={orderId} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                {orderId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
