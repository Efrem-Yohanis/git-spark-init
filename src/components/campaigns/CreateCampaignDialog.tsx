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
import { RichTextEditor } from './RichTextEditor';
import { Upload, FileText, X } from 'lucide-react';

const campaignSchema = z.object({
  name: z.string().trim().min(3, 'Campaign name must be at least 3 characters').max(100, 'Name too long'),
  type: z.enum(['app-notification', 'sms', 'email']),
  content: z.string().trim().min(10, 'Content must be at least 10 characters'),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCampaignDialog = ({ open, onOpenChange }: CreateCampaignDialogProps) => {
  const [campaignType, setCampaignType] = useState<'app-notification' | 'sms' | 'email'>('app-notification');
  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState('');

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
      type: 'app-notification',
      content: '',
    },
  });

  const handleTypeChange = (value: 'app-notification' | 'sms' | 'email') => {
    setCampaignType(value);
    setValue('type', value);
    // Reset content when switching types
    if (value === 'app-notification') {
      setValue('content', '');
      setHtmlContent('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a CSV or Excel file containing customer data.',
          variant: 'destructive',
        });
        return;
      }
      setTargetFile(file);
    }
  };

  const removeFile = () => {
    setTargetFile(null);
  };

  const handleHtmlContentChange = (html: string) => {
    setHtmlContent(html);
    setValue('content', html);
  };

  const onSubmit = (data: CampaignFormData) => {
    if (campaignType !== 'app-notification' && !targetFile) {
      toast({
        title: 'Error',
        description: 'Please upload a target segments file for SMS/Email campaigns.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Campaign created:', { 
      ...data, 
      targetFile: targetFile?.name,
      htmlContent: campaignType !== 'app-notification' ? htmlContent : undefined 
    });
    
    toast({
      title: 'Campaign Created',
      description: `"${data.name}" campaign has been created and saved as draft.`,
    });
    
    reset();
    setCampaignType('app-notification');
    setTargetFile(null);
    setHtmlContent('');
    onOpenChange(false);
  };

  const isNotAppNotification = campaignType !== 'app-notification';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-card border-border max-h-[90vh] overflow-y-auto ${isNotAppNotification ? 'sm:max-w-[700px]' : 'sm:max-w-[500px]'}`}>
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
            <Select value={campaignType} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app-notification">App Notification</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Segments File - Only for SMS/Email */}
          {isNotAppNotification && (
            <div className="space-y-2">
              <Label>Target Segments (Customer List)</Label>
              <div className="space-y-3">
                {!targetFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">CSV or Excel file with customer list</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{targetFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(targetFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a file containing customer emails/phone numbers for targeted campaigns.
              </p>
            </div>
          )}

          {/* Campaign Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Campaign Content</Label>
            {isNotAppNotification ? (
              <>
                <RichTextEditor
                  content={htmlContent}
                  onChange={handleHtmlContentChange}
                  placeholder="Write your promotional message here..."
                />
                <p className="text-xs text-muted-foreground">
                  Use the toolbar to format text, add images, and create rich HTML content.
                </p>
              </>
            ) : (
              <>
                <Textarea
                  id="content"
                  placeholder="Write your notification message here..."
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
              </>
            )}
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