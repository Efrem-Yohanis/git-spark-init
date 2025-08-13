import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WizardData } from "../CreateNodeWizard";
import { useParameters } from "@/services/parameterService";

interface ParameterValuesStageProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

export function ParameterValuesStage({ data, updateData }: ParameterValuesStageProps) {
  const { data: availableParameters } = useParameters();

  const selectedParameters = availableParameters.filter(param => 
    data.selectedParameterIds.includes(param.id)
  );

  const updateParameterValue = (parameterKey: string, value: string) => {
    const newParameterValues = {
      ...data.parameterValues,
      [parameterKey]: value
    };
    updateData({ parameterValues: newParameterValues });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">Parameter Values Configuration</h4>
        <p className="text-sm text-muted-foreground">
          Provide actual values for the parameters in your selected SubNode. These values 
          will be used when the node is executed in this runtime environment.
        </p>
      </div>

      <div>
        <Label>Selected SubNode</Label>
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="font-medium">{data.subnodeName}</div>
          <div className="text-sm text-muted-foreground">
            {data.subnodeDescription || 'No description provided'}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Linked to: {data.nodeFamilyName} (Version {data.versionNumber})
          </div>
        </div>
      </div>

      {selectedParameters.length > 0 ? (
        <div className="space-y-4">
          <Label>Parameter Values</Label>
          <p className="text-sm text-muted-foreground">
            Enter values for each parameter. Leave empty to use default values.
          </p>
          
          <div className="space-y-4">
            {selectedParameters.map((param) => (
              <div key={param.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`param-${param.key}`} className="font-medium">
                    {param.key}
                  </Label>
                  {param.required && (
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  )}
                </div>
                
                <Input
                  id={`param-${param.key}`}
                  value={data.parameterValues[param.key] || ''}
                  onChange={(e) => updateParameterValue(param.key, e.target.value)}
                  placeholder={param.default_value || `Enter value for ${param.key}`}
                />
                
                <div className="text-sm text-muted-foreground">
                  Type: {param.datatype || 'string'}
                  {param.default_value && (
                    <span> | Default: {param.default_value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Example Configuration:
            </h5>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <div><strong>host:</strong> 10.99.10.20</div>
              <div><strong>port:</strong> 1010</div>
              <div><strong>path:</strong> data/</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed rounded-lg text-center">
          <p className="text-muted-foreground text-lg mb-2">No Parameters to Configure</p>
          <p className="text-sm text-muted-foreground">
            Your NodeVersion doesn't have any parameters selected, so there are no values to configure.
            <br />
            You can complete the wizard to finish creating your node setup.
          </p>
        </div>
      )}
    </div>
  );
}