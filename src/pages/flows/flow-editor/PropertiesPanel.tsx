import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Trash2, Play, Copy, Plus, Square, ExternalLink } from 'lucide-react';
import { subnodeService } from '@/services/subnodeService';
import { toast } from 'sonner';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export function PropertiesPanel({ selectedNode, onUpdateNode, onDeleteNode }: PropertiesPanelProps) {
  const [deployingSubnodes, setDeployingSubnodes] = useState<Set<string>>(new Set());

  const handleSubnodeDeploy = async (subnodeId: string) => {
    setDeployingSubnodes(prev => new Set(prev).add(subnodeId));
    try {
      await subnodeService.deploySubnode(subnodeId);
      toast.success("Subnode deployed successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to deploy subnode");
    } finally {
      setDeployingSubnodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(subnodeId);
        return newSet;
      });
    }
  };

  const handleSubnodeUndeploy = async (subnodeId: string) => {
    setDeployingSubnodes(prev => new Set(prev).add(subnodeId));
    try {
      await subnodeService.undeploySubnode(subnodeId);
      toast.success("Subnode undeployed successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to undeploy subnode");
    } finally {
      setDeployingSubnodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(subnodeId);
        return newSet;
      });
    }
  };
  if (!selectedNode) {
    return (
      <div className="w-80 bg-card border-l border-border shadow-sm flex items-center justify-center">
        <div className="text-center p-6">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">No Node Selected</h3>
          <p className="text-sm text-muted-foreground">
            Click on a node to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handleLabelChange = (value: string) => {
    if (!selectedNode?.data) return;
    onUpdateNode(selectedNode.id, {
      ...(selectedNode.data as Record<string, any>),
      label: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    if (!selectedNode?.data) return;
    onUpdateNode(selectedNode.id, {
      ...(selectedNode.data as Record<string, any>),
      description: value,
    });
  };

  const handleParameterChange = (key: string, value: string) => {
    if (!selectedNode?.data) return;
    const nodeData = selectedNode.data as Record<string, any>;
    onUpdateNode(selectedNode.id, {
      ...nodeData,
      parameters: {
        ...(nodeData.parameters || {}),
        [key]: value,
      },
    });
  };

  return (
    <div className="w-80 bg-card border-l border-border shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <h2 className="font-semibold text-foreground flex-1">Node Properties</h2>
          <Badge variant="secondary" className="text-xs">
            {selectedNode.type}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Play className="w-3 h-3 mr-1" />
            Test
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Copy className="w-3 h-3 mr-1" />
            Clone
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onDeleteNode(selectedNode.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {/* Basic Properties */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Basic Properties</h3>
          
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={String(selectedNode.data?.label || '')}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Node label"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={String(selectedNode.data?.description || '')}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Optional description"
              className="min-h-20"
            />
          </div>
        </div>

        <Separator />

        {/* Parameters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Parameters</h3>
            <Button size="sm" variant="outline">
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>

          {selectedNode.data && (selectedNode.data as any).parameters && Object.keys((selectedNode.data as any).parameters).length > 0 ? (
            <div className="space-y-3">
              {Object.entries((selectedNode.data as any).parameters).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm font-medium">
                    {key}
                  </Label>
                  <Input
                    id={key}
                    value={String(value)}
                    onChange={(e) => handleParameterChange(key, e.target.value)}
                    placeholder={`${key} value`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No parameters defined
            </div>
          )}
        </div>

        <Separator />

        {/* SubNodes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">SubNodes</h3>
            <Button size="sm" variant="outline">
              <Plus className="w-3 h-3 mr-1" />
              Assign
            </Button>
          </div>

          {selectedNode.data && (selectedNode.data as any).subnodes && (selectedNode.data as any).subnodes.length > 0 ? (
            <div className="space-y-3">
              {(selectedNode.data as any).subnodes.map((subnode: any) => (
                <div key={subnode.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{subnode.name}</div>
                      <div className="text-xs text-muted-foreground">
                        v{subnode.version || 1} • {subnode.parameters?.length || 0} params
                      </div>
                    </div>
                    <Badge 
                      variant={subnode.is_selected ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {subnode.is_selected ? "Selected" : "Available"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs flex-1"
                      onClick={() => handleSubnodeDeploy(subnode.id)}
                      disabled={deployingSubnodes.has(subnode.id)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Deploy
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs flex-1"
                      onClick={() => handleSubnodeUndeploy(subnode.id)}
                      disabled={deployingSubnodes.has(subnode.id)}
                    >
                      <Square className="w-3 h-3 mr-1" />
                      Stop
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={() => window.open(`/subnodes/${subnode.id}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No subnodes assigned
            </div>
          )}
        </div>

        <Separator />

        {/* Node Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-foreground">Node Info</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>ID: <code className="text-xs bg-muted px-1 rounded">{selectedNode.id}</code></div>
            <div>Position: {Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)}</div>
            <div>Type: {selectedNode.type}</div>
          </div>
        </div>
      </div>
    </div>
  );
}