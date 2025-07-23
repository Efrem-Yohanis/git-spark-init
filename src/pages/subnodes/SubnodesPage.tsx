import { useState } from "react";
import { Plus, Upload, Download, Settings, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock data for subnodes
const mockSubnodes = [
  {
    id: "1",
    name: "PostgreSQL Connector",
    parentNode: "Database Source",
    scriptName: "postgres_connect.py",
    deployment: "deployed",
    createdDate: "2024-01-15",
    createdBy: "John Doe",
  },
  {
    id: "2", 
    name: "CSV Parser",
    parentNode: "Data Transform",
    scriptName: "csv_parser.py",
    deployment: "not_deployed",
    createdDate: "2024-01-10",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    name: "S3 Uploader",
    parentNode: "File Output",
    scriptName: "s3_upload.py",
    deployment: "deployed",
    createdDate: "2024-01-05",
    createdBy: "Bob Johnson",
  },
];

export function SubnodesPage() {
  const [subnodes, setSubnodes] = useState(mockSubnodes);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredSubnodes = subnodes.filter(subnode =>
    subnode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subnode.parentNode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDeploymentBadge = (deployment: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      deployed: { variant: "default", className: "bg-node-deployed text-white" },
      not_deployed: { variant: "outline", className: "text-node-undeployed border-node-undeployed" },
    };
    return variants[deployment] || { variant: "outline", className: "" };
  };

  const handleDelete = (subnodeId: string) => {
    setSubnodes(subnodes.filter(subnode => subnode.id !== subnodeId));
  };

  const handleExport = (subnode: any) => {
    const dataStr = JSON.stringify(subnode, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${subnode.name}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search subnodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import SubNode
          </Button>
          <Button onClick={() => navigate("/subnodes/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New SubNode
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SubNode Name</TableHead>
              <TableHead>Parent Node</TableHead>
              <TableHead>Script Name</TableHead>
              <TableHead>Deployment Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubnodes.map((subnode) => (
              <TableRow key={subnode.id}>
                <TableCell className="font-medium">{subnode.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{subnode.parentNode}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{subnode.scriptName}</TableCell>
                <TableCell>
                  <Badge 
                    variant={getDeploymentBadge(subnode.deployment).variant}
                    className={getDeploymentBadge(subnode.deployment).className}
                  >
                    {subnode.deployment === "deployed" ? "Deployed" : "Not Deployed"}
                  </Badge>
                </TableCell>
                <TableCell>{subnode.createdDate}</TableCell>
                <TableCell>{subnode.createdBy}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/subnodes/${subnode.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport(subnode)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(subnode.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}