import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flow interfaces based on the API documentation
export interface FlowNode {
  id: string;
  order: number;
  node: {
    id: string;
    name: string;
    subnodes: Subnode[];
  };
  selected_subnode?: {
    id: string;
    name: string;
    parameter_values: ParameterValue[];
  };
  outgoing_edges?: Edge[];
}

export interface Subnode {
  id: string;
  name: string;
  parameters: Parameter[];
  is_selected: boolean;
}

export interface Parameter {
  key: string;
  default_value: string;
}

export interface ParameterValue {
  parameter_key: string;
  value: string;
}

export interface Edge {
  id: string;
  from_node: string;
  to_node: string;
  condition?: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  is_deployed: boolean;
  is_running: boolean;
  flow_nodes: FlowNode[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface DeployedNode {
  id: string;
  name: string;
  subnodes: Subnode[];
}

// API Service Functions
export const flowService = {
  // Create a new flow
  async createFlow(data: { name: string; description: string }): Promise<Flow> {
    const response = await axiosInstance.post('flows/', data);
    return response.data;
  },

  // Get deployed nodes for flow editor
  async getDeployedNodes(): Promise<DeployedNode[]> {
    const response = await axiosInstance.get('nodes/');
    return response.data;
  },

  // Add node to flow
  async addNodeToFlow(data: { flow: string; node: string; order: number }): Promise<FlowNode> {
    const response = await axiosInstance.post('flownode/', data);
    return response.data;
  },

  // Get flow details
  async getFlow(id: string): Promise<Flow> {
    const response = await axiosInstance.get(`flows/${id}/`);
    return response.data;
  },

  // Update flow
  async updateFlow(id: string, data: Partial<Flow>): Promise<Flow> {
    const response = await axiosInstance.put(`flows/${id}/`, data);
    return response.data;
  },

  // Start flow
  async startFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/start/`);
    return response.data;
  },

  // Stop flow
  async stopFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/stop/`);
    return response.data;
  },

  // Deploy flow
  async deployFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/deploy/`);
    return response.data;
  },

  // Undeploy flow
  async undeployFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/undeploy/`);
    return response.data;
  },
};

// Custom hook for deployed nodes
export const useDeployedNodes = () => {
  const [data, setData] = useState<DeployedNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNodes = async () => {
      try {
        console.log('Loading deployed nodes from API...');
        const nodes = await flowService.getDeployedNodes();
        console.log('Deployed nodes loaded successfully:', nodes);
        setData(nodes);
        setError(null);
      } catch (err: any) {
        console.error('Error loading deployed nodes:', err);
        setError(err.response?.data?.error || err.message || 'Error fetching deployed nodes');
      } finally {
        setLoading(false);
      }
    };

    loadNodes();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const nodes = await flowService.getDeployedNodes();
      setData(nodes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching deployed nodes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for single flow
export const useFlow = (id: string) => {
  const [data, setData] = useState<Flow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadFlow = async () => {
      try {
        setLoading(true);
        const flow = await flowService.getFlow(id);
        setData(flow);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching flow');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFlow();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const flow = await flowService.getFlow(id);
      setData(flow);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching flow');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};