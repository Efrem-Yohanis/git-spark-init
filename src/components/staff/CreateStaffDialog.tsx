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

const waiterSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  shift: z.string().min(1, 'Shift is required'),
  assignedTables: z.string().min(1, 'Assigned tables are required'),
});

const chefSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  shift: z.string().min(1, 'Shift is required'),
  station: z.enum(['grill', 'fry', 'salad', 'desserts', 'main']),
  expertise: z.string().min(1, 'Expertise is required'),
});

type WaiterFormData = z.infer<typeof waiterSchema>;
type ChefFormData = z.infer<typeof chefSchema>;

interface CreateStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'waiter' | 'chef';
}

const WaiterForm = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<WaiterFormData>({
    resolver: zodResolver(waiterSchema),
  });

  const onSubmit = (data: WaiterFormData) => {
    console.log('Waiter created:', data);
    toast({
      title: 'Waiter Added',
      description: `${data.name} has been added to the team.`,
    });
    reset();
    onOpenChange(false);
  };

  return (
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
        <Label htmlFor="shift">Shift</Label>
        <Select onValueChange={(value) => setValue('shift', value)}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Select shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6:00 AM - 2:00 PM">6:00 AM - 2:00 PM</SelectItem>
            <SelectItem value="10:00 AM - 6:00 PM">10:00 AM - 6:00 PM</SelectItem>
            <SelectItem value="2:00 PM - 10:00 PM">2:00 PM - 10:00 PM</SelectItem>
            <SelectItem value="4:00 PM - 12:00 AM">4:00 PM - 12:00 AM</SelectItem>
          </SelectContent>
        </Select>
        {errors.shift && (
          <p className="text-xs text-destructive">{errors.shift.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignedTables">Assigned Tables</Label>
        <Input
          id="assignedTables"
          placeholder="e.g., 1, 2, 3, 4"
          className="bg-background border-border"
          {...register('assignedTables')}
        />
        {errors.assignedTables && (
          <p className="text-xs text-destructive">{errors.assignedTables.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" className="gradient-primary text-primary-foreground">
          Add Waiter
        </Button>
      </div>
    </form>
  );
};

const ChefForm = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ChefFormData>({
    resolver: zodResolver(chefSchema),
    defaultValues: {
      station: 'main',
    },
  });

  const onSubmit = (data: ChefFormData) => {
    console.log('Chef created:', data);
    toast({
      title: 'Chef Added',
      description: `${data.name} has been added to the team.`,
    });
    reset();
    onOpenChange(false);
  };

  return (
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
        <Label htmlFor="shift">Shift</Label>
        <Select onValueChange={(value) => setValue('shift', value)}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Select shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6:00 AM - 2:00 PM">6:00 AM - 2:00 PM</SelectItem>
            <SelectItem value="8:00 AM - 4:00 PM">8:00 AM - 4:00 PM</SelectItem>
            <SelectItem value="12:00 PM - 8:00 PM">12:00 PM - 8:00 PM</SelectItem>
            <SelectItem value="4:00 PM - 12:00 AM">4:00 PM - 12:00 AM</SelectItem>
          </SelectContent>
        </Select>
        {errors.shift && (
          <p className="text-xs text-destructive">{errors.shift.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="station">Kitchen Station</Label>
        <Select defaultValue="main" onValueChange={(value) => setValue('station', value as any)}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Select station" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grill">Grill</SelectItem>
            <SelectItem value="fry">Fry</SelectItem>
            <SelectItem value="salad">Salad</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
            <SelectItem value="main">Main</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expertise">Expertise</Label>
        <Input
          id="expertise"
          placeholder="e.g., Italian, Seafood, BBQ"
          className="bg-background border-border"
          {...register('expertise')}
        />
        {errors.expertise && (
          <p className="text-xs text-destructive">{errors.expertise.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" className="gradient-primary text-primary-foreground">
          Add Chef
        </Button>
      </div>
    </form>
  );
};

export const CreateStaffDialog = ({ open, onOpenChange, type }: CreateStaffDialogProps) => {
  const isWaiter = type === 'waiter';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Add New {isWaiter ? 'Waiter' : 'Chef'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details to add a new {isWaiter ? 'waiter' : 'chef'} to your team.
          </DialogDescription>
        </DialogHeader>

        {isWaiter ? (
          <WaiterForm onOpenChange={onOpenChange} />
        ) : (
          <ChefForm onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
};
