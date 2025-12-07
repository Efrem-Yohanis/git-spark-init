import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, FileText, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CreateChefDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateChefDialog = ({ open, onOpenChange }: CreateChefDialogProps) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    employeeId: '',
    position: '',
    experience: '',
    kitchenSection: '',
    assignedMealType: '',
    workShift: '',
    salary: '',
  });

  const [documents, setDocuments] = useState({
    idPassport: null as File | null,
    healthCertificate: null as File | null,
    foodSafetyCertificate: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.employeeId || !formData.position) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Chef Added",
      description: `${formData.fullName} has been added successfully`,
    });
    onOpenChange(false);
    setFormData({
      fullName: '',
      gender: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      address: '',
      employeeId: '',
      position: '',
      experience: '',
      kitchenSection: '',
      assignedMealType: '',
      workShift: '',
      salary: '',
    });
    setDocuments({
      idPassport: null,
      healthCertificate: null,
      foodSafetyCertificate: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Chef</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="job" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Job Info
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 555-0000"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="chef@restaurant.com"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="job" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  placeholder="EMP-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Select value={formData.position} onValueChange={(v) => handleInputChange('position', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="head_chef">Head Chef</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="assistant_chef">Assistant Chef</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kitchenSection">Kitchen Section</Label>
                <Select value={formData.kitchenSection} onValueChange={(v) => handleInputChange('kitchenSection', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Veg</SelectItem>
                    <SelectItem value="non_veg">Non-veg</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedMealType">Assigned Meal Type</Label>
                <Select value={formData.assignedMealType} onValueChange={(v) => handleInputChange('assignedMealType', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workShift">Work Shift</Label>
                <Select value={formData.workShift} onValueChange={(v) => handleInputChange('workShift', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="rotational">Rotational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="50000"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <div className="space-y-4">
              {[
                { key: 'idPassport', label: 'ID / Passport' },
                { key: 'healthCertificate', label: 'Health Certificate' },
                { key: 'foodSafetyCertificate', label: 'Food Safety Certificate' },
              ].map((doc) => (
                <div key={doc.key} className="p-4 border border-dashed border-border rounded-lg">
                  <Label className="text-sm font-medium">{doc.label}</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <Input
                      type="file"
                      className="flex-1"
                      onChange={(e) => handleFileChange(doc.key as keyof typeof documents, e.target.files?.[0] || null)}
                    />
                    {documents[doc.key as keyof typeof documents] && (
                      <span className="text-sm text-muted-foreground">
                        {documents[doc.key as keyof typeof documents]?.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground">
            Add Chef
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
