import { Order } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { Clock, User, ChefHat, Smartphone, Globe, QrCode, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

const statusConfig = {
  new: { label: 'New', className: 'status-new' },
  kitchen: { label: 'In Kitchen', className: 'status-kitchen' },
  ready: { label: 'Ready', className: 'status-pending' },
  delivered: { label: 'Delivered', className: 'status-delivered' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground' },
};

const sourceConfig = {
  mobile: { icon: Smartphone, label: 'Mobile App' },
  waiter: { icon: Users, label: 'Waiter' },
  qr: { icon: QrCode, label: 'QR Code' },
  web: { icon: Globe, label: 'Web' },
};

export const OrderCard = ({ order, onClick }: OrderCardProps) => {
  const status = statusConfig[order.status];
  const source = sourceConfig[order.source];

  return (
    <div
      onClick={onClick}
      className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{order.id}</h4>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.className)}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">Table {order.tableNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">${order.totalAmount.toFixed(2)}</p>
          <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
            <source.icon className="h-3 w-3" />
            <span className="text-xs">{source.label}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1 mb-3">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.quantity}x {item.name}
            </span>
            <span className="text-foreground">${(item.quantity * item.price).toFixed(2)}</span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-xs text-muted-foreground">+{order.items.length - 3} more items</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          {order.assignedWaiter && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{order.assignedWaiter}</span>
            </div>
          )}
          {order.assignedChef && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ChefHat className="h-3 w-3" />
              <span>{order.assignedChef}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(order.createdAt, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
};
