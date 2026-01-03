import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const data = [
  { name: "Low Risk", value: 65, color: "hsl(152, 100%, 32%)" },
  { name: "Medium Risk", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "High Risk", value: 10, color: "hsl(0, 84%, 60%)" },
];

export function ChurnRiskWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <CardTitle className="text-lg font-semibold">Churn Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm font-medium text-destructive">
            2,450 customers at high churn risk
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Recommended action: Launch win-back campaign
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
