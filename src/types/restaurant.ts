export type OrderStatus = 'new' | 'kitchen' | 'ready' | 'delivered' | 'completed';
export type OrderSource = 'mobile' | 'waiter' | 'qr' | 'web';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifications?: string[];
  specialInstructions?: string;
}

export interface OrderTimeline {
  timestamp: Date;
  event: string;
  actor?: string;
  details?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  customerName: string;
  customerId?: string;
  source: OrderSource;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
  estimatedTime?: number;
  assignedChef?: string;
  assignedWaiter?: string;
  timeline: OrderTimeline[];
}

export interface Staff {
  id: string;
  name: string;
  role: 'waiter' | 'chef';
  avatar?: string;
  status: 'available' | 'busy' | 'break' | 'offline';
  shift: string;
  currentOrders: string[];
}

export interface Waiter extends Staff {
  role: 'waiter';
  phone: string;
  assignedTables: number[];
  ordersServedToday: number;
  avgOrderValue: number;
  rating: number;
  tipsToday: number;
}

export type ChefPosition = 'head_chef' | 'chef' | 'assistant_chef';
export type KitchenSection = 'veg' | 'non_veg' | 'snacks' | 'bakery' | 'other';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
export type WorkShift = 'morning' | 'afternoon' | 'evening' | 'rotational';
export type TaskType = 'meal_preparation' | 'cleaning' | 'ingredient_preprocessing' | 'food_serving_supervision' | 'inventory_checks';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'early_leave';
export type LeaveType = 'sick' | 'annual' | 'emergency';
export type LeaveApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ChefTask {
  id: string;
  chefId: string;
  taskType: TaskType;
  description?: string;
  status: TaskStatus;
  assignedDate: Date;
  completedDate?: Date;
}

export interface ChefOrderAssignment {
  id: string;
  orderId: string;
  chefId: string;
  date: Date;
  mealType: MealType;
  taskType: TaskType;
  status: TaskStatus;
  notes?: string;
}

export interface AttendanceLog {
  id: string;
  chefId: string;
  date: Date;
  timeIn?: Date;
  timeOut?: Date;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  chefId: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  approvalStatus: LeaveApprovalStatus;
}

export interface ChefDocument {
  id: string;
  type: 'id_passport' | 'health_certificate' | 'food_safety_certificate';
  fileName: string;
  uploadedAt: Date;
}

export interface Chef extends Staff {
  role: 'chef';
  station: 'grill' | 'fry' | 'salad' | 'desserts' | 'main';
  expertise: string[];
  ordersCompletedToday: number;
  avgCookingTime: number;
  accuracyRate: number;
  // Extended fields
  employeeId?: string;
  position?: ChefPosition;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  phone?: string;
  email?: string;
  address?: string;
  experience?: number;
  kitchenSection?: KitchenSection;
  assignedMealType?: MealType;
  workShift?: WorkShift;
  salary?: number;
  joinDate?: Date;
  documents?: ChefDocument[];
  tasks?: ChefTask[];
  orderAssignments?: ChefOrderAssignment[];
  attendanceLogs?: AttendanceLog[];
  leaveRequests?: LeaveRequest[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  visitCount: number;
  totalSpent: number;
  avgSpending: number;
  favoriteItems: string[];
  lastVisit: Date;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  segment: 'regular' | 'occasional' | 'first-time' | 'vip';
}

export interface Campaign {
  id: string;
  name: string;
  type: 'push' | 'sms' | 'email' | 'qr';
  targetSegment: string[];
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  scheduledAt?: Date;
  sentCount: number;
  openRate: number;
  clickRate: number;
  redemptionRate: number;
  content: string;
}

export interface DashboardMetrics {
  ordersInKitchen: number;
  ordersDeliveredToday: number;
  newOrdersLastHour: number;
  totalRevenueToday: number;
  avgOrderValue: number;
  peakHour: string;
}
