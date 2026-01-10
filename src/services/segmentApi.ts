// Segment API Service
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Types
export interface Segment {
  id: string;
  name: string;
  description: string;
  customer_count: number;
  formatted_customer_count: string;
  last_refresh: string;
  created_at: string;
  updated_at: string;
  segment_type: string;
  criteria: Record<string, any>;
}

export interface SegmentListResponse {
  status: string;
  segments: Segment[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
  summary: {
    total_segments: number;
    total_customers_in_segments: number;
    last_updated: string;
  };
}

export interface CustomerPreview {
  msisdn: string;
  reg_date: string;
  last_activity: string;
  txn_count_30d: number;
  txn_value_30d: string;
  value_tier: string;
  churn_risk: string;
}

export interface SegmentDetailResponse {
  status: string;
  segment: {
    id: string;
    name: string;
    description: string;
    segment_type: string;
    customer_count: number;
    formatted_customer_count: string;
    last_refresh: string;
    created_at: string;
    updated_at: string;
    criteria: Record<string, any>;
    type: string;
    last_refreshed: string;
    new_users_30d: {
      count: number;
      percentage: number;
    };
    value_distribution: {
      high: number;
      medium: number;
      low: number;
    };
    churn_risk: {
      count: number;
      avg_probability: number;
    };
    customer_preview: CustomerPreview[];
  };
}

export interface SegmentFilters {
  behavioral: {
    lastActivityDays: number | null;
    transactionCount: {
      min: number | null;
      max: number | null;
    };
    transactionValue: {
      min: number | null;
      max: number | null;
    };
    rewardReceived: string | null;
    churnRisk: string | null;
  };
  demographic: {
    region: string | null;
    city: string | null;
    gender: string | null;
    ageGroup: string | null;
    kycLevel: string | null;
    deviceType: string | null;
  };
  value: {
    tier: string | null;
  };
}

export interface SegmentCreateRequest {
  name: string;
  description: string;
  config: {
    autoRefresh: boolean;
    refreshInterval: string;
    ruleLogic: "AND" | "OR";
    status: string;
  };
  filters: SegmentFilters;
}

export interface SegmentCreateResponse {
  status: string;
  message: string;
  segment: Segment & {
    auto_refresh: boolean;
    refresh_interval: string;
    metadata: Record<string, any>;
    action: string;
    is_active: boolean;
  };
  estimated_preview: {
    total_customers: number;
    percent_of_base: number;
    active_rate: number;
    new_registrations: number;
    high_value_percent: number;
    estimated_refresh_time: string;
  };
}

export interface SegmentUpdateResponse {
  status: string;
  message: string;
  segment: Segment & {
    auto_refresh: boolean;
    refresh_interval: string;
    metadata: Record<string, any>;
    action: string;
    is_active: boolean;
  };
}

export interface SegmentDeleteResponse {
  status: string;
  message: string;
}

// API Functions
export async function fetchSegments(): Promise<SegmentListResponse> {
  const response = await fetch(`${API_BASE_URL}/segments/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch segments: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchSegmentDetail(id: string): Promise<SegmentDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/segments/${id}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch segment: ${response.statusText}`);
  }
  return response.json();
}

export async function createSegment(data: SegmentCreateRequest): Promise<SegmentCreateResponse> {
  const response = await fetch(`${API_BASE_URL}/segments/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create segment: ${response.statusText}`);
  }
  return response.json();
}

export async function updateSegment(id: string, data: SegmentCreateRequest): Promise<SegmentUpdateResponse> {
  const response = await fetch(`${API_BASE_URL}/segments/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update segment: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteSegment(id: string): Promise<SegmentDeleteResponse> {
  const response = await fetch(`${API_BASE_URL}/segments/${id}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete segment: ${response.statusText}`);
  }
  return response.json();
}
