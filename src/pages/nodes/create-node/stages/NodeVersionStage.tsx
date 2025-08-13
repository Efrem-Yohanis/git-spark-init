import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";
import { WizardData } from "../CreateNodeWizard";
import { useParameters } from "@/services/parameterService";

interface NodeVersionStageProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

export function NodeVersionStage({ data, updateData }: NodeVersionStageProps) {
  const { data: availableParameters, loading: parametersLoading } = useParameters();
  const [parameterComboOpen, setParameterComboOpen] = useState(false);

  const availableParametersForSelection = availableParameters.filter(param =>
    !data.selectedParameterIds.includes(param.id)
  );

  const selectedParameters = availableParameters.filter(param => 
    data.selectedParameterIds.includes(param.id)
  );

  const addParameter = (parameterId: string) => {
    if (!data.selectedParameterIds.includes(parameterId)) {
      updateData({ 
        selectedParameterIds: [...data.selectedParameterIds, parameterId] 
      });
    }
  };

  const removeParameter = (parameterId: string) => {
    updateData({
      selectedParameterIds: data.selectedParameterIds.filter(id => id !== parameterId)
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateData({ scriptFile: file });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="versionNumber">Version Number</Label>
          <Input
            id="versionNumber"
            type="number"
            value={data.versionNumber}
            onChange={(e) => updateData({ versionNumber: parseInt(e.target.value) || 1 })}
            min="1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Auto-incremented version number
          </p>
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Select value={data.state} onValueChange={(value) => updateData({ state: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="changelog">Changelog</Label>
        <Textarea
          id="changelog"
          value={data.changelog}
          onChange={(e) => updateData({ changelog: e.target.value })}
          placeholder="Describe changes in this version..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="scriptFile">Script File *</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="scriptFile"
            type="file"
            accept=".py,.js,.sh,.bat"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
          <Button size="sm" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
        {data.scriptFile && (
          <p className="text-sm text-muted-foreground mt-1">
            Selected: {data.scriptFile.name}
          </p>
        )}
      </div>

      {/* Parameters Selection */}
      <div className="space-y-4">
        <div>
          <Label>Parameters</Label>
          <p className="text-sm text-muted-foreground">
            Select parameters that this version will use. Only active parameters can be selected.
          </p>
        </div>

        <Popover open={parameterComboOpen} onOpenChange={setParameterComboOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={parameterComboOpen}
              className="w-full justify-between"
            >
              Select a parameter to add...
              <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Type to search parameters..." />
              <CommandList>
                <CommandEmpty>No parameters found.</CommandEmpty>
                <CommandGroup>
                  {parametersLoading ? (
                    <CommandItem disabled>Loading parameters...</CommandItem>
                  ) : availableParametersForSelection.length === 0 ? (
                    <CommandItem disabled>No parameters available</CommandItem>
                  ) : (
                    availableParametersForSelection.map((param) => (
                      <CommandItem
                        key={param.id}
                        value={param.key}
                        onSelect={() => {
                          addParameter(param.id);
                          setParameterComboOpen(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{param.key}</span>
                          <span className="text-sm text-muted-foreground">
                            Default: {param.default_value || 'None'} | {param.required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Parameters */}
        {selectedParameters.length === 0 ? (
          <p className="text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
            No parameters selected
          </p>
        ) : (
          <div className="space-y-2">
            <Label>Selected Parameters</Label>
            <div className="space-y-2">
              {selectedParameters.map((param) => (
                <div key={param.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{param.key}</div>
                    <div className="text-sm text-muted-foreground">
                      Default: {param.default_value || 'None'} | {param.required ? 'Required' : 'Optional'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeParameter(param.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}