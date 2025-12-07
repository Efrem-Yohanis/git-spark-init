import { useState } from 'react';
import { Package, Search, X, Download, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { OrderDetailModal } from './OrderDetailModal';

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

const initialOrders: Order[] = [
  { id: 'ORD-001', table: 'Table 5', customer: 'John Smith', waiter: 'Sarah Johnson', items: 3, status: 'In Kitchen', time: '7:56 PM', amount: 51.96 },
  { id: 'ORD-002', table: 'Table 12', customer: 'Emily Davis', waiter: 'Mike Wilson', items: 3, status: 'Ready', time: '7:36 PM', amount: 72.98 },
  { id: 'ORD-003', table: 'Table 8', customer: 'Michael Brown', waiter: null, items: 3, status: 'New', time: '8:18 PM', amount: 64.95 },
  { id: 'ORD-004', table: 'Table 3', customer: 'Lisa Anderson', waiter: 'Sarah Johnson', items: 2, status: 'Delivered', time: '6:51 PM', amount: 41.98 },
  { id: 'ORD-005', table: 'Table 15', customer: 'David Kim', waiter: null, items: 3, status: 'In Kitchen', time: '8:03 PM', amount: 75.95 },
];

const waiters = ['Sarah Johnson', 'Mike Wilson'];

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

export const OrdersSection = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [waiterFilter, setWaiterFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesWaiter =
      waiterFilter === 'all' ||
      (waiterFilter === 'unassigned' && !order.waiter) ||
      order.waiter === waiterFilter;

    return matchesSearch && matchesStatus && matchesWaiter;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setWaiterFilter('all');
    setDateFilter(undefined);
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== 'all' || waiterFilter !== 'all' || dateFilter;

  const exportToCSV = () => {
    const headers = ['Order ID', 'Table', 'Customer', 'Waiter', 'Items', 'Status', 'Time', 'Amount'];
    const rows = filteredOrders.map((order) => [
      order.id,
      order.table,
      order.customer,
      order.waiter || 'Unassigned',
      order.items,
      order.status,
      order.time,
      `$${order.amount.toFixed(2)}`,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setSelectedOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, status: newStatus } : prev
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">All Orders</h2>
          <p className="text-sm text-muted-foreground">View and manage all orders across waiters</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Kitchen">In Kitchen</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>

          {/* Waiter Filter */}
          <Select value={waiterFilter} onValueChange={setWaiterFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Waiters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Waiters</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {waiters.map((waiter) => (
                <SelectItem key={waiter} value={waiter}>
                  {waiter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              <X className="h-3 w-3" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Export Button */}
        <Button variant="outline" onClick={exportToCSV} className="shrink-0">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Orders Count */}
      <div className="font-semibold text-foreground">
        Orders ({filteredOrders.length})
      </div>

      {/* Orders Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Table</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Waiter</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Time</TableHead>
              <TableHead className="font-semibold text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleOrderClick(order)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.table}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    {order.waiter ? (
                      order.waiter
                    ) : (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        Unassigned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>
                    <Badge className={cn('font-medium', getStatusBadgeClass(order.status))}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.time}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${order.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};
