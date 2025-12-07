import { Customer } from '@/types/restaurant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface CustomerListProps {
  customers: Customer[];
}

const segmentColors: Record<string, string> = {
  vip: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  regular: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  occasional: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'first-time': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export const CustomerList = ({ customers }: CustomerListProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Customer</TableHead>
            <TableHead className="text-muted-foreground">Email</TableHead>
            <TableHead className="text-muted-foreground">Phone</TableHead>
            <TableHead className="text-muted-foreground">Segment</TableHead>
            <TableHead className="text-muted-foreground">Visits</TableHead>
            <TableHead className="text-muted-foreground">Total Spent</TableHead>
            <TableHead className="text-muted-foreground">Avg Spending</TableHead>
            <TableHead className="text-muted-foreground">Last Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow 
              key={customer.id} 
              className="border-border cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/customers/${customer.id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{customer.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{customer.email}</TableCell>
              <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
              <TableCell>
                <Badge variant="outline" className={segmentColors[customer.segment]}>
                  {customer.segment.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground">{customer.visitCount}</TableCell>
              <TableCell className="text-foreground font-medium">${customer.totalSpent.toLocaleString()}</TableCell>
              <TableCell className="text-foreground">${customer.avgSpending}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(customer.lastVisit).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
