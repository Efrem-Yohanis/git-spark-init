import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

const orderSchema = z.object({
  tableNumber: z.coerce.number().min(1, 'Table number is required').max(100, 'Invalid table number'),
  customerName: z.string().trim().min(1, 'Customer name is required').max(100, 'Name too long'),
  source: z.enum(['mobile', 'waiter', 'qr', 'web']),
  specialInstructions: z.string().max(500, 'Instructions too long').optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const menuItems = [
  { name: 'Grilled Salmon', price: 28.99 },
  { name: 'Ribeye Steak', price: 42.99 },
  { name: 'Caesar Salad', price: 12.99 },
  { name: 'Margherita Pizza', price: 18.99 },
  { name: 'Lobster Bisque', price: 16.99 },
  { name: 'Tiramisu', price: 9.99 },
  { name: 'Sparkling Water', price: 4.99 },
  { name: 'Red Wine', price: 15.00 },
];

export const CreateOrderDialog = ({ open, onOpenChange }: CreateOrderDialogProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      source: 'waiter',
    },
  });

  const addItem = () => {
    const menuItem = menuItems.find((item) => item.name === selectedItem);
    if (menuItem) {
      const existingIndex = items.findIndex((item) => item.name === menuItem.name);
      if (existingIndex >= 0) {
        const newItems = [...items];
        newItems[existingIndex].quantity += 1;
        setItems(newItems);
      } else {
        setItems([...items, { name: menuItem.name, quantity: 1, price: menuItem.price }]);
      }
      setSelectedItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const onSubmit = (data: OrderFormData) => {
    if (items.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one item to the order',
        variant: 'destructive',
      });
      return;
    }

    console.log('Order created:', { ...data, items, totalAmount });
    toast({
      title: 'Order Created',
      description: `Order for Table ${data.tableNumber} has been created successfully.`,
    });
    reset();
    setItems([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Order</DialogTitle>
          <DialogDescription>Fill in the order details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                type="number"
                placeholder="e.g., 5"
                className="bg-background border-border"
                {...register('tableNumber')}
              />
              {errors.tableNumber && (
                <p className="text-xs text-destructive">{errors.tableNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Order Source</Label>
              <Select
                defaultValue="waiter"
                onValueChange={(value) => setValue('source', value as any)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waiter">Waiter</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="qr">QR Code</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="Enter customer name"
              className="bg-background border-border"
              {...register('customerName')}
            />
            {errors.customerName && (
              <p className="text-xs text-destructive">{errors.customerName.message}</p>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <Label>Order Items</Label>
            <div className="flex gap-2">
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="flex-1 bg-background border-border">
                  <SelectValue placeholder="Select menu item" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name} - ${item.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addItem} disabled={!selectedItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {items.length > 0 && (
              <div className="space-y-2 mt-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm text-foreground">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                        className="w-16 h-8 text-center bg-background border-border"
                        min={1}
                      />
                      <span className="text-sm text-muted-foreground w-16 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-foreground">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
            <Textarea
              id="specialInstructions"
              placeholder="Any special requests or dietary requirements..."
              className="bg-background border-border"
              {...register('specialInstructions')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
