import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { hourlyOrderData } from '@/data/mockData';

export const RevenueChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
          <p className="text-sm text-muted-foreground">Hourly revenue breakdown</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyOrderData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`$${value}`, 'Revenue']}
              labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
            />
            <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
