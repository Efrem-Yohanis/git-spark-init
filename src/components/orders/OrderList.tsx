import { Order } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { Clock, User, ChefHat, Smartphone, Globe, QrCode, Users, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrderListProps {
  orders: Order[];
  onOrderClick?: (order: Order) => void;
}

const statusConfig = {
  new: { label: 'New', className: 'status-new' },
  kitchen: { label: 'In Kitchen', className: 'status-kitchen' },
  ready: { label: 'Ready', className: 'status-pending' },
  delivered: { label: 'Delivered', className: 'status-delivered' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground' },
};

const sourceConfig = {
  mobile: { icon: Smartphone, label: 'Mobile' },
  waiter: { icon: Users, label: 'Waiter' },
  qr: { icon: QrCode, label: 'QR' },
  web: { icon: Globe, label: 'Web' },
};

export const OrderList = ({ orders, onOrderClick }: OrderListProps) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">Order ID</TableHead>
            <TableHead className="text-muted-foreground">Table</TableHead>
            <TableHead className="text-muted-foreground">Customer</TableHead>
            <TableHead className="text-muted-foreground">Source</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Items</TableHead>
            <TableHead className="text-muted-foreground text-right">Amount</TableHead>
            <TableHead className="text-muted-foreground">Time</TableHead>
            <TableHead className="text-muted-foreground">Staff</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const source = sourceConfig[order.source];
            return (
              <TableRow
                key={order.id}
                className="cursor-pointer hover:bg-muted/50 border-border"
                onClick={() => onOrderClick?.(order)}
              >
                <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                <TableCell className="text-foreground">#{order.tableNumber}</TableCell>
                <TableCell className="text-foreground">{order.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <source.icon className="h-3.5 w-3.5" />
                    <span className="text-sm">{source.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.className)}>
                    {status.label}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.items.length} items</TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  ${order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {order.assignedWaiter && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                      </div>
                    )}
                    {order.assignedChef && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ChefHat className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
