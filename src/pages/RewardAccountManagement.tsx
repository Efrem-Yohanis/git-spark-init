import { useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RewardAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  assignedCampaigns: string[];
  status: "Active" | "Inactive";
  lastUpdated: string;
  description?: string;
}

// Simulated external source accounts (would come from API in real implementation)
const externalSourceAccounts: Record<string, { name: string; balance: number }> = {
  "ACC-001": { name: "Main Reward Pool", balance: 5000000 },
  "ACC-002": { name: "Win-back Fund", balance: 1200000 },
  "ACC-003": { name: "Loyalty Rewards", balance: 850000 },
  "ACC-004": { name: "Agent Commission Pool", balance: 320000 },
  "ACC-005": { name: "Emergency Reserve", balance: 50000 },
  "ACC-006": { name: "Promotional Fund", balance: 2500000 },
  "ACC-007": { name: "Partner Rewards", balance: 1800000 },
};

const initialAccounts: RewardAccount[] = [
  {
    id: "RA001",
    name: "Main Reward Pool",
    accountNumber: "ACC-001",
    balance: 5000000,
    assignedCampaigns: ["Holiday Campaign", "New User Bonus"],
    status: "Active",
    lastUpdated: "2024-01-15 10:30",
    description: "Primary reward distribution account",
  },
  {
    id: "RA002",
    name: "Win-back Fund",
    accountNumber: "ACC-002",
    balance: 1200000,
    assignedCampaigns: ["Dormant Reactivation"],
    status: "Active",
    lastUpdated: "2024-01-14 16:45",
    description: "Funds for dormant user reactivation campaigns",
  },
  {
    id: "RA003",
    name: "Loyalty Rewards",
    accountNumber: "ACC-003",
    balance: 850000,
    assignedCampaigns: ["VIP Tier Bonus", "Monthly Loyalty"],
    status: "Active",
    lastUpdated: "2024-01-15 09:00",
    description: "Loyalty program reward pool",
  },
  {
    id: "RA004",
    name: "Agent Commission Pool",
    accountNumber: "ACC-004",
    balance: 320000,
    assignedCampaigns: [],
    status: "Inactive",
    lastUpdated: "2024-01-10 14:20",
    description: "Reserved for agent commission payments",
  },
  {
    id: "RA005",
    name: "Emergency Reserve",
    accountNumber: "ACC-005",
    balance: 50000,
    assignedCampaigns: [],
    status: "Active",
    lastUpdated: "2024-01-12 11:15",
    description: "Emergency backup funds",
  },
];

const LOW_BALANCE_THRESHOLD = 100000;

export default function RewardAccountManagement() {
  const [accounts, setAccounts] = useState<RewardAccount[]>(initialAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [minBalanceFilter, setMinBalanceFilter] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<RewardAccount | null>(null);

  // Form states
  const [formAccountNumber, setFormAccountNumber] = useState("");
  const [formFetchedBalance, setFormFetchedBalance] = useState<number | null>(null);
  const [formFetchedName, setFormFetchedName] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formDescription, setFormDescription] = useState("");
  const [fetchError, setFetchError] = useState("");

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || account.status.toLowerCase() === statusFilter;
    const matchesAssigned = assignedFilter === "all" ||
      (assignedFilter === "assigned" && account.assignedCampaigns.length > 0) ||
      (assignedFilter === "unassigned" && account.assignedCampaigns.length === 0);
    const matchesMinBalance = !minBalanceFilter || account.balance >= parseFloat(minBalanceFilter);
    return matchesSearch && matchesStatus && matchesAssigned && matchesMinBalance;
  });

  const resetForm = () => {
    setFormAccountNumber("");
    setFormFetchedBalance(null);
    setFormFetchedName("");
    setFormStatus("Active");
    setFormDescription("");
    setFetchError("");
  };

  const handleFetchAccount = () => {
    const sourceAccount = externalSourceAccounts[formAccountNumber];
    if (sourceAccount) {
      setFormFetchedBalance(sourceAccount.balance);
      setFormFetchedName(sourceAccount.name);
      setFetchError("");
    } else {
      setFormFetchedBalance(null);
      setFormFetchedName("");
      setFetchError("Account not found in source system");
    }
  };

  const handleCreate = () => {
    if (formFetchedBalance === null) return;
    const newAccount: RewardAccount = {
      id: `RA${String(accounts.length + 1).padStart(3, "0")}`,
      name: formFetchedName,
      accountNumber: formAccountNumber,
      balance: formFetchedBalance,
      assignedCampaigns: [],
      status: formStatus,
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
      description: formDescription,
    };
    setAccounts([...accounts, newAccount]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedAccount) return;
    // Refresh balance from source system
    const sourceAccount = externalSourceAccounts[selectedAccount.accountNumber];
    const updatedBalance = sourceAccount ? sourceAccount.balance : selectedAccount.balance;
    
    const updated = accounts.map((acc) =>
      acc.id === selectedAccount.id
        ? {
            ...acc,
            balance: updatedBalance,
            status: formStatus,
            description: formDescription,
            lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
          }
        : acc
    );
    setAccounts(updated);
    setShowEditModal(false);
    setSelectedAccount(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedAccount) return;
    setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id));
    setShowDeleteModal(false);
    setSelectedAccount(null);
  };

  const openViewModal = (account: RewardAccount) => {
    setSelectedAccount(account);
    setShowViewModal(true);
  };

  const openEditModal = (account: RewardAccount) => {
    setSelectedAccount(account);
    setFormAccountNumber(account.accountNumber);
    setFormFetchedBalance(account.balance);
    setFormFetchedName(account.name);
    setFormStatus(account.status);
    setFormDescription(account.description || "");
    setShowEditModal(true);
  };

  const openDeleteModal = (account: RewardAccount) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "Name", "Balance (ETB)", "Status", "Assigned Campaigns", "Last Updated"],
      ...filteredAccounts.map((acc) => [
        acc.id,
        acc.name,
        acc.balance,
        acc.status,
        acc.assignedCampaigns.join("; "),
        acc.lastUpdated,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reward_accounts.csv";
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold">Reward Account Management</h1>
            <p className="text-muted-foreground">Link and manage reward accounts from source system</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Accounts with balance below {LOW_BALANCE_THRESHOLD.toLocaleString()} ETB are flagged</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Link Reward Account
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by account name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assignedFilter} onValueChange={setAssignedFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Assignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Min Balance"
          value={minBalanceFilter}
          onChange={(e) => setMinBalanceFilter(e.target.value)}
          className="w-36"
        />
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Account Name / ID</TableHead>
              <TableHead className="font-semibold text-right">Current Balance (ETB)</TableHead>
              <TableHead className="font-semibold">Assigned Campaigns</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">{account.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {account.balance < LOW_BALANCE_THRESHOLD && (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        account.balance < LOW_BALANCE_THRESHOLD && "text-destructive"
                      )}
                    >
                      {account.balance.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {account.assignedCampaigns.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {account.assignedCampaigns.slice(0, 2).map((campaign, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {campaign}
                        </Badge>
                      ))}
                      {account.assignedCampaigns.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{account.assignedCampaigns.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      account.status === "Active"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {account.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{account.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openViewModal(account)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(account)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteModal(account)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Reward Account</DialogTitle>
            <DialogDescription>
              Enter the source system account number to link a reward account. Balance will be fetched from the source system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Source Account Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="accountNumber"
                  placeholder="e.g., ACC-001"
                  value={formAccountNumber}
                  onChange={(e) => {
                    setFormAccountNumber(e.target.value);
                    setFormFetchedBalance(null);
                    setFormFetchedName("");
                    setFetchError("");
                  }}
                />
                <Button type="button" variant="secondary" onClick={handleFetchAccount} disabled={!formAccountNumber}>
                  Fetch
                </Button>
              </div>
              {fetchError && (
                <p className="text-sm text-destructive">{fetchError}</p>
              )}
            </div>
            {formFetchedBalance !== null && (
              <div className="p-3 bg-muted rounded-md space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Account Name (from source)</p>
                  <p className="font-medium">{formFetchedName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance (from source)</p>
                  <p className="font-medium text-success">{formFetchedBalance.toLocaleString()} ETB</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as "Active" | "Inactive")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Account description..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={formFetchedBalance === null}>
              Link Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account ID</p>
                  <p className="font-medium">{selectedAccount.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Name</p>
                  <p className="font-medium">{selectedAccount.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="font-medium">{selectedAccount.balance.toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      selectedAccount.status === "Active"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {selectedAccount.status}
                  </Badge>
                </div>
              </div>
              {selectedAccount.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedAccount.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Assigned Campaigns</p>
                {selectedAccount.assignedCampaigns.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedAccount.assignedCampaigns.map((campaign, idx) => (
                      <Badge key={idx} variant="outline">
                        {campaign}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No campaigns assigned</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm">{selectedAccount.lastUpdated}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reward Account</DialogTitle>
            <DialogDescription>
              Update account settings. Balance is synced from the source system.
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted rounded-md space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Source Account Number</p>
                    <p className="font-medium">{selectedAccount.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Name</p>
                    <p className="font-medium">{selectedAccount.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance (from source)</p>
                  <p className="font-medium text-success">{formFetchedBalance?.toLocaleString() || selectedAccount.balance.toLocaleString()} ETB</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as "Active" | "Inactive")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Reward Account Integration</DialogTitle>
            <DialogDescription>
              This will only remove the account from this system. The source account will remain unchanged.
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="py-4 space-y-3">
              <div className="p-3 bg-muted rounded-md space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Account:</span>{" "}
                  <strong>{selectedAccount.name}</strong> ({selectedAccount.id})
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Source Account Number:</span>{" "}
                  <strong>{selectedAccount.accountNumber}</strong>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Balance:</span>{" "}
                  <strong>{selectedAccount.balance.toLocaleString()} ETB</strong>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: This action only removes the integration. The account in the source system will not be affected.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remove Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
