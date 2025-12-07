import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderList } from '@/components/orders/OrderList';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { CreateOrderDialog } from '@/components/orders/CreateOrderDialog';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus, OrderSource } from '@/types/restaurant';
import { Search, Filter, X, LayoutGrid, List, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const statusFilters: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'new', label: 'New' },
  { value: 'kitchen', label: 'In Kitchen' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
];

const sourceFilters: { value: OrderSource | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sources' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'waiter', label: 'Waiter' },
  { value: 'qr', label: 'QR Code' },
  { value: 'web', label: 'Web' },
];

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<OrderSource | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || order.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage all orders across channels</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{filteredOrders.length} orders</span>
            <div className="flex items-center border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'whitespace-nowrap',
                  statusFilter === filter.value && 'gradient-primary text-primary-foreground'
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Source Filters */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Source:</span>
          <div className="flex gap-2">
            {sourceFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSourceFilter(filter.value)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  sourceFilter === filter.value
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        ) : (
          <OrderList orders={filteredOrders} onOrderClick={setSelectedOrder} />
        )}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found matching your filters</p>
          </div>
        )}

        {/* Order Detail Sheet */}
        <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <SheetContent className="w-full sm:max-w-lg bg-card border-border overflow-y-auto">
            {selectedOrder && (
              <>
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-foreground">{selectedOrder.id}</SheetTitle>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="rounded-full p-1 hover:bg-muted"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <SheetDescription>
                    Table {selectedOrder.tableNumber} • {selectedOrder.customerName}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.quantity}x {item.name}
                            </p>
                            {item.modifications && item.modifications.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.modifications.join(', ')}
                              </p>
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-3 pt-3 border-t border-border">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-foreground">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Order Timeline</h4>
                    <OrderTimeline timeline={selectedOrder.timeline} />
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Create Order Dialog */}
        <CreateOrderDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </div>
    </MainLayout>
  );
};

export default OrderManagement;
