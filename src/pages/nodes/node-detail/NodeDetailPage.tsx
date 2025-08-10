import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { nodeService, type Node, type NodeVersion } from "@/services/nodeService";
import { parameterService, type Parameter } from "@/services/parameterService";
import { NodeHeader } from "./components/NodeHeader";
import { NodeSummary } from "./components/NodeSummary";
import { PropertiesSection } from "./components/PropertiesSection";
import { SubnodesSection } from "./components/SubnodesSection";
import { VersionHistoryModal } from "./components/VersionHistoryModal";

export function NodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [node, setNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Version management
  const [nodeVersions, setNodeVersions] = useState<NodeVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<NodeVersion | null>(null);
  const [nodeVersionsLoading, setNodeVersionsLoading] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);

  // Parameters management
  const [nodeParameters, setNodeParameters] = useState<Parameter[]>([]);

  useEffect(() => {
    const fetchNode = async () => {
      if (!id) return;
      
      try {
        const nodeData = await nodeService.getNode(id);
        setNode(nodeData);
        
        // Map parameters from node data to match Parameter interface
        const mappedParameters = (nodeData.parameters || []).map(param => ({
          id: param.id,
          key: param.key,
          default_value: param.default_value,
          datatype: param.datatype,
          node: nodeData.id,
          required: false, // Default value since not in API
          last_updated_by: null,
          last_updated_at: nodeData.updated_at
        }));
        setNodeParameters(mappedParameters);
        
        // Fetch initial data
        await fetchNodeVersions();
      } catch (err: any) {
        console.error("Error fetching node:", err);
        setError(err.response?.data?.error || err.message || "Error fetching node");
        toast({
          title: "Error",
          description: "Failed to load node details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNode();
  }, [id, toast]);

  // Fetch node versions
  const fetchNodeVersions = async () => {
    if (!id) return;
    
    setNodeVersionsLoading(true);
    try {
      const versions = await nodeService.getNodeVersions(id);
      setNodeVersions(versions);
      
      // Set selected version to active version or latest
      const activeVersion = versions.find(v => v.is_active) || versions[0];
      setSelectedVersion(activeVersion);
    } catch (err: any) {
      console.error('Error fetching node versions:', err);
      toast({
        title: "Error",
        description: "Failed to load node versions",
        variant: "destructive"
      });
    } finally {
      setNodeVersionsLoading(false);
    }
  };


  // Event handlers
  const handleEditVersion = () => {
    if (selectedVersion && !selectedVersion.is_active) {
      navigate(`/nodes/${id}/edit?version=${selectedVersion.version}`);
    }
  };

  const handleCreateNewVersion = () => {
    navigate(`/nodes/${id}/edit?newVersion=true`);
  };

  const handleToggleDeployment = async () => {
    if (!selectedVersion || !id) return;
    
    try {
      if (selectedVersion.is_active) {
        // For now, just show a message that deactivation would happen
        toast({
          title: "Toggle Deployment",
          description: `Version ${selectedVersion.version} deployment would be toggled`,
        });
      } else {
        // Deploy/activate version
        await nodeService.activateNodeVersion(id, selectedVersion.version);
        toast({
          title: "Version Deployed",
          description: `Node version ${selectedVersion.version} is now deployed`,
        });
        
        // Refresh versions
        await fetchNodeVersions();
        
        // Refresh node data
        const updatedNode = await nodeService.getNode(id);
        setNode(updatedNode);
      }
      
    } catch (err: any) {
      console.error('Error toggling version deployment:', err);
      toast({
        title: "Error",
        description: "Failed to update version deployment status",
        variant: "destructive"
      });
    }
  };

  const handleShowVersionHistory = () => {
    setVersionHistoryOpen(true);
    if (nodeVersions.length === 0) {
      fetchNodeVersions();
    }
  };

  const handleViewVersion = (version: NodeVersion) => {
    setSelectedVersion(version);
    setVersionHistoryOpen(false);
    toast({
      title: "Version Selected",
      description: `Now viewing version ${version.version}`,
    });
  };

  const activateNodeVersion = async (version: number) => {
    if (!id) return;
    
    try {
      await nodeService.activateNodeVersion(id, version);
      
      // Update versions state
      setNodeVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          is_active: v.version === version
        }))
      );
      
      // Update selected version
      const activatedVersion = nodeVersions.find(v => v.version === version);
      if (activatedVersion) {
        setSelectedVersion({ ...activatedVersion, is_active: true });
      }
      
      // Refresh node data
      const updatedNode = await nodeService.getNode(id);
      setNode(updatedNode);
      
      toast({
        title: "Version Activated",
        description: `Node version ${version} is now active`,
      });
      
      setVersionHistoryOpen(false);
    } catch (err: any) {
      console.error('Error activating node version:', err);
      toast({
        title: "Error",
        description: "Failed to activate version",
        variant: "destructive"
      });
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => navigate('/nodes')} className="mt-4">
          Back to Nodes
        </Button>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Node not found</p>
        <Button onClick={() => navigate('/nodes')} className="mt-4">
          Back to Nodes
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <NodeHeader
        node={node}
        selectedVersion={selectedVersion}
        onEditVersion={handleEditVersion}
        onToggleDeployment={handleToggleDeployment}
        onCreateNewVersion={handleCreateNewVersion}
        onShowVersionHistory={handleShowVersionHistory}
        isLoading={loading}
      />

      <Separator />

      {/* Node Detail Section */}
      <NodeSummary
        node={node}
        selectedVersion={selectedVersion}
        propertiesCount={nodeParameters.length}
        subnodesCount={node.subnodes?.length || 0}
      />

      <Separator />

      {/* Properties Section */}
      <PropertiesSection
        properties={nodeParameters}
        loading={false}
      />

      <Separator />

      {/* Subnodes Section */}
      <SubnodesSection
        subnodes={node.subnodes || []}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        open={versionHistoryOpen}
        onOpenChange={setVersionHistoryOpen}
        versions={nodeVersions}
        loading={nodeVersionsLoading}
        onActivateVersion={activateNodeVersion}
        onViewVersion={handleViewVersion}
      />

      {/* Back to Nodes Button */}
      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={() => navigate('/nodes')}>
          Back to Nodes
        </Button>
      </div>
    </div>
  );
}