import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Win-back Q4", targeted: 45000, activated: 12000 },
  { name: "Festive Bonus", targeted: 30000, activated: 18000 },
  { name: "New User", targeted: 25000, activated: 20000 },
  { name: "Loyalty Tier", targeted: 50000, activated: 35000 },
];

export function CampaignPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="targeted" fill="hsl(199, 89%, 48%)" name="Targeted" radius={[0, 4, 4, 0]} />
              <Bar dataKey="activated" fill="hsl(152, 100%, 32%)" name="Activated" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
