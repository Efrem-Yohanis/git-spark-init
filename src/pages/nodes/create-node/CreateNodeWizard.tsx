import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nodeService } from "@/services/nodeService";
import { subnodeService } from "@/services/subnodeService";
import { useParameters } from "@/services/parameterService";

// Stage Components
import { NodeFamilyStage } from "./stages/NodeFamilyStage";
import { NodeVersionStage } from "./stages/NodeVersionStage";
import { LinkSubnodeStage } from "./stages/LinkSubnodeStage";
import { ParameterValuesStage } from "./stages/ParameterValuesStage";

export interface WizardData {
  // Stage 1: Node Family
  nodeFamilyName: string;
  nodeFamilyDescription: string;
  
  // Stage 2: Node Version
  versionNumber: number;
  changelog: string;
  scriptFile: File | null;
  state: string;
  sourceVersion: string;
  selectedParameterIds: string[];
  
  // Stage 3: Link SubNode
  subnodeName: string;
  subnodeDescription: string;
  linkedNodeVersionId: string;
  
  // Stage 4: Parameter Values
  selectedSubnodeId: string;
  parameterValues: Record<string, string>;
  
  // Runtime data
  createdNodeId?: string;
  createdNodeVersionId?: string;
  createdSubnodeId?: string;
}

const STAGES = [
  { id: 1, title: "Create Node Family", description: "Define the container or type of Node" },
  { id: 2, title: "Create Node Version", description: "Add version and attach script" },
  { id: 3, title: "Link SubNode", description: "Assign SubNode to NodeVersion" },
  { id: 4, title: "Update Parameter Values", description: "Provide actual parameter values" },
];

export function CreateNodeWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: availableParameters = [] } = useParameters();
  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [wizardData, setWizardData] = useState<WizardData>({
    // Stage 1
    nodeFamilyName: "",
    nodeFamilyDescription: "",
    
    // Stage 2
    versionNumber: 1,
    changelog: "",
    scriptFile: null,
    state: "draft",
    sourceVersion: "",
    selectedParameterIds: [],
    
    // Stage 3
    subnodeName: "",
    subnodeDescription: "",
    linkedNodeVersionId: "",
    
    // Stage 4
    selectedSubnodeId: "",
    parameterValues: {},
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const validateStage = (stage: number): boolean => {
    switch (stage) {
      case 1:
        return !!(wizardData.nodeFamilyName.trim());
      case 2:
        return !!(wizardData.scriptFile);
      case 3:
        return !!(wizardData.subnodeName.trim());
      case 4:
        return true; // Parameter values are optional
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!validateStage(currentStage)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Execute backend actions based on current stage
      if (currentStage === 1) {
        // Create Node Family
        const newNode = await nodeService.createNode({
          name: wizardData.nodeFamilyName,
          description: wizardData.nodeFamilyDescription,
          script: wizardData.scriptFile?.name || ''
        });
        updateWizardData({ 
          createdNodeId: newNode.id,
          linkedNodeVersionId: newNode.id // For stage 3
        });
      } else if (currentStage === 2) {
        // Create Node Version and attach script/parameters
        if (wizardData.selectedParameterIds.length > 0 && wizardData.createdNodeId) {
          await nodeService.addParametersToVersion(
            wizardData.createdNodeId, 
            wizardData.versionNumber, 
            wizardData.selectedParameterIds
          );
        }
      } else if (currentStage === 3) {
        // Create SubNode and link to NodeVersion
        if (wizardData.createdNodeId) {
          const newSubnode = await subnodeService.createSubnode({
            name: wizardData.subnodeName,
            description: wizardData.subnodeDescription,
            node: wizardData.createdNodeId
          });
          updateWizardData({ 
            createdSubnodeId: newSubnode.id,
            selectedSubnodeId: newSubnode.id 
          });
        }
      } else if (currentStage === 4) {
        // Update Parameter Values
        if (wizardData.createdSubnodeId && Object.keys(wizardData.parameterValues).length > 0) {
          const parameterValues = Object.entries(wizardData.parameterValues).map(([key, value]) => {
            // Find the parameter to get its ID
            const param = availableParameters.find(p => p.key === key);
            return {
              id: param?.id || '',
              value
            };
          }).filter(pv => pv.id); // Only include parameters with valid IDs
          
          await subnodeService.updateParameterValues(wizardData.createdSubnodeId, {
            parameter_values: parameterValues
          });
        }

        // Final success
        toast({
          title: "Success",
          description: "Node creation wizard completed successfully"
        });
        navigate("/nodes");
        return;
      }

      setCurrentStage(prev => prev + 1);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1);
    }
  };

  const handleCancel = () => {
    navigate("/nodes");
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 1:
        return (
          <NodeFamilyStage
            data={wizardData}
            updateData={updateWizardData}
          />
        );
      case 2:
        return (
          <NodeVersionStage
            data={wizardData}
            updateData={updateWizardData}
          />
        );
      case 3:
        return (
          <LinkSubnodeStage
            data={wizardData}
            updateData={updateWizardData}
          />
        );
      case 4:
        return (
          <ParameterValuesStage
            data={wizardData}
            updateData={updateWizardData}
          />
        );
      default:
        return null;
    }
  };

  const currentStageInfo = STAGES.find(stage => stage.id === currentStage);
  const progress = (currentStage / STAGES.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Node - {currentStageInfo?.title}</h1>
        <div className="text-sm text-muted-foreground">
          Step {currentStage} of {STAGES.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">{currentStageInfo?.description}</p>
      </div>

      {/* Stage Navigation */}
      <div className="flex justify-between items-center">
        {STAGES.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStage >= stage.id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {stage.id}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className={`text-sm font-medium ${
                currentStage >= stage.id ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {stage.title}
              </p>
            </div>
            {index < STAGES.length - 1 && (
              <div className={`
                h-0.5 w-12 mx-4
                ${currentStage > stage.id ? 'bg-primary' : 'bg-muted'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Stage Content */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStageInfo?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStageContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          {currentStage > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        
        <Button 
          onClick={handleNext} 
          disabled={isLoading || !validateStage(currentStage)}
        >
          {isLoading ? "Processing..." : currentStage === STAGES.length ? "Complete" : "Next"}
          {currentStage < STAGES.length && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}