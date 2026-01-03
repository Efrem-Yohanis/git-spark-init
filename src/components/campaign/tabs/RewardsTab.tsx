import { Gift, Wallet, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const rewardConfig = {
  type: "Cashback",
  value: "10 ETB",
  perCustomerCap: "10 ETB",
  campaignCap: "500,000 ETB",
};

const rewardAccount = {
  id: "RWD-ACC-001",
  name: "Festive Rewards Pool",
  startingBalance: 500000,
  currentBalance: 115000,
  consumed: 385000,
};

const rewardStatusData = [
  { msisdn: "2519****1234", status: "Success", reason: "-", timestamp: "2024-01-15 10:23:45" },
  { msisdn: "2519****5678", status: "Success", reason: "-", timestamp: "2024-01-15 10:24:12" },
  { msisdn: "2519****9012", status: "Success", reason: "-", timestamp: "2024-01-15 10:25:33" },
  { msisdn: "2519****3456", status: "Failed", reason: "Insufficient balance", timestamp: "2024-01-15 10:26:01" },
  { msisdn: "2519****7890", status: "Failed", reason: "System error", timestamp: "2024-01-15 10:26:45" },
  { msisdn: "2519****2345", status: "Success", reason: "-", timestamp: "2024-01-15 10:27:22" },
  { msisdn: "2519****6789", status: "Success", reason: "-", timestamp: "2024-01-15 10:28:01" },
  { msisdn: "2519****0123", status: "Success", reason: "-", timestamp: "2024-01-15 10:28:55" },
];

const balancePercentage = (rewardAccount.currentBalance / rewardAccount.startingBalance) * 100;
const isLowBalance = balancePercentage < 30;

export function RewardsTab() {
  return (
    <div className="space-y-6">
      {/* Low Balance Alert */}
      {isLowBalance && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Low Balance Warning</p>
            <p className="text-sm text-destructive/80">
              Reward account balance is below 30%. Consider topping up to avoid campaign interruption.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reward Configuration */}
        <div className="bg-card border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Reward Configuration</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Reward Type</span>
              <p className="font-medium">{rewardConfig.type}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Reward Value</span>
              <p className="font-medium">{rewardConfig.value}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Per-Customer Cap</span>
              <p className="font-medium">{rewardConfig.perCustomerCap}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Campaign Cap</span>
              <p className="font-medium">{rewardConfig.campaignCap}</p>
            </div>
          </div>
        </div>

        {/* Reward Account */}
        <div className="bg-card border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Reward Account</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">Account</span>
                <p className="font-medium">{rewardAccount.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{rewardAccount.id}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Balance</span>
                <span className={cn("font-medium", isLowBalance && "text-destructive")}>
                  {rewardAccount.currentBalance.toLocaleString()} ETB
                </span>
              </div>
              <div className="h-3 bg-muted overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all",
                    isLowBalance ? "bg-destructive" : "bg-primary"
                  )}
                  style={{ width: `${balancePercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Consumed: {rewardAccount.consumed.toLocaleString()} ETB</span>
                <span>Starting: {rewardAccount.startingBalance.toLocaleString()} ETB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Status Table */}
      <div className="bg-card border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Reward Status Log</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">MSISDN</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Failure Reason</TableHead>
              <TableHead className="font-semibold">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewardStatusData.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono">{record.msisdn}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {record.status === "Success" ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-medium",
                        record.status === "Success" 
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      )}
                    >
                      {record.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className={record.reason !== "-" ? "text-destructive" : "text-muted-foreground"}>
                  {record.reason}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{record.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
