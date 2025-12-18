const BASE_URL = "http://127.0.0.1:5000";

export interface ApiResponse {
  success: boolean;
  table_name: string;
  execution_time_seconds?: number;
  created_at?: string;
  columns: string[];
  row_count?: number;
  rows_inserted?: number;
  rows_created?: number;
  message?: string;
  error?: string;
  account_number?: string;
}

// Active Customer Table
export interface ActiveCustomerRequest {
  table_name: string;
  data_from: string;
  active_for: number;
}

export async function createActiveCustomerTable(data: ActiveCustomerRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_active_customer_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// VLR Attached Table
export interface VlrAttachedRequest {
  table_name: string;
  day_from: string;
  day_to: string;
}

export async function createVlrAttachedTable(data: VlrAttachedRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_vlr_attached_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Registered MPESA Table
export interface RegisteredMpesaRequest {
  table_name: string;
  date_range?: { start: string; end: string };
  before?: string;
  after?: string;
}

export async function createRegisteredMpesaTable(data: RegisteredMpesaRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_registered_mpesa_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Targeted Table
export interface TargetedTableRequest {
  table_name: string;
  data_from: string;
  targeted_for_last: number;
}

export async function createTargetedTable(data: TargetedTableRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_targeted_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Rewarded Customer Table
export interface RewardedCustomerRequest {
  table_name: string;
  date_range?: { start: string; end: string };
  before?: string;
  after?: string;
}

export async function createRewardedCustomerTable(data: RewardedCustomerRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_rewarded_customer_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Create Table From File
export async function createTableFromFile(
  tableName: string,
  file: File,
  maxRows?: number
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("table_name", tableName);
  formData.append("file", file);
  if (maxRows) {
    formData.append("max_rows", maxRows.toString());
  }

  const response = await fetch(`${BASE_URL}/create_table_from_file`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Create Table From SQL
export interface SqlTableRequest {
  table_name: string;
  sql: string;
}

export async function createTableFromSql(data: SqlTableRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_table_from_sql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Customer GA Table
export interface CustomerGaRequest {
  table_name: string;
  data_from: string;
  data_to: string;
}

export async function createCustomerGaTable(data: CustomerGaRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_customer_ga`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Fraud Table
export interface FraudTableRequest {
  table_name: string;
}

export async function createFraudTable(data: FraudTableRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_fraud_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Staff List Table
export interface StaffListTableRequest {
  table_name: string;
}

export async function createStaffListTable(data: StaffListTableRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_staff_list_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// CBE Top Up Table
export interface CbeTopupTableRequest {
  table_name: string;
  data_from: string;
  data_to: string;
}

export async function createCbeTopupTable(data: CbeTopupTableRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_cbe_topup_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Freared From Table
export interface FrearedFromTableRequest {
  table_name: string;
  account_number: string;
}

export async function createFrearedFromTable(data: FrearedFromTableRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_freared_from_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Dormant Table
export interface DormantTableRequest {
  table_name: string;
}

export async function createDormantTable(data: DormantTableRequest): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/create_dormant_table`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
