import axios from 'axios';
import { Bug } from '../types';

const API_URL = 'http://localhost:5000/api';

export const fetchBugs = async (): Promise<Bug[]> => {
  const response = await axios.get(`${API_URL}/bugs`);
  return response.data;
};

export const fetchBugById = async (id: string): Promise<Bug> => {
  const response = await axios.get(`${API_URL}/bugs/${id}`);
  return response.data;
};

export const createBug = async (formData: FormData): Promise<Bug> => {
  const response = await axios.post(`${API_URL}/bugs`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateBugStatus = async (id: string, status: string): Promise<Bug> => {
  const response = await axios.patch(`${API_URL}/bugs/${id}/status`, { status });
  return response.data;
};

export const deleteBug = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/bugs/${id}`);
};