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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreateFlowDialog } from "./create-flow-dialog";
import { useNavigate } from "react-router-dom";

// Mock data for flows
const mockFlows = [
  {
    id: "1",
    name: "Daily 3 Birr Loan",
    code: "LOAN_D_S_3",
    description: "DAILY_CBU_SMS_3BIRR_LOAN_OF",
    status: "running",
    deployment: "deployed",
    createdDate: "2024-01-15",
    lastUpdatedBy: "John Doe",
  },
  {
    id: "2", 
    name: "Daily 5 Birr Loan",
    code: "LOAN_D_S_5",
    description: "DAILY_CBU_SMS_5BIRR_LOAN_OF",
    status: "stopped",
    deployment: "deployed",
    createdDate: "2024-01-10",
    lastUpdatedBy: "Jane Smith",
  },
  {
    id: "3",
    name: "Weekly 10 Birr Loan",
    code: "LOAN_W_S_10",
    description: "WEEKLY_CBU_SMS_10BIRR_LOAN_OF",
    status: "stopped",
    deployment: "not_deployed",
    createdDate: "2024-01-05",
    lastUpdatedBy: "Bob Johnson",
  },
];

export function FlowsPage() {
  const [flows, setFlows] = useState(mockFlows);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const navigate = useNavigate();

  const filteredFlows = flows.filter(flow =>
    flow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      running: { variant: "default", className: "bg-node-running text-white" },
      stopped: { variant: "secondary", className: "bg-node-stopped text-white" },
    };
    return variants[status] || { variant: "outline", className: "" };
  };

  const getDeploymentBadge = (deployment: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      deployed: { variant: "default", className: "bg-node-deployed text-white" },
      not_deployed: { variant: "outline", className: "text-node-undeployed border-node-undeployed" },
    };
    return variants[deployment] || { variant: "outline", className: "" };
  };

  const handleDelete = (flowId: string) => {
    setFlows(flows.filter(flow => flow.id !== flowId));
  };

  const handleExport = (flow: any) => {
    const dataStr = JSON.stringify(flow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flow.name}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search flows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Flow
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Flow
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deployment</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Last Updated By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFlows.map((flow) => (
              <TableRow key={flow.id}>
                <TableCell className="font-medium">{flow.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusBadge(flow.status).variant}
                    className={getStatusBadge(flow.status).className}
                  >
                    {flow.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getDeploymentBadge(flow.deployment).variant}
                    className={getDeploymentBadge(flow.deployment).className}
                  >
                    {flow.deployment === "deployed" ? "Deployed" : "Not Deployed"}
                  </Badge>
                </TableCell>
                <TableCell>{flow.createdDate}</TableCell>
                <TableCell>{flow.lastUpdatedBy}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/flows/${flow.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport(flow)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Flow</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{flow.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(flow.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateFlowDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}