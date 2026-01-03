import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Mon", active: 4000, dormant: 2400 },
  { name: "Tue", active: 3000, dormant: 1398 },
  { name: "Wed", active: 2000, dormant: 9800 },
  { name: "Thu", active: 2780, dormant: 3908 },
  { name: "Fri", active: 1890, dormant: 4800 },
  { name: "Sat", active: 2390, dormant: 3800 },
  { name: "Sun", active: 3490, dormant: 4300 },
];

export function ActivityChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Active vs Dormant Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 100%, 32%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(152, 100%, 32%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDormant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(215, 16%, 47%)' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(215, 16%, 47%)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="active"
                stroke="hsl(152, 100%, 32%)"
                fillOpacity={1}
                fill="url(#colorActive)"
                name="Active Users"
              />
              <Area
                type="monotone"
                dataKey="dormant"
                stroke="hsl(38, 92%, 50%)"
                fillOpacity={1}
                fill="url(#colorDormant)"
                name="Dormant Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
