import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces based on API response
export interface NodeParameter {
  id: string;
  node: string;
  key: string;
  default_value: string;
  required: boolean;
  last_updated_by: string | null;
  last_updated_at: string;
}

export interface Subnode {
  id: string;
  name: string;
  version: number;
  is_selected: boolean;
  parameters: NodeParameter[];
}

export interface Node {
  id: string;
  name: string;
  version: number;
  created_at: string;
  updated_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
  subnodes: Subnode[];
  node_type?: string;
}

// API Service Functions
export const nodeService = {
  // List all nodes
  async getAllNodes(): Promise<Node[]> {
    const response = await axiosInstance.get('nodes/');
    return response.data;
  },

  // Get single node detail
  async getNode(id: string): Promise<Node> {
    const response = await axiosInstance.get(`nodes/${id}/`);
    return response.data;
  },

  // Update node
  async updateNode(id: string, data: Partial<Node>): Promise<Node> {
    const response = await axiosInstance.put(`nodes/${id}/`, data);
    return response.data;
  },

  // Delete node
  async deleteNode(id: string): Promise<void> {
    await axiosInstance.delete(`nodes/${id}/`);
  },

  // Deploy node
  async deployNode(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`nodes/${id}/deploy/`);
    return response.data;
  },

  // Undeploy node
  async undeployNode(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`nodes/${id}/undeploy/`);
    return response.data;
  },

  // List node parameters
  async getNodeParameters(id: string): Promise<NodeParameter[]> {
    const response = await axiosInstance.get(`nodes/${id}/parameters/`);
    return response.data;
  },

  // Add parameter to node
  async addNodeParameter(id: string, key: string, value: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`nodes/${id}/parameters_add/`, {
      key,
      value,
    });
    return response.data;
  },

  // Remove parameter from node
  async removeNodeParameter(id: string, parameterId: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`nodes/${id}/remove_parameter/`, {
      parameter_id: parameterId,
    });
    return response.data;
  },

  // List subnodes
  async getNodeSubnodes(id: string): Promise<Subnode[]> {
    const response = await axiosInstance.get(`nodes/${id}/subnodes/`);
    return response.data;
  },

  // Add subnode
  async addSubnode(id: string, subnodeData: Partial<Subnode>): Promise<{ status: string }> {
    const response = await axiosInstance.post(`nodes/${id}/subnodes_add/`, subnodeData);
    return response.data;
  },

  // List node versions
  async getNodeVersions(id: string): Promise<Node[]> {
    const response = await axiosInstance.get(`nodes/${id}/versions/`);
    return response.data;
  },
};

// Custom hook for fetching all nodes
export const useNodes = () => {
  const [data, setData] = useState<Node[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNodes = async () => {
      try {
        console.log('Loading nodes from API...');
        const nodes = await nodeService.getAllNodes();
        console.log('Nodes loaded successfully:', nodes);
        setData(nodes);
        setError(null);
      } catch (err: any) {
        console.error('Error loading nodes:', err);
        setError(err.response?.data?.error || err.message || 'Error fetching nodes');
      } finally {
        setLoading(false);
      }
    };

    loadNodes();
  }, []);

  const refetch = () => {
    const loadNodes = async () => {
      try {
        const nodes = await nodeService.getAllNodes();
        setData(nodes);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching nodes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNodes();
  };

  return { data, loading, error, refetch };
};

// Custom hook for fetching single node
export const useNode = (id: string) => {
  const [data, setData] = useState<Node | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadNode = async () => {
      try {
        setLoading(true);
        const node = await nodeService.getNode(id);
        setData(node);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching node');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNode();
  }, [id]);

  const refetch = () => {
    const loadNode = async () => {
      try {
        setLoading(true);
        const node = await nodeService.getNode(id);
        setData(node);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching node');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNode();
  };

  return { data, loading, error, refetch };
};