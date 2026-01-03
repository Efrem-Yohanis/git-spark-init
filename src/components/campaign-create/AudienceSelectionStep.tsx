import { useState, useRef } from "react";
import { Search, Users, TrendingUp, TrendingDown, Upload, X, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CampaignFormData } from "@/pages/CampaignCreate";

interface AudienceSelectionStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

interface Segment {
  id: string;
  name: string;
  customerCount: number;
  activePercent: number;
  dormantPercent: number;
}

const segments: Segment[] = [
  { id: "seg-1", name: "High Value Active", customerCount: 45000, activePercent: 95, dormantPercent: 5 },
  { id: "seg-2", name: "Dormant 60 Days", customerCount: 28000, activePercent: 0, dormantPercent: 100 },
  { id: "seg-3", name: "Youth Urban", customerCount: 78000, activePercent: 72, dormantPercent: 28 },
  { id: "seg-4", name: "Rural Farmers", customerCount: 52000, activePercent: 68, dormantPercent: 32 },
  { id: "seg-5", name: "Business Owners", customerCount: 15000, activePercent: 88, dormantPercent: 12 },
  { id: "seg-6", name: "New Registrations", customerCount: 32000, activePercent: 80, dormantPercent: 20 },
  { id: "seg-7", name: "Micro Merchants", customerCount: 18000, activePercent: 75, dormantPercent: 25 },
];

export function AudienceSelectionStep({ formData, updateFormData }: AudienceSelectionStepProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSegments = segments.filter((s) => formData.selectedSegmentIds.includes(s.id));
  
  const totalCustomers = selectedSegments.reduce((sum, s) => sum + s.customerCount, 0) + 
    (formData.uploadedFileCustomers || 0);
  
  const avgActivePercent = selectedSegments.length > 0
    ? Math.round(selectedSegments.reduce((sum, s) => sum + s.activePercent * s.customerCount, 0) / 
        selectedSegments.reduce((sum, s) => sum + s.customerCount, 0))
    : 0;

  const handleSegmentToggle = (segmentId: string) => {
    const newIds = formData.selectedSegmentIds.includes(segmentId)
      ? formData.selectedSegmentIds.filter((id) => id !== segmentId)
      : [...formData.selectedSegmentIds, segmentId];
    
    const newSelectedSegments = segments.filter((s) => newIds.includes(s.id));
    const newTotalCustomers = newSelectedSegments.reduce((sum, s) => sum + s.customerCount, 0) +
      (formData.uploadedFileCustomers || 0);
    
    updateFormData({
      selectedSegmentIds: newIds,
      totalCustomers: newTotalCustomers,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['.xlsx', '.csv'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        alert('Please upload a .xlsx or .csv file');
        return;
      }

      // Mock: In production, parse the file to get customer count
      const mockCustomerCount = Math.floor(Math.random() * 10000) + 1000;
      
      updateFormData({
        uploadedFileName: file.name,
        uploadedFileCustomers: mockCustomerCount,
        totalCustomers: selectedSegments.reduce((sum, s) => sum + s.customerCount, 0) + mockCustomerCount,
      });
    }
  };

  const handleRemoveFile = () => {
    updateFormData({
      uploadedFileName: "",
      uploadedFileCustomers: 0,
      totalCustomers: selectedSegments.reduce((sum, s) => sum + s.customerCount, 0),
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Audience Selection</h2>
        <p className="text-sm text-muted-foreground">Choose who will receive the campaign</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Multi-select Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Segments</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-auto min-h-10"
                >
                  {formData.selectedSegmentIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selectedSegments.map((seg) => (
                        <Badge key={seg.id} variant="secondary" className="mr-1">
                          {seg.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Search and select segments...</span>
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-popover" align="start">
                <Command>
                  <CommandInput placeholder="Search segments..." />
                  <CommandList>
                    <CommandEmpty>No segment found.</CommandEmpty>
                    <CommandGroup>
                      {segments.map((segment) => (
                        <CommandItem
                          key={segment.id}
                          onSelect={() => handleSegmentToggle(segment.id)}
                          className="cursor-pointer"
                        >
                          <Checkbox
                            checked={formData.selectedSegmentIds.includes(segment.id)}
                            className="mr-2"
                          />
                          <div className="flex-1">
                            <span className="font-medium">{segment.name}</span>
                            <span className="text-muted-foreground ml-2">
                              ({segment.customerCount.toLocaleString()} customers)
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Additional Audience (Optional)</label>
            <div className="border-2 border-dashed p-4">
              {formData.uploadedFileName ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{formData.uploadedFileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.uploadedFileCustomers?.toLocaleString()} customers
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Accepts .xlsx, .csv files. MSISDN column required.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audience-file"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audience Summary Panel */}
        <div className="space-y-4">
          <h3 className="font-semibold">Audience Summary</h3>
          {(formData.selectedSegmentIds.length > 0 || formData.uploadedFileName) ? (
            <div className="border p-4 space-y-4">
              {/* Selected Segments */}
              {selectedSegments.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Selected Segments</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSegments.map((seg) => (
                      <Badge key={seg.id} variant="outline">
                        {seg.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded File */}
              {formData.uploadedFileName && (
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded File</p>
                  <p className="font-medium">{formData.uploadedFileName}</p>
                </div>
              )}

              {/* Total Customers */}
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <p className="text-xl font-bold">{totalCustomers.toLocaleString()}</p>
                </div>
              </div>

              {/* Active/Dormant Split */}
              {selectedSegments.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-success/10 border border-success/20">
                    <div className="flex items-center gap-1 text-success">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">Active</span>
                    </div>
                    <p className="text-lg font-bold">{avgActivePercent}%</p>
                  </div>
                  <div className="p-3 bg-warning/10 border border-warning/20">
                    <div className="flex items-center gap-1 text-warning">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-xs">Dormant</span>
                    </div>
                    <p className="text-lg font-bold">{100 - avgActivePercent}%</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border p-6 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Select segments or upload a file</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
