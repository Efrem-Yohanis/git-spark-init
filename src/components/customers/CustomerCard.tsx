import { Customer } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { Star, Calendar, DollarSign, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface CustomerCardProps {
  customer: Customer;
}

const tierConfig = {
  bronze: { label: 'Bronze', className: 'bg-amber-700/20 text-amber-600' },
  silver: { label: 'Silver', className: 'bg-slate-400/20 text-slate-400' },
  gold: { label: 'Gold', className: 'bg-yellow-500/20 text-yellow-500' },
  platinum: { label: 'Platinum', className: 'bg-purple-500/20 text-purple-400' },
};

const segmentConfig = {
  regular: { label: 'Regular', className: 'bg-status-info/20 text-status-info' },
  occasional: { label: 'Occasional', className: 'bg-status-pending/20 text-status-pending' },
  'first-time': { label: 'New', className: 'bg-status-new/20 text-status-new' },
  vip: { label: 'VIP', className: 'bg-primary/20 text-primary' },
};

export const CustomerCard = ({ customer }: CustomerCardProps) => {
  const navigate = useNavigate();
  const tier = tierConfig[customer.loyaltyTier];
  const segment = segmentConfig[customer.segment];

  return (
    <div 
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/customers/${customer.id}`)}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border-2 border-border">
          <AvatarImage src={customer.avatar} alt={customer.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-foreground">{customer.name}</h4>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <div className="flex gap-1.5">
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', tier.className)}>
                {tier.label}
              </span>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', segment.className)}>
                {segment.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3" />
            <span>Visits</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{customer.visitCount}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3" />
            <span>Total Spent</span>
          </div>
          <p className="text-lg font-semibold text-foreground">${customer.totalSpent.toFixed(0)}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Last Visit</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {formatDistanceToNow(customer.lastVisit, { addSuffix: true })}
          </p>
        </div>
      </div>

      {customer.favoriteItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Heart className="h-3 w-3" />
            <span>Favorites</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {customer.favoriteItems.slice(0, 3).map((item) => (
              <span key={item} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
