import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Clock, User, MapPin, Utensils, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type OrderStatus = 'New' | 'In Kitchen' | 'Ready' | 'Delivered';

interface Order {
  id: string;
  table: string;
  customer: string;
  waiter: string | null;
  items: number;
  status: OrderStatus;
  time: string;
  amount: number;
}

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

const orderItems = [
  { name: 'Grilled Salmon', quantity: 1, price: 24.99 },
  { name: 'Caesar Salad', quantity: 1, price: 12.99 },
  { name: 'Sparkling Water', quantity: 2, price: 6.99 },
];

const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case 'New':
      return 'status-new';
    case 'In Kitchen':
      return 'status-kitchen';
    case 'Ready':
      return 'status-ready';
    case 'Delivered':
      return 'status-delivered';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const OrderDetailModal = ({
  order,
  open,
  onOpenChange,
  onStatusUpdate,
}: OrderDetailModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return;
    
    setIsUpdating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onStatusUpdate(order.id, selectedStatus);
    setIsUpdating(false);
    toast({
      title: 'Status Updated',
      description: `Order ${order.id} status changed to ${selectedStatus}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order {order.id}</span>
            <Badge className={cn('font-medium', getStatusBadgeClass(order.status))}>
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Table</p>
                <p className="font-medium text-foreground">{order.table}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium text-foreground">{order.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium text-foreground">{order.customer}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Utensils className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Waiter</p>
                <p className="font-medium text-foreground">
                  {order.waiter || 'Unassigned'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Order Items</h4>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.quantity}x
                    </span>
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Total Amount</span>
            </div>
            <span className="text-xl font-bold text-primary">
              ${order.amount.toFixed(2)}
            </span>
          </div>

          <Separator />

          {/* Status Update */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Update Status</h4>
            <div className="flex gap-3">
              <Select
                value={selectedStatus || order.status}
                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Kitchen">In Kitchen</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || selectedStatus === order.status || isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
