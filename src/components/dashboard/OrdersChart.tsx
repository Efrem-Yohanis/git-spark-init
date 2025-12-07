import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { hourlyOrderData } from '@/data/mockData';

export const OrdersChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Orders by Hour</h3>
          <p className="text-sm text-muted-foreground">Today's order distribution</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Orders</span>
          </div>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyOrderData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(35, 100%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(222, 30%, 18%)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                boxShadow: '0 4px 16px hsl(222, 47%, 2%, 0.4)',
              }}
              labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              itemStyle={{ color: 'hsl(35, 100%, 55%)' }}
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="hsl(35, 100%, 55%)"
              strokeWidth={2}
              fill="url(#orderGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
