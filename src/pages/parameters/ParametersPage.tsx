import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Settings, Trash2, Eye, Edit } from "lucide-react";
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

// Mock data for parameters
const mockParameters = [
  {
    id: "1",
    key: "threshold",
    defaultValue: "10",
    parentNode: "User Data Processor",
    nodeId: "1",
    valueType: "int",
    updatedBy: "John Doe",
    updatedAt: "2024-01-15",
    nodeStatus: "deployed"
  },
  {
    id: "2",
    key: "timeout",
    defaultValue: "30",
    parentNode: "Data Transformer",
    nodeId: "2",
    valueType: "int",
    updatedBy: "Jane Smith",
    updatedAt: "2024-01-16",
    nodeStatus: "deployed"
  },
  {
    id: "3",
    key: "batch_size",
    defaultValue: "100",
    parentNode: "Batch Processor",
    nodeId: "3",
    valueType: "int",
    updatedBy: "Mike Johnson",
    updatedAt: "2024-01-17",
    nodeStatus: "not_deployed"
  },
  {
    id: "4",
    key: "retry_count",
    defaultValue: "3",
    parentNode: "API Connector",
    nodeId: "4",
    valueType: "int",
    updatedBy: "Sarah Wilson",
    updatedAt: "2024-01-18",
    nodeStatus: "deployed"
  },
  {
    id: "5",
    key: "enabled",
    defaultValue: "true",
    parentNode: "Feature Toggle",
    nodeId: "5",
    valueType: "boolean",
    updatedBy: "Tom Brown",
    updatedAt: "2024-01-19",
    nodeStatus: "deployed"
  },
];

export function ParametersPage() {
  const navigate = useNavigate();
  const [parameters] = useState(mockParameters);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParameters = parameters.filter(param =>
    param.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.parentNode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "deployed" 
      ? <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">🟢 Deployed</Badge>
      : <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">🔴 Not Deployed</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => navigate("/parameters/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Parameter
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Default Value</TableHead>
              <TableHead>Parent Node</TableHead>
              <TableHead>Node Status</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParameters.map((param) => (
              <TableRow key={param.id}>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 font-medium"
                    onClick={() => navigate(`/parameters/${param.id}`)}
                  >
                    {param.key}
                  </Button>
                </TableCell>
                <TableCell>{param.defaultValue}</TableCell>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="h-auto p-0"
                    onClick={() => navigate(`/nodes/${param.nodeId}`)}
                  >
                    {param.parentNode}
                  </Button>
                </TableCell>
                <TableCell>
                  {getStatusBadge(param.nodeStatus)}
                </TableCell>
                <TableCell>{param.updatedBy}</TableCell>
                <TableCell>{param.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/parameters/${param.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
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