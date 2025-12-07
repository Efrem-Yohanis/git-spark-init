import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockOrders, mockWaiters } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Download, 
  Search, 
  Filter,
  UtensilsCrossed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllOrders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [waiterFilter, setWaiterFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const orderStatusConfig = {
    new: { label: 'New', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    kitchen: { label: 'In Kitchen', className: 'bg-status-error/20 text-status-error border-status-error/30' },
    ready: { label: 'Ready', className: 'bg-status-warning/20 text-status-warning border-status-warning/30' },
    delivered: { label: 'Delivered', className: 'bg-status-success/20 text-status-success border-status-success/30' },
  };

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      // Search filter
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.assignedWaiter?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      // Waiter filter
      const matchesWaiter = waiterFilter === 'all' || order.assignedWaiter === waiterFilter;

      // Date filter
      const matchesDate = !selectedDate || 
        format(order.createdAt, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

      return matchesSearch && matchesStatus && matchesWaiter && matchesDate;
    });
  }, [searchQuery, statusFilter, waiterFilter, selectedDate]);

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Table', 'Customer', 'Waiter', 'Status', 'Items', 'Amount', 'Created At'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.tableNumber,
        order.customerName,
        order.assignedWaiter || 'Unassigned',
        order.status,
        order.items.length,
        order.totalAmount.toFixed(2),
        format(order.createdAt, 'yyyy-MM-dd HH:mm')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setWaiterFilter('all');
    setSelectedDate(undefined);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Orders</h1>
            <p className="text-muted-foreground mt-1">View and manage all orders across waiters</p>
          </div>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="kitchen">In Kitchen</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              {/* Waiter Filter */}
              <Select value={waiterFilter} onValueChange={setWaiterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by waiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Waiters</SelectItem>
                  {mockWaiters.map(waiter => (
                    <SelectItem key={waiter.id} value={waiter.name}>
                      {waiter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-muted-foreground">Order ID</TableHead>
                    <TableHead className="text-muted-foreground">Table</TableHead>
                    <TableHead className="text-muted-foreground">Customer</TableHead>
                    <TableHead className="text-muted-foreground">Waiter</TableHead>
                    <TableHead className="text-muted-foreground">Items</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Time</TableHead>
                    <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => {
                      const statusStyle = orderStatusConfig[order.status as keyof typeof orderStatusConfig];
                      return (
                        <TableRow 
                          key={order.id} 
                          className="hover:bg-muted/50 border-border cursor-pointer"
                          onClick={() => navigate('/orders')}
                        >
                          <TableCell className="font-medium text-primary">{order.id}</TableCell>
                          <TableCell className="text-foreground">Table {order.tableNumber}</TableCell>
                          <TableCell className="text-foreground">{order.customerName}</TableCell>
                          <TableCell className="text-foreground">
                            {order.assignedWaiter || <span className="text-muted-foreground">Unassigned</span>}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {order.items.length} items
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium border',
                              statusStyle?.className
                            )}>
                              {statusStyle?.label || order.status}
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
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No orders found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AllOrders;