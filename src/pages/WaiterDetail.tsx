import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  Users, 
  MapPin,
  Phone,
  UtensilsCrossed
} from 'lucide-react';
import { mockWaiters, mockOrders } from '@/data/mockData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const WaiterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const waiter = mockWaiters.find(w => w.id === id);

  if (!waiter) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Waiter not found</p>
        </div>
      </MainLayout>
    );
  }

  const waiterOrders = mockOrders.filter(o => o.assignedWaiter === waiter.name);
  const statusColors = {
    available: 'bg-status-success text-white',
    busy: 'bg-status-error text-white',
    break: 'bg-status-warning text-black',
    offline: 'bg-muted text-muted-foreground',
  };

  const orderStatusConfig = {
    new: { label: 'New', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    kitchen: { label: 'In Kitchen', className: 'bg-status-error/20 text-status-error border-status-error/30' },
    ready: { label: 'Ready', className: 'bg-status-warning/20 text-status-warning border-status-warning/30' },
    delivered: { label: 'Delivered', className: 'bg-status-success/20 text-status-success border-status-success/30' },
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/waiters')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Waiter Details</h1>
        </div>

        {/* Profile Card */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={waiter.avatar} alt={waiter.name} />
                  <AvatarFallback className="text-3xl">{waiter.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Badge className={`mt-4 ${statusColors[waiter.status]}`}>
                  {waiter.status.charAt(0).toUpperCase() + waiter.status.slice(1)}
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">{waiter.name}</h2>
                  <p className="text-muted-foreground">ID: {waiter.id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{waiter.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Shift: {waiter.shift}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Tables: {waiter.assignedTables.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Active Orders: {waiter.currentOrders.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-status-warning fill-status-warning" />
                  <span className="text-xl font-semibold">{waiter.rating}</span>
                  <span className="text-muted-foreground">/ 5.0 Rating</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Assigned Orders - Full Width List View */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              All Assigned Orders ({waiterOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {waiterOrders.length > 0 ? (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="text-muted-foreground">Order ID</TableHead>
                      <TableHead className="text-muted-foreground">Table</TableHead>
                      <TableHead className="text-muted-foreground">Customer</TableHead>
                      <TableHead className="text-muted-foreground">Items</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Time</TableHead>
                      <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waiterOrders.map(order => {
                      const statusStyle = orderStatusConfig[order.status];
                      return (
                        <TableRow 
                          key={order.id} 
                          className="hover:bg-muted/50 border-border cursor-pointer"
                          onClick={() => navigate('/orders')}
                        >
                          <TableCell className="font-medium text-primary">{order.id}</TableCell>
                          <TableCell className="text-foreground">Table {order.tableNumber}</TableCell>
                          <TableCell className="text-foreground">{order.customerName}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {order.items.length} items
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium border',
                              statusStyle.className
                            )}>
                              {statusStyle.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(order.createdAt, 'h:mm a')}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-foreground">
                            ${order.totalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No orders assigned to this waiter</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WaiterDetail;