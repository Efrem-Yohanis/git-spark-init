import { Waiter, Chef } from '@/types/restaurant';
import { cn } from '@/lib/utils';
import { Star, Clock, Award, Users, ChefHat } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StaffListProps {
  staff: (Waiter | Chef)[];
  type: 'waiter' | 'chef';
}

const statusConfig = {
  available: { label: 'Available', className: 'status-delivered' },
  busy: { label: 'Busy', className: 'status-kitchen' },
  break: { label: 'On Break', className: 'status-pending' },
  offline: { label: 'Offline', className: 'bg-muted text-muted-foreground' },
};

export const StaffList = ({ staff, type }: StaffListProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">Staff</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Shift</TableHead>
            {type === 'waiter' ? (
              <>
                <TableHead className="text-muted-foreground">Tables</TableHead>
                <TableHead className="text-muted-foreground">Orders Today</TableHead>
                <TableHead className="text-muted-foreground">Rating</TableHead>
                <TableHead className="text-muted-foreground text-right">Tips</TableHead>
              </>
            ) : (
              <>
                <TableHead className="text-muted-foreground">Station</TableHead>
                <TableHead className="text-muted-foreground">Orders Today</TableHead>
                <TableHead className="text-muted-foreground">Avg Time</TableHead>
                <TableHead className="text-muted-foreground text-right">Accuracy</TableHead>
              </>
            )}
            <TableHead className="text-muted-foreground">Active Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => {
            const status = statusConfig[member.status];
            const isWaiter = member.role === 'waiter';
            const waiter = member as Waiter;
            const chef = member as Chef;

            return (
              <TableRow 
                key={member.id} 
                className="hover:bg-muted/50 border-border cursor-pointer"
                onClick={() => navigate(isWaiter ? `/waiters/${member.id}` : `/chefs/${member.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.className)}>
                    {status.label}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{member.shift}</TableCell>
                {isWaiter ? (
                  <>
                    <TableCell className="text-foreground">
                      {waiter.assignedTables.join(', ')}
                    </TableCell>
                    <TableCell className="text-foreground">{waiter.ordersServedToday}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-foreground">
                        <Star className="h-3 w-3 text-primary" />
                        {waiter.rating.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      ${waiter.tipsToday.toFixed(0)}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="text-foreground capitalize">{chef.station}</TableCell>
                    <TableCell className="text-foreground">{chef.ordersCompletedToday}</TableCell>
                    <TableCell className="text-foreground">{chef.avgCookingTime}m</TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {chef.accuracyRate}%
                    </TableCell>
                  </>
                )}
                <TableCell>
                  {member.currentOrders.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {member.currentOrders.map((orderId) => (
                        <span
                          key={orderId}
                          className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded"
                        >
                          {orderId}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
