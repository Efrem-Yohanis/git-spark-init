import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gavel, CalendarIcon, Search, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://127.0.0.1:5000";

interface CourtIssueResult {
  ORD_ENDTIME: string;
  ORDERID: string;
  DS_CUSTOMER_MSISDN: string;
  ORD_REASON_TYPE_NAME: string;
  ORD_INITIATOR_MNEMONIC: string;
  TX_CREDIT_PARTY_IDENTIFIER: string;
  TX_DEBIT_PARTY_IDENTIFIER: string;
  ORD_RECEIVER_MNEMONIC: string;
  DS_ORD_TXN_TYPE_NAME: string;
  AMOUNT: number;
  ACCOUNT: string | null;
}

interface PaginationInfo {
  page: number;
  page_size: number;
  total_pages: number;
  total_transactions: number;
  returned_transactions: number;
}

export default function CourtIssue() {
  const [msisdn, setMsisdn] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [results, setResults] = useState<CourtIssueResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleSearch = async (page: number = 1) => {
    if (!msisdn) {
      toast({
        title: "Validation Error",
        description: "Please enter MSISDN",
        variant: "destructive",
      });
      return;
    }
    if (!fromDate || !toDate) {
      toast({
        title: "Validation Error",
        description: "Please select both From and To dates",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/court_issue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msisdn: msisdn,
          data_from: format(fromDate, "yyyy-MM-dd"),
          data_to: format(toDate, "yyyy-MM-dd"),
          page: page,
          page_size: 50,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data || []);
        setPagination(data.pagination || null);
        setCurrentPage(page);
        setExecutionTime(data.execution_time_seconds || null);
        toast({
          title: "Search Complete",
          description: `Found ${data.transaction_count || data.pagination?.total_transactions || 0} transactions for MSISDN: ${msisdn}`,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch court issue data",
          variant: "destructive",
        });
        setResults([]);
        setPagination(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
      setResults([]);
      setPagination(null);
    } finally {
      setIsSearching(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) {
      toast({
        title: "No Data",
        description: "No results to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "ORD_ENDTIME", "ORDERID", "DS_CUSTOMER_MSISDN", "ORD_REASON_TYPE_NAME",
      "ORD_INITIATOR_MNEMONIC", "TX_CREDIT_PARTY_IDENTIFIER", "TX_DEBIT_PARTY_IDENTIFIER",
      "ORD_RECEIVER_MNEMONIC", "DS_ORD_TXN_TYPE_NAME", "AMOUNT", "ACCOUNT"
    ];
    
    const csvContent = [
      headers.join(","),
      ...results.map(row => 
        headers.map(header => `"${row[header as keyof CourtIssueResult] ?? ""}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `court_issue_${msisdn}_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    
    toast({
      title: "Export Complete",
      description: "CSV file downloaded successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 w-full">
      <div className="w-full p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Court Issue
          </h1>
          <p className="text-muted-foreground mt-1">Search court-related issues by MSISDN and date range</p>
        </div>

        <Card className="border-2 shadow-elegant">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Court Issue Search
            </CardTitle>
            <CardDescription>Enter MSISDN and select date range to search</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="msisdn">MSISDN</Label>
              <Input
                id="msisdn"
                placeholder="Enter MSISDN (e.g., 911234567)"
                value={msisdn}
                onChange={(e) => setMsisdn(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={() => handleSearch(1)} disabled={isSearching} className="w-full md:w-auto">
              {isSearching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="border-2 shadow-elegant">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent flex flex-row items-center justify-between">
              <div>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  {pagination 
                    ? `Showing ${pagination.returned_transactions} of ${pagination.total_transactions} transactions`
                    : `${results.length} record(s) found`}
                  {executionTime && ` • Executed in ${executionTime.toFixed(2)}s`}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ORD_ENDTIME</TableHead>
                      <TableHead>ORDERID</TableHead>
                      <TableHead>DS_CUSTOMER_MSISDN</TableHead>
                      <TableHead>ORD_REASON_TYPE_NAME</TableHead>
                      <TableHead>ORD_INITIATOR_MNEMONIC</TableHead>
                      <TableHead>TX_CREDIT_PARTY_IDENTIFIER</TableHead>
                      <TableHead>TX_DEBIT_PARTY_IDENTIFIER</TableHead>
                      <TableHead>ORD_RECEIVER_MNEMONIC</TableHead>
                      <TableHead>DS_ORD_TXN_TYPE_NAME</TableHead>
                      <TableHead>AMOUNT</TableHead>
                      <TableHead>ACCOUNT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{row.ORD_ENDTIME}</TableCell>
                        <TableCell>{row.ORDERID}</TableCell>
                        <TableCell>{row.DS_CUSTOMER_MSISDN}</TableCell>
                        <TableCell>{row.ORD_REASON_TYPE_NAME}</TableCell>
                        <TableCell className="whitespace-nowrap">{row.ORD_INITIATOR_MNEMONIC}</TableCell>
                        <TableCell>{row.TX_CREDIT_PARTY_IDENTIFIER}</TableCell>
                        <TableCell>{row.TX_DEBIT_PARTY_IDENTIFIER}</TableCell>
                        <TableCell className="whitespace-nowrap">{row.ORD_RECEIVER_MNEMONIC}</TableCell>
                        <TableCell>{row.DS_ORD_TXN_TYPE_NAME}</TableCell>
                        <TableCell>{row.AMOUNT?.toLocaleString() ?? ""}</TableCell>
                        <TableCell>{row.ACCOUNT ?? ""}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || isSearching}
                    onClick={() => handleSearch(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {pagination.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === pagination.total_pages || isSearching}
                    onClick={() => handleSearch(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}