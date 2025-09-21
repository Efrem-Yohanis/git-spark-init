import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { nodeService } from "@/services/nodeService";
import { Upload, FileCode, ArrowLeft } from "lucide-react";

export function CreateNodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [mediationType, setMediationType] = useState("");
  const [nodeType, setNodeType] = useState("");
  const [hasSubnodes, setHasSubnodes] = useState(false);
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScriptFile(file);
    }
  };

  const handleSave = async () => {
    if (!nodeName.trim()) {
      toast({
        title: "Error",
        description: "Node name is required",
        variant: "destructive"
      });
      return;
    }

    if (!nodeDescription.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive"
      });
      return;
    }

    if (!mediationType) {
      toast({
        title: "Error",
        description: "Mediation type is required",
        variant: "destructive"
      });
      return;
    }

    if (!nodeType) {
      toast({
        title: "Error",
        description: "Node type is required",
        variant: "destructive"
      });
      return;
    }

    if (!scriptFile) {
      toast({
        title: "Error", 
        description: "Script file is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Create Node Family
      const newNodeFamily = await nodeService.createNodeFamily({
        name: nodeName,
        description: nodeDescription,
        created_by: "Efrem"
      });

      // Step 2: Create Initial Version (v1)
      await nodeService.createNodeVersion(newNodeFamily.id, {
        version: 1,
        changelog: "initial version"
      });

      // Step 3: Upload Script for v1
      await nodeService.uploadVersionScript(newNodeFamily.id, 1, scriptFile);

      toast({
        title: "Success",
        description: "Node created and script uploaded."
      });
      
      navigate("/nodes");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to create node";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Create node error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/nodes");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/devtool")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Node</h1>
            <p className="text-muted-foreground mt-1">
              Create a new processing node with custom script functionality
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nodeName" className="text-sm font-semibold">
                    Node Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nodeName"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    placeholder="Enter a descriptive node name"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nodeDescription" className="text-sm font-semibold">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="nodeDescription"
                    value={nodeDescription}
                    onChange={(e) => setNodeDescription(e.target.value)}
                    placeholder="Describe the node's purpose and functionality"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mediationType" className="text-sm font-semibold">
                      Mediation Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={mediationType} onValueChange={setMediationType}>
                      <SelectTrigger id="mediationType" className="h-11">
                        <SelectValue placeholder="Select mediation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charging">Charging</SelectItem>
                        <SelectItem value="convergent">Convergent Billing</SelectItem>
                        <SelectItem value="ncc">Network Call Control</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nodeType" className="text-sm font-semibold">
                      Node Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={nodeType} onValueChange={setNodeType}>
                      <SelectTrigger id="nodeType" className="h-11">
                        <SelectValue placeholder="Select node type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="collector">Collector</SelectItem>
                        <SelectItem value="decoder">Decoder</SelectItem>
                        <SelectItem value="encoder">Encoder</SelectItem>
                        <SelectItem value="enrichment">Enrichment</SelectItem>
                        <SelectItem value="validation">Validation</SelectItem>
                        <SelectItem value="fdc">FDC</SelectItem>
                        <SelectItem value="interface">Interface</SelectItem>
                        <SelectItem value="backup">Backup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold">Subnode Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable if this node will contain subnodes
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Label htmlFor="hasSubnodes" className="text-sm font-medium">
                      {hasSubnodes ? "Enabled" : "Disabled"}
                    </Label>
                    <Switch
                      id="hasSubnodes"
                      checked={hasSubnodes}
                      onCheckedChange={setHasSubnodes}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Script Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  Script File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scriptFile" className="text-sm font-semibold">
                    Python Script <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="scriptFile"
                      type="file"
                      accept=".py"
                      onChange={handleFileUpload}
                      className="h-11 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {scriptFile && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <FileCode className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{scriptFile.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {(scriptFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a Python (.py) file containing your node's processing logic
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="w-full h-11"
                >
                  {isLoading ? "Creating Node..." : "Create Node"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={isLoading}
                  className="w-full h-11"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Node Name</p>
                  <p>Use a clear, descriptive name that indicates the node's purpose</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Script Requirements</p>
                  <p>Python file must contain valid processing logic for the selected node type</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Mediation Types</p>
                  <p>Choose the appropriate type based on your data processing needs</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}