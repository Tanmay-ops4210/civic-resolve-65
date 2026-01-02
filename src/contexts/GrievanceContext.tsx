import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export type GrievanceStatus = 'pending' | 'in-progress' | 'resolved' | 'escalated';
export type GrievanceCategory = 'water-supply' | 'road-maintenance' | 'garbage' | 'electricity' | 'drainage' | 'other';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Grievance {
  id: string;
  trackingId: string;
  citizenId: string;
  citizenName: string;
  category: GrievanceCategory;
  ward: string;
  description: string;
  status: GrievanceStatus;
  priority: Priority;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  adminRemarks?: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  status: GrievanceStatus;
  message: string;
  timestamp: Date;
  by: string;
}

const THANE_WARDS = [
  'Naupada', 'Kopri', 'Wagle Estate', 'Majiwada', 'Manpada',
  'Hiranandani', 'Ghodbunder', 'Kalwa', 'Mumbra', 'Diva',
  'Bhiwandi', 'Ulhasnagar', 'Thane West', 'Thane East', 'Vartak Nagar'
];

const CATEGORIES: { value: GrievanceCategory; label: string }[] = [
  { value: 'water-supply', label: 'Water Supply' },
  { value: 'road-maintenance', label: 'Road Maintenance' },
  { value: 'garbage', label: 'Garbage Collection' },
  { value: 'electricity', label: 'Street Lighting' },
  { value: 'drainage', label: 'Drainage Issues' },
  { value: 'other', label: 'Other' },
];

interface GrievanceContextType {
  grievances: Grievance[];
  addGrievance: (data: Partial<Grievance>) => Promise<Grievance>;
  updateGrievance: (id: string, data: Partial<Grievance>) => Promise<void>;
  getGrievancesByUser: (userId: string) => Promise<Grievance[]>;
  getGrievanceByTrackingId: (trackingId: string) => Promise<Grievance | undefined>;
  wards: string[];
  categories: typeof CATEGORIES;
  getStats: () => Promise<any>;
}

const GrievanceContext = createContext<GrievanceContextType | undefined>(undefined);

export function GrievanceProvider({ children }: { children: ReactNode }) {
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  const addGrievance = async (data: Partial<Grievance>): Promise<Grievance> => {
    const formData = new FormData();
    formData.append('category', data.category || '');
    formData.append('ward', data.ward || '');
    formData.append('description', data.description || '');
    formData.append('priority', data.priority || 'medium');
    if (data.latitude) formData.append('latitude', data.latitude.toString());
    if (data.longitude) formData.append('longitude', data.longitude.toString());
    if (data.imageUrl) {
      const blob = await fetch(data.imageUrl).then(r => r.blob());
      formData.append('image', blob, 'image.jpg');
    }
    
    const token = localStorage.getItem('auth_token');
    const response = await fetch('http://localhost:5001/api/grievances', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    
    const result = await response.json();
    if (response.ok) {
      const newGrievance = {
        ...result.data,
        createdAt: new Date(result.data.createdAt),
        updatedAt: new Date(result.data.updatedAt),
        timeline: result.data.timeline.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }))
      };
      setGrievances(prev => [newGrievance, ...prev]);
      return newGrievance;
    }
    throw new Error(result.message);
  };

  const updateGrievance = async (id: string, data: Partial<Grievance>) => {
    const response = await apiRequest(`/grievances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      const result = await response.json();
      setGrievances(prev => prev.map(g => 
        g.id === id ? { 
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
          timeline: result.data.timeline.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp)
          }))
        } : g
      ));
    }
  };

  const getGrievancesByUser = async (userId: string) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(
      `http://localhost:5001/api/grievances?citizenId=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const result = await response.json();
    const data = (result.data || []).map((g: any) => ({
      ...g,
      createdAt: new Date(g.createdAt),
      updatedAt: new Date(g.updatedAt),
      timeline: g.timeline.map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp)
      }))
    }));
    setGrievances(data);
    return data;
  };

  const getGrievanceByTrackingId = async (trackingId: string) => {
    const response = await fetch(
      `http://localhost:5001/api/grievances/track/${trackingId}`
    );
    
    const result = await response.json();
    if (result.data) {
      return {
        ...result.data,
        createdAt: new Date(result.data.createdAt),
        updatedAt: new Date(result.data.updatedAt),
        timeline: result.data.timeline.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }))
      };
    }
    return undefined;
  };

  const getStats = async () => {
    const response = await apiRequest('/analytics/stats');
    const result = await response.json();
    return result.data;
  };

  return (
    <GrievanceContext.Provider value={{
      grievances,
      addGrievance,
      updateGrievance,
      getGrievancesByUser,
      getGrievanceByTrackingId,
      wards: THANE_WARDS,
      categories: CATEGORIES,
      getStats
    }}>
      {children}
    </GrievanceContext.Provider>
  );
}

export function useGrievances() {
  const context = useContext(GrievanceContext);
  if (!context) {
    throw new Error('useGrievances must be used within a GrievanceProvider');
  }
  return context;
}
