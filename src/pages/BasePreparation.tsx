import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Target, Gift, CreditCard, X, Wallet, Building, Upload, Moon } from "lucide-react";
import { BaseTableBuilder } from "@/components/base-preparation/BaseTableBuilder";
import { useToast } from "@/hooks/use-toast";
import {
  createActiveCustomerTable,
  createVlrAttachedTable,
  createRegisteredMpesaTable,
  createTargetedTable,
  createRewardedCustomerTable,
  createTableFromFile,
  createCustomerGaTable,
  createFraudTable,
  createStaffListTable,
  createCbeTopupTable,
  createFrearedFromTable,
  createDormantTable,
  ApiResponse,
} from "@/lib/basePreparationApi";

interface TableFieldConfig {
  name: string;
  type: "text" | "file";
  label: string;
  required: boolean;
  placeholder?: string;
}

interface TableConfig {
  id: string;
  instanceId: string;
  label: string;
  icon: any;
  borderColor: string;
  fields: TableFieldConfig[];
  values: Record<string, any>;
}

interface TableStatus {
  name: string;
  status: "pending" | "running" | "completed" | "error";
  time: number;
  parameters: string;
  columns?: string[];
  rowCount?: number;
}

const availableTables: { id: string; label: string; icon: any; borderColor: string; fields: TableFieldConfig[] }[] = [
  { 
    id: "from_input", 
    label: "FROM INPUT", 
    icon: Upload, 
    borderColor: "border-l-emerald-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., custom_input_table" },
      { name: "file_input", type: "file", label: "File Input", required: true },
    ]
  },
  { 
    id: "ga_customers", 
    label: "GA CUSTOMERS", 
    icon: Users, 
    borderColor: "border-l-emerald-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., ga_customers_table" },
    ]
  },
  { 
    id: "staff_list", 
    label: "STAFF LIST", 
    icon: Users, 
    borderColor: "border-l-teal-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., staff_list" },
    ]
  },
  { 
    id: "fraud_customer", 
    label: "FRAUD CUSTOMER", 
    icon: Users, 
    borderColor: "border-l-orange-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., fraud_list" },
    ]
  },
  { 
    id: "active_customers", 
    label: "ACTIVE CUSTOMERS", 
    icon: Users, 
    borderColor: "border-l-green-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., active_customers" },
    ]
  },
  { 
    id: "vlr_attached_customers", 
    label: "VLR ATTACHED CUSTOMERS", 
    icon: Clock, 
    borderColor: "border-l-blue-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., vlr_customers" },
    ]
  },
  { 
    id: "registered_mpesa", 
    label: "REGISTERED MPESA", 
    icon: Building, 
    borderColor: "border-l-purple-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., registered_mpesa" },
    ]
  },
  { 
    id: "targeted_customers", 
    label: "TARGETED CUSTOMERS", 
    icon: Target, 
    borderColor: "border-l-red-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., targeted_customers" },
    ]
  },
  { 
    id: "rewarded_customers", 
    label: "REWARDED CUSTOMERS", 
    icon: Gift, 
    borderColor: "border-l-pink-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., rewarded_customers" },
    ]
  },
  { 
    id: "cbe_topup", 
    label: "CBE TOP UP", 
    icon: CreditCard, 
    borderColor: "border-l-indigo-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., cbe_topup_customers" },
    ]
  },
  { 
    id: "rewarded_from_account", 
    label: "REWARDED FROM ACCOUNT", 
    icon: Wallet, 
    borderColor: "border-l-cyan-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., rewarded_from_account" },
    ]
  },
  { 
    id: "dormant_list", 
    label: "DORMANT LIST", 
    icon: Moon, 
    borderColor: "border-l-gray-500",
    fields: [
      { name: "table_name", type: "text", label: "Table Name", required: true, placeholder: "e.g., dormant_list" },
    ]
  },
];

export default function BasePreparation() {
  const { toast } = useToast();
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedTables, setSelectedTables] = useState<TableConfig[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const fileInputRefs = useRef<Record<string, File | null>>({});

  const handleAddTable = () => {
    if (!selectedTableId) return;
    
    const table = availableTables.find(t => t.id === selectedTableId);
    if (!table) return;

    const initialValues: Record<string, any> = {};
    table.fields.forEach(field => {
      initialValues[field.name] = "";
    });

    const newTable: TableConfig = {
      ...table,
      instanceId: crypto.randomUUID(),
      values: initialValues
    };
    
    setSelectedTables([...selectedTables, newTable]);
    setSelectedTableId("");
  };

  const handleRemoveTable = (instanceId: string) => {
    setSelectedTables(selectedTables.filter(t => t.instanceId !== instanceId));
  };

  const updateTableField = (instanceId: string, fieldName: string, value: any) => {
    setSelectedTables(selectedTables.map(table => 
      table.instanceId === instanceId 
        ? { ...table, values: { ...table.values, [fieldName]: value } }
        : table
    ));
  };

  const getAllTables = () => {
    return selectedTables.map((table, idx) => ({
      name: table.values.table_name || table.label.replace(/ /g, "_"),
      status: "pending" as const,
      time: 0,
      parameters: table.values.table_name || "N/A",
      tableIndex: idx,
    }));
  };

  const callApiForTable = async (table: TableConfig): Promise<ApiResponse> => {
    const tableName = table.values.table_name || table.label.replace(/ /g, "_");
    
    switch (table.id) {
      case "active_customers":
        return createActiveCustomerTable({
          table_name: tableName,
          data_from: new Date().toISOString().split('T')[0],
          active_for: 30,
        });

      case "ga_customers":
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return createCustomerGaTable({
          table_name: tableName,
          data_from: yesterday.toISOString().split('T')[0],
          data_to: today.toISOString().split('T')[0],
        });

      case "vlr_attached_customers": {
        const todayDate = new Date();
        const fromDate = new Date(todayDate);
        fromDate.setDate(todayDate.getDate() - 30);
        return createVlrAttachedTable({
          table_name: tableName,
          day_from: fromDate.toISOString().split('T')[0],
          day_to: todayDate.toISOString().split('T')[0],
        });
      }

      case "registered_mpesa":
        return createRegisteredMpesaTable({ table_name: tableName });

      case "targeted_customers":
        return createTargetedTable({
          table_name: tableName,
          data_from: new Date().toISOString().split('T')[0],
          targeted_for_last: 7,
        });

      case "rewarded_customers":
        return createRewardedCustomerTable({ table_name: tableName });

      case "from_input": {
        const file = fileInputRefs.current[table.instanceId];
        if (!file) {
          throw new Error("No file selected");
        }
        return createTableFromFile(tableName, file);
      }

      case "fraud_customer":
        return createFraudTable({ table_name: tableName });

      case "staff_list":
        return createStaffListTable({ table_name: tableName });

      case "cbe_topup": {
        const todayCbe = new Date();
        const monthAgo = new Date(todayCbe);
        monthAgo.setDate(todayCbe.getDate() - 30);
        return createCbeTopupTable({
          table_name: tableName,
          data_from: monthAgo.toISOString().split('T')[0],
          data_to: todayCbe.toISOString().split('T')[0],
        });
      }

      case "rewarded_from_account":
        return createFrearedFromTable({
          table_name: tableName,
          account_number: "9000069",
        });

      case "dormant_list":
        return createDormantTable({ table_name: tableName });

      default:
        return {
          success: true,
          table_name: tableName,
          columns: ["MSISDN"],
          row_count: Math.floor(Math.random() * 100000) + 1000,
          execution_time_seconds: Math.random() * 10 + 1,
        };
    }
  };

  const handleGenerate = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: "No Tables Selected",
        description: "Please select at least one table to generate.",
        variant: "destructive"
      });
      return;
    }

    const tables = getAllTables();
    setTableStatuses(tables.map(t => ({ ...t, tableIndex: undefined })));
    setIsGenerating(true);
    setStartTime(Date.now());
    
    toast({
      title: "Starting Generation",
      description: `Generating ${tables.length} base tables...`,
    });

    for (let i = 0; i < selectedTables.length; i++) {
      const table = selectedTables[i];
      const startTableTime = Date.now();

      setTableStatuses(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: "running" };
        return updated;
      });

      const interval = setInterval(() => {
        setTableStatuses(prev => {
          const updated = [...prev];
          if (updated[i]?.status === "running") {
            updated[i] = { ...updated[i], time: Math.floor((Date.now() - startTableTime) / 1000) };
          }
          return updated;
        });
      }, 1000);

      try {
        const response = await callApiForTable(table);
        clearInterval(interval);
        
        const elapsedTime = response.execution_time_seconds || (Date.now() - startTableTime) / 1000;
        
        setTableStatuses(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: response.success ? "completed" : "error",
            time: Math.round(elapsedTime * 100) / 100,
            columns: response.columns,
            rowCount: response.row_count || response.rows_inserted || response.rows_created,
          };
          return updated;
        });
      } catch (error) {
        clearInterval(interval);
        console.error(`Error creating table ${table.values.table_name}:`, error);
        
        setTableStatuses(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: "error",
            time: Math.floor((Date.now() - startTableTime) / 1000),
          };
          return updated;
        });
      }
    }

    setIsGenerating(false);
    toast({
      title: "Generation Complete",
      description: "All table creation tasks have finished.",
    });
  };

  const getStatusBadge = (status: TableStatus["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">🟢 Completed</Badge>;
      case "running":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">🟡 Running</Badge>;
      case "pending":
        return <Badge variant="secondary">⚪ Pending</Badge>;
      case "error":
        return <Badge variant="destructive">🔴 Error</Badge>;
    }
  };

  const renderField = (table: TableConfig, field: TableFieldConfig) => {
    const value = table.values[field.name];

    switch (field.type) {
      case "text":
        return (
          <Input 
            type="text" 
            value={value} 
            onChange={(e) => updateTableField(table.instanceId, field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isGenerating}
          />
        );
      case "file":
        return (
          <Input 
            type="file" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                fileInputRefs.current[table.instanceId] = file;
              }
              updateTableField(table.instanceId, field.name, file?.name || "");
            }}
            disabled={isGenerating}
            className="cursor-pointer"
            accept=".csv,.xlsx,.xls"
          />
        );
      default:
        return null;
    }
  };

  const completedTables = tableStatuses.filter(t => t.status === "completed").length;

  return (
    <div className="w-full space-y-6">
      <div className="w-full">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Base Preparation Dashboard
        </h1>

        <div className="space-y-6">
          <Card className="border-2 shadow-elegant">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                ⚙️ BASE TABLE CONFIGURATION
              </CardTitle>
              <CardDescription>Select tables and configure parameters</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div>
                <Label className="text-base font-semibold">Add Tables</Label>
                <div className="flex gap-2 mt-2">
                  <Select value={selectedTableId} onValueChange={setSelectedTableId}>
                    <SelectTrigger className="flex-1 bg-background">
                      <SelectValue placeholder="Select a table to add..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {availableTables.map(table => (
                        <SelectItem key={table.id} value={table.id}>
                          {table.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddTable} disabled={!selectedTableId}>
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedTables.length === 0 
                    ? "No tables selected"
                    : `${selectedTables.length} table(s) selected`}
                </p>
              </div>
            </CardContent>
          </Card>

          {selectedTables.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedTables.map(table => {
                const Icon = table.icon;
                return (
                  <Card key={table.instanceId} className={`border-l-4 ${table.borderColor}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {table.label}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveTable(table.instanceId)}
                          disabled={isGenerating}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {table.fields.map(field => (
                        <div key={field.name}>
                          <Label>{field.label}{field.required && " *"}</Label>
                          {renderField(table, field)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {selectedTables.length > 0 && (
            <div className="flex justify-end">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                size="lg"
              >
                {isGenerating ? "Generating..." : "Generate Tables"}
              </Button>
            </div>
          )}

          {selectedTables.length > 0 && (
            <BaseTableBuilder 
              availableTables={selectedTables.map(t => t.values.table_name || t.label.replace(/ /g, "_"))}
              postfix=""
            />
          )}

          {isGenerating && (
            <Card className="border-2 shadow-elegant animate-fade-in">
              <CardHeader className="border-b bg-gradient-to-r from-blue-500/5 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    📊 PROGRESS TRACKING
                  </CardTitle>
                  <Badge variant="outline" className="text-base">
                    {completedTables}/{tableStatuses.length} Tables
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Overall Status</p>
                      <p className="text-lg font-semibold mt-1">
                        {completedTables === tableStatuses.length ? "🟢 Complete" : "🟡 Running"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Elapsed Time</p>
                      <p className="text-lg font-semibold mt-1">{Math.floor((Date.now() - startTime) / 1000)}s</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Total Execution</p>
                      <p className="text-lg font-semibold mt-1">
                        {completedTables === tableStatuses.length 
                          ? `${Math.floor((Date.now() - startTime) / 1000)}s` 
                          : "-"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  {tableStatuses.map((table, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{table.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{table.parameters}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(table.status)}
                            <p className="text-sm font-mono min-w-[60px] text-right">
                              {table.status === "completed" && `${table.time}s`}
                              {table.status === "running" && `${table.time}s...`}
                              {table.status === "pending" && "-"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
