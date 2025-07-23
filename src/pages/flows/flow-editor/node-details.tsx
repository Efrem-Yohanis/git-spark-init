import { useState } from "react";
import { Node } from "@xyflow/react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NodeDetailsProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
}

export function NodeDetails({ selectedNode, onUpdateNode }: NodeDetailsProps) {
  const [isSubnodesOpen, setIsSubnodesOpen] = useState(true);
  const [isParamsOpen, setIsParamsOpen] = useState(true);

  if (!selectedNode) {
    return (
      <div className="w-80 border-l border-border bg-muted/50 p-4">
        <div className="text-center text-muted-foreground">
          <p>Select a node to view details</p>
        </div>
      </div>
    );
  }

  const handleAddSubnode = () => {
    const newSubnode = {
      id: `subnode-${Date.now()}`,
      name: "New Subnode",
      scriptName: "",
      deployed: false,
    };
    
    const currentSubnodes = Array.isArray(selectedNode.data.subnodes) ? selectedNode.data.subnodes : [];
    const updatedSubnodes = [...currentSubnodes, newSubnode];
    onUpdateNode(selectedNode.id, { subnodes: updatedSubnodes });
  };

  const handleRemoveNode = () => {
    // This would be handled by the parent component
    console.log("Remove node:", selectedNode.id);
  };

  return (
    <div className="w-80 border-l border-border bg-muted/50 p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Node Details</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nodeName">Node Name</Label>
              <Input
                id="nodeName"
                value={String(selectedNode.data.label || "")}
                onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
              />
            </div>

            <div>
              <Label>Node Type</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {String(selectedNode.data.nodeType || "Unknown")}
              </p>
            </div>

            <div>
              <Label>Deployment Status</Label>
              <div className="mt-1">
                <Badge variant={selectedNode.data.deployed ? "default" : "outline"}>
                  {selectedNode.data.deployed ? "Deployed" : "Not Deployed"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Collapsible open={isSubnodesOpen} onOpenChange={setIsSubnodesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Subnodes</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isSubnodesOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="space-y-2">
              {Array.isArray(selectedNode.data.subnodes) && selectedNode.data.subnodes.map((subnode: any) => (
                <div key={subnode.id} className="p-3 border rounded-lg bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{subnode.name}</span>
                    <Badge variant={subnode.deployed ? "default" : "outline"} className="text-xs">
                      {subnode.deployed ? "Deployed" : "Not Deployed"}
                    </Badge>
                  </div>
                  {subnode.scriptName && (
                    <p className="text-xs text-muted-foreground">
                      Script: {subnode.scriptName}
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddSubnode}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subnode
            </Button>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isParamsOpen} onOpenChange={setIsParamsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="font-medium">Parameters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isParamsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="space-y-2">
              {Array.isArray(selectedNode.data.parameters) && selectedNode.data.parameters.map((param: any) => (
                <div key={param.id} className="p-3 border rounded-lg bg-background">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{param.key}</span>
                      <Badge variant="outline" className="text-xs">
                        {param.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Default: {param.defaultValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Parameter
            </Button>
          </CollapsibleContent>
        </Collapsible>

        <div className="pt-4 border-t">
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={handleRemoveNode}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Node
          </Button>
        </div>
      </div>
    </div>
  );
}