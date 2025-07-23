import { useState } from "react";
import { Download, Settings, Trash2, ArrowRight } from "lucide-react";
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

// Mock data for edges
const mockEdges = [
  {
    id: "1",
    sourceNode: "Database Source",
    targetNode: "Data Transform",
    edgeType: "data_flow",
    flowName: "Data Processing Pipeline",
  },
  {
    id: "2", 
    sourceNode: "Data Transform",
    targetNode: "File Output",
    edgeType: "data_flow",
    flowName: "Data Processing Pipeline",
  },
  {
    id: "3",
    sourceNode: "Database Source",
    targetNode: "Analytics Engine",
    edgeType: "control",
    flowName: "ETL Workflow",
  },
];

export function EdgesPage() {
  const [edges] = useState(mockEdges);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEdges = edges.filter(edge =>
    edge.sourceNode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edge.targetNode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edge.flowName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEdgeTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      data_flow: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      control: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      trigger: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search edges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source Node</TableHead>
              <TableHead>Connection</TableHead>
              <TableHead>Target Node</TableHead>
              <TableHead>Edge Type</TableHead>
              <TableHead>Flow Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEdges.map((edge) => (
              <TableRow key={edge.id}>
                <TableCell className="font-medium">{edge.sourceNode}</TableCell>
                <TableCell className="text-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell className="font-medium">{edge.targetNode}</TableCell>
                <TableCell>
                  <Badge className={getEdgeTypeBadge(edge.edgeType)}>
                    {edge.edgeType.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{edge.flowName}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
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