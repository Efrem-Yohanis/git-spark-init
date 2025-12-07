import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Star,
  Heart,
  TrendingUp,
  Award,
  Clock,
  ShoppingBag,
  Crown
} from 'lucide-react';
import { mockCustomers, mockOrders } from '@/data/mockData';
import { format } from 'date-fns';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = mockCustomers.find(c => c.id === id);

  if (!customer) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Customer not found</p>
        </div>
      </MainLayout>
    );
  }

  const customerOrders = mockOrders.filter(o => o.customerId === customer.id);
  
  const tierColors = {
    bronze: 'bg-amber-700/20 text-amber-600 border-amber-700/30',
    silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
    gold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    platinum: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  const segmentColors = {
    'first-time': 'bg-blue-500/20 text-blue-400',
    occasional: 'bg-cyan-500/20 text-cyan-400',
    regular: 'bg-green-500/20 text-green-400',
    vip: 'bg-purple-500/20 text-purple-400',
  };

  const tierProgress = {
    bronze: 25,
    silver: 50,
    gold: 75,
    platinum: 100,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Customer Details</h1>
        </div>

        {/* Profile Card */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback className="text-3xl">{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex gap-2 mt-4">
                  <Badge className={tierColors[customer.loyaltyTier]}>
                    <Crown className="h-3 w-3 mr-1" />
                    {customer.loyaltyTier.charAt(0).toUpperCase() + customer.loyaltyTier.slice(1)}
                  </Badge>
                  <Badge className={segmentColors[customer.segment]}>
                    {customer.segment.charAt(0).toUpperCase() + customer.segment.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">{customer.name}</h2>
                  <p className="text-muted-foreground">ID: {customer.id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last Visit: {format(customer.lastVisit, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShoppingBag className="h-4 w-4" />
                    <span>{customer.visitCount} total visits</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Loyalty Progress</p>
                  <Progress value={tierProgress[customer.loyaltyTier]} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {customer.loyaltyTier === 'platinum' ? 'Maximum tier reached!' : `${100 - tierProgress[customer.loyaltyTier]}% to next tier`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-status-success/20">
                  <TrendingUp className="h-6 w-6 text-status-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Spending</p>
                  <p className="text-2xl font-bold">${customer.avgSpending.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-status-warning/20">
                  <ShoppingBag className="h-6 w-6 text-status-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visit Count</p>
                  <p className="text-2xl font-bold">{customer.visitCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loyalty Points</p>
                  <p className="text-2xl font-bold">{Math.floor(customer.totalSpent * 10)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Favorite Items & Order History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-status-error" />
                Favorite Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.favoriteItems.map((item, index) => (
                  <div 
                    key={item}
                    className="p-3 rounded-lg bg-background/50 border border-border/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="font-medium">{item}</span>
                    </div>
                    <Star className="h-4 w-4 text-status-warning fill-status-warning" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {customerOrders.length > 0 ? (
                <div className="space-y-3">
                  {customerOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="p-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/80 transition-colors"
                      onClick={() => navigate(`/orders`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items • Table {order.tableNumber}
                          </p>
                        </div>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(order.createdAt, 'MMM dd, HH:mm')}
                        </span>
                        <span className="text-sm font-medium text-primary">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No recent orders</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Insights */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Preferred Time</p>
                <p className="text-xl font-bold">Dinner (7-9 PM)</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Avg Party Size</p>
                <p className="text-xl font-bold">2-3 people</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <p className="text-sm text-muted-foreground mb-1">Dietary Preference</p>
                <p className="text-xl font-bold">No restrictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CustomerDetail;
