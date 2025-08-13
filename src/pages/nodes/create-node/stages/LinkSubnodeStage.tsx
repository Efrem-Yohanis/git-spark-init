import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { WizardData } from "../CreateNodeWizard";
import { useParameters } from "@/services/parameterService";

interface LinkSubnodeStageProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

export function LinkSubnodeStage({ data, updateData }: LinkSubnodeStageProps) {
  const { data: availableParameters } = useParameters();

  const selectedParameters = availableParameters.filter(param => 
    data.selectedParameterIds.includes(param.id)
  );

  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-medium mb-2">About SubNodes</h4>
        <p className="text-sm text-muted-foreground">
          SubNodes are runtime instances of your NodeVersion. They allow you to provide 
          specific parameter values for different environments or use cases.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="subnodeName">SubNode Name *</Label>
          <Input
            id="subnodeName"
            value={data.subnodeName}
            onChange={(e) => updateData({ subnodeName: e.target.value })}
            placeholder="Enter runtime instance name"
          />
          <p className="text-sm text-muted-foreground mt-1">
            This will be the name of your runtime instance
          </p>
        </div>

        <div>
          <Label htmlFor="subnodeDescription">SubNode Description</Label>
          <Textarea
            id="subnodeDescription"
            value={data.subnodeDescription}
            onChange={(e) => updateData({ subnodeDescription: e.target.value })}
            placeholder="Describe this runtime instance..."
            rows={3}
          />
        </div>

        <div>
          <Label>Linked Node Version</Label>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="font-medium">{data.nodeFamilyName}</div>
            <div className="text-sm text-muted-foreground">
              Version {data.versionNumber} - {data.state}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This SubNode will be linked to the NodeVersion created in the previous step
          </p>
        </div>

        {selectedParameters.length > 0 && (
          <div>
            <Label>Parameters Available for Value Assignment</Label>
            <p className="text-sm text-muted-foreground mb-3">
              These parameters from your NodeVersion will be available for value assignment in the next step
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedParameters.map((param) => (
                <div key={param.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{param.key}</span>
                    {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Type: {param.datatype || 'string'} | Default: {param.default_value || 'None'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedParameters.length === 0 && (
          <div className="p-4 border-2 border-dashed rounded-lg text-center">
            <p className="text-muted-foreground">
              No parameters were selected in the previous step.
              <br />
              You can still create the SubNode, but there will be no parameters to configure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}