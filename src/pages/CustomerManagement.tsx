import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { CustomerList } from '@/components/customers/CustomerList';
import { CreateCustomerDialog } from '@/components/customers/CreateCustomerDialog';
import { mockCustomers } from '@/data/mockData';
import { Users, Star, Search, LayoutGrid, List, Plus } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const segmentFilters = [
  { value: 'all', label: 'All Customers' },
  { value: 'vip', label: 'VIP' },
  { value: 'regular', label: 'Regular' },
  { value: 'occasional', label: 'Occasional' },
  { value: 'first-time', label: 'First-time' },
];

const CustomerManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  const vipCount = mockCustomers.filter((c) => c.segment === 'vip').length;
  const totalVisits = mockCustomers.reduce((acc, c) => acc + c.visitCount, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
            <p className="text-muted-foreground mt-1">Customer relationship and behavior analytics</p>
          </div>
          <div className="flex items-center gap-3">
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
            <Button onClick={() => setDialogOpen(true)} className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              Create Customer
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="Total Customers"
              value={mockCustomers.length}
              icon={Users}
              subtitle="In database"
            />
          </div>
          <div className="rounded-xl border border-border bg-card p-1 shadow-sm">
            <MetricCard
              title="VIP Customers"
              value={vipCount}
              icon={Star}
              variant="pending"
              subtitle={`${totalVisits} total visits`}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {segmentFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSegmentFilter(filter.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  segmentFilter === filter.value
                    ? 'gradient-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <CustomerList customers={filteredCustomers} />
        )}

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No customers found matching your search</p>
          </div>
        )}

        <CreateCustomerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </MainLayout>
  );
};

export default CustomerManagement;
