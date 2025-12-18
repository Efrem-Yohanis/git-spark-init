import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Database } from "lucide-react";
import { getMockTableData } from "@/lib/savedTables";

export default function TableViewPage() {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();

  const decodedName = decodeURIComponent(tableName || "");
  const { columns, rows } = getMockTableData(decodedName);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{decodedName}</h1>
          <p className="text-muted-foreground">Top 10 rows from table</p>
        </div>
      </div>

      <Card className="border-2 shadow-elegant">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            SELECT * FROM {decodedName} (Top 10)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col} className="whitespace-nowrap">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map((col) => (
                      <TableCell key={col} className="whitespace-nowrap">
                        {row[col]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Showing {rows.length} of {rows.length} rows (read-only view)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
