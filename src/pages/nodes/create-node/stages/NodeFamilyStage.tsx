import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WizardData } from "../CreateNodeWizard";

interface NodeFamilyStageProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

export function NodeFamilyStage({ data, updateData }: NodeFamilyStageProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nodeFamilyName">Node Family Name *</Label>
          <Input
            id="nodeFamilyName"
            value={data.nodeFamilyName}
            onChange={(e) => updateData({ nodeFamilyName: e.target.value })}
            placeholder="Enter node family name (must be unique)"
          />
          <p className="text-sm text-muted-foreground mt-1">
            This will be the main identifier for your node type
          </p>
        </div>

        <div>
          <Label htmlFor="nodeFamilyDescription">Description</Label>
          <Textarea
            id="nodeFamilyDescription"
            value={data.nodeFamilyDescription}
            onChange={(e) => updateData({ nodeFamilyDescription: e.target.value })}
            placeholder="Describe what this node family does..."
            rows={4}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Optional: Provide a detailed description of the node's purpose
          </p>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">What is a Node Family?</h4>
          <p className="text-sm text-muted-foreground">
            A Node Family defines the "container" or type of Node. It serves as the base template 
            that will contain different versions, each with their own scripts and configurations.
          </p>
        </div>
      </div>
    </div>
  );
}