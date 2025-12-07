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
import { toast } from '@/hooks/use-toast';

const customerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 characters').max(20, 'Phone too long'),
  segment: z.enum(['vip', 'regular', 'occasional', 'first-time']),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CreateCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCustomerDialog = ({ open, onOpenChange }: CreateCustomerDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      segment: 'regular',
    },
  });

  const onSubmit = (data: CustomerFormData) => {
    console.log('Customer created:', data);
    toast({
      title: 'Customer Added',
      description: `${data.name} has been added to the database.`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Customer</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new customer to the database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              className="bg-background border-border"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              className="bg-background border-border"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              className="bg-background border-border"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="segment">Customer Segment</Label>
            <Select defaultValue="regular" onValueChange={(value) => setValue('segment', value as any)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="occasional">Occasional</SelectItem>
                <SelectItem value="first-time">First-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};