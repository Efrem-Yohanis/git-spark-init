import { useState } from "react";
import { Search, User, MapPin, Phone, Mail, Calendar, CreditCard, Gift, MessageSquare, TrendingUp, AlertTriangle, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const customerData = {
  msisdn: "254***456789",
  name: "Jane Wanjiku",
  status: "Active",
  kycLevel: "Full KYC",
  region: "Nairobi",
  city: "Westlands",
  age: 32,
  gender: "Female",
  registeredDate: "2021-03-15",
  lastActive: "2024-01-15",
  lifetimeValue: 245000,
  monthlyAvg: 12500,
  churnScore: 15,
  tier: "Gold",
};

const transactions = [
  { id: 1, date: "2024-01-15 14:32", type: "Send Money", amount: 2500, status: "Completed" },
  { id: 2, date: "2024-01-14 09:15", type: "Pay Bill", amount: 5000, status: "Completed" },
  { id: 3, date: "2024-01-13 16:45", type: "Buy Goods", amount: 1200, status: "Completed" },
  { id: 4, date: "2024-01-12 11:20", type: "Withdraw", amount: 3000, status: "Completed" },
  { id: 5, date: "2024-01-10 08:00", type: "Send Money", amount: 500, status: "Completed" },
];

const campaigns = [
  { id: 1, name: "Festive Rewards", date: "2024-01-05", status: "Delivered", reward: "KES 50" },
  { id: 2, name: "New Year Promo", date: "2023-12-31", status: "Activated", reward: "KES 100" },
  { id: 3, name: "Loyalty Bonus", date: "2023-12-15", status: "Delivered", reward: "-" },
];

const messages = [
  { id: 1, date: "2024-01-15", channel: "SMS", content: "Your M-Pesa balance is..." },
  { id: 2, date: "2024-01-10", channel: "Push", content: "Enjoy 10% cashback on..." },
  { id: 3, date: "2024-01-05", channel: "SMS", content: "Happy New Year! Get your..." },
];

export default function Customer360() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomer, setShowCustomer] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Customer 360°</h1>
        <p className="text-muted-foreground">Complete customer profile and activity view</p>
      </div>

      {/* Search */}
      <div className="flex gap-4 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by MSISDN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>Search</Button>
      </div>

      {showCustomer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar & Status */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JW</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{customerData.name}</p>
                  <p className="text-muted-foreground">{customerData.msisdn}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-success/10 text-success border-success/20">
                      {customerData.status}
                    </Badge>
                    <Badge variant="outline">{customerData.tier}</Badge>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">KYC Level:</span>
                  <span className="font-medium">{customerData.kycLevel}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{customerData.city}, {customerData.region}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Demographics:</span>
                  <span className="font-medium">{customerData.gender}, {customerData.age} years</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Registered:</span>
                  <span className="font-medium">{customerData.registeredDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Active:</span>
                  <span className="font-medium">{customerData.lastActive}</span>
                </div>
              </div>

              {/* Value Metrics */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lifetime Value</span>
                  <span className="font-bold">KES {customerData.lifetimeValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Avg</span>
                  <span className="font-medium">KES {customerData.monthlyAvg.toLocaleString()}</span>
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">AI Insights</h4>
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Churn Score</span>
                    <span className="text-success font-bold">{customerData.churnScore}% Low</span>
                  </div>
                  <Progress value={customerData.churnScore} className="h-2 [&>div]:bg-success" />
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Recommended Action:</p>
                  <p className="text-sm font-medium mt-1">Offer tier upgrade to Platinum</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transactions">
                <TabsList className="mb-4">
                  <TabsTrigger value="transactions" className="gap-2">
                    <CreditCard className="w-4 h-4" />
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="campaigns" className="gap-2">
                    <Gift className="w-4 h-4" />
                    Campaigns
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Messages
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent">
                          <CreditCard className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">KES {tx.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="campaigns" className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent">
                          <Gift className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">{campaign.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{campaign.reward}</p>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            campaign.status === "Activated" 
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-info/10 text-info border-info/20"
                          )}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="messages" className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="p-2 rounded-lg bg-accent">
                        <MessageSquare className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{msg.channel}</Badge>
                          <span className="text-sm text-muted-foreground">{msg.date}</span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
