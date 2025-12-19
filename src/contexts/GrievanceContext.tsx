import React, { createContext, useContext, useState, ReactNode } from 'react';

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

// Generate mock data
const generateMockGrievances = (): Grievance[] => {
  const mockData: Grievance[] = [];
  const statuses: GrievanceStatus[] = ['pending', 'in-progress', 'resolved', 'escalated'];
  const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
  
  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].value;
    const ward = THANE_WARDS[Math.floor(Math.random() * THANE_WARDS.length)];
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    mockData.push({
      id: `grievance-${i}`,
      trackingId: `TMC${String(2024001 + i).padStart(7, '0')}`,
      citizenId: '1',
      citizenName: `Citizen ${i}`,
      category,
      ward,
      description: `Issue regarding ${category.replace('-', ' ')} in ${ward} ward. Requires immediate attention.`,
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000),
      assignedTo: status !== 'pending' ? 'Municipal Officer' : undefined,
      timeline: [
        {
          id: '1',
          status: 'pending',
          message: 'Complaint registered successfully',
          timestamp: createdAt,
          by: 'System'
        },
        ...(status !== 'pending' ? [{
          id: '2',
          status: 'in-progress' as GrievanceStatus,
          message: 'Assigned to field officer for inspection',
          timestamp: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000),
          by: 'Admin'
        }] : []),
        ...(status === 'resolved' ? [{
          id: '3',
          status: 'resolved' as GrievanceStatus,
          message: 'Issue has been resolved',
          timestamp: new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000),
          by: 'Field Officer'
        }] : [])
      ]
    });
  }
  return mockData;
};

interface GrievanceContextType {
  grievances: Grievance[];
  addGrievance: (data: Partial<Grievance>) => Grievance;
  updateGrievance: (id: string, data: Partial<Grievance>) => void;
  getGrievancesByUser: (userId: string) => Grievance[];
  getGrievanceByTrackingId: (trackingId: string) => Grievance | undefined;
  wards: string[];
  categories: typeof CATEGORIES;
  getStats: () => {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    escalated: number;
    byWard: Record<string, number>;
    byCategory: Record<string, number>;
    avgResolutionDays: number;
  };
}

const GrievanceContext = createContext<GrievanceContextType | undefined>(undefined);

export function GrievanceProvider({ children }: { children: ReactNode }) {
  const [grievances, setGrievances] = useState<Grievance[]>(generateMockGrievances);

  const addGrievance = (data: Partial<Grievance>): Grievance => {
    const trackingId = `TMC${String(2024000 + grievances.length + 1).padStart(7, '0')}`;
    const newGrievance: Grievance = {
      id: `grievance-${Date.now()}`,
      trackingId,
      citizenId: data.citizenId || '',
      citizenName: data.citizenName || '',
      category: data.category || 'other',
      ward: data.ward || '',
      description: data.description || '',
      status: 'pending',
      priority: 'medium',
      imageUrl: data.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [{
        id: '1',
        status: 'pending',
        message: 'Complaint registered successfully',
        timestamp: new Date(),
        by: 'System'
      }]
    };
    setGrievances(prev => [newGrievance, ...prev]);
    return newGrievance;
  };

  const updateGrievance = (id: string, data: Partial<Grievance>) => {
    setGrievances(prev => prev.map(g => 
      g.id === id ? { ...g, ...data, updatedAt: new Date() } : g
    ));
  };

  const getGrievancesByUser = (userId: string) => {
    return grievances.filter(g => g.citizenId === userId);
  };

  const getGrievanceByTrackingId = (trackingId: string) => {
    return grievances.find(g => g.trackingId.toLowerCase() === trackingId.toLowerCase());
  };

  const getStats = () => {
    const total = grievances.length;
    const pending = grievances.filter(g => g.status === 'pending').length;
    const inProgress = grievances.filter(g => g.status === 'in-progress').length;
    const resolved = grievances.filter(g => g.status === 'resolved').length;
    const escalated = grievances.filter(g => g.status === 'escalated').length;

    const byWard: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    grievances.forEach(g => {
      byWard[g.ward] = (byWard[g.ward] || 0) + 1;
      byCategory[g.category] = (byCategory[g.category] || 0) + 1;
    });

    const resolvedGrievances = grievances.filter(g => g.status === 'resolved');
    const avgResolutionDays = resolvedGrievances.length > 0
      ? resolvedGrievances.reduce((acc, g) => {
          const days = (g.updatedAt.getTime() - g.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return acc + days;
        }, 0) / resolvedGrievances.length
      : 0;

    return { total, pending, inProgress, resolved, escalated, byWard, byCategory, avgResolutionDays };
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
