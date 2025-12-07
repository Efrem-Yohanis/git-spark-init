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
import { Checkbox } from '@/components/ui/checkbox';

const campaignSchema = z.object({
  name: z.string().trim().min(3, 'Campaign name must be at least 3 characters').max(100, 'Name too long'),
  type: z.enum(['push', 'sms', 'email', 'qr']),
  content: z.string().trim().min(10, 'Content must be at least 10 characters').max(500, 'Content too long'),
  targetRegular: z.boolean().optional(),
  targetOccasional: z.boolean().optional(),
  targetFirstTime: z.boolean().optional(),
  targetVip: z.boolean().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCampaignDialog = ({ open, onOpenChange }: CreateCampaignDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      type: 'push',
      targetRegular: false,
      targetOccasional: false,
      targetFirstTime: false,
      targetVip: false,
    },
  });

  const onSubmit = (data: CampaignFormData) => {
    const targetSegments = [];
    if (data.targetRegular) targetSegments.push('regular');
    if (data.targetOccasional) targetSegments.push('occasional');
    if (data.targetFirstTime) targetSegments.push('first-time');
    if (data.targetVip) targetSegments.push('vip');

    if (targetSegments.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one target segment',
        variant: 'destructive',
      });
      return;
    }

    console.log('Campaign created:', { ...data, targetSegments });
    toast({
      title: 'Campaign Created',
      description: `"${data.name}" campaign has been created and saved as draft.`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up a new marketing campaign to engage your customers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              placeholder="e.g., Weekend Special Promo"
              className="bg-background border-border"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Campaign Type</Label>
            <Select defaultValue="push" onValueChange={(value) => setValue('type', value as any)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="push">Push Notification</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="qr">QR Code Promo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Target Segments</Label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch('targetRegular')}
                  onCheckedChange={(checked) => setValue('targetRegular', !!checked)}
                />
                <span className="text-sm text-foreground">Regular Customers</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch('targetOccasional')}
                  onCheckedChange={(checked) => setValue('targetOccasional', !!checked)}
                />
                <span className="text-sm text-foreground">Occasional</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch('targetFirstTime')}
                  onCheckedChange={(checked) => setValue('targetFirstTime', !!checked)}
                />
                <span className="text-sm text-foreground">First-time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={watch('targetVip')}
                  onCheckedChange={(checked) => setValue('targetVip', !!checked)}
                />
                <span className="text-sm text-foreground">VIP</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Campaign Content</Label>
            <Textarea
              id="content"
              placeholder="Write your promotional message here..."
              rows={4}
              className="bg-background border-border"
              {...register('content')}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch('content')?.length || 0}/500 characters
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Create Campaign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
