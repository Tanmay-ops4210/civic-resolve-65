# Frontend Integration Guide

This guide explains how to integrate the Civic Resolve frontend with this backend API.

## API Base URL

Update your frontend API configuration to point to:
```
http://localhost:5001/api
```

## Authentication

### 1. Update AuthContext

Replace the mock authentication in `src/contexts/AuthContext.tsx` with API calls:

```typescript
const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.user.role === role) {
      const userData = {
        id: data.user.id.toString(),
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        ward: data.user.ward,
        phone: data.user.phone,
      };
      
      setUser(userData);
      localStorage.setItem('grievance_user', JSON.stringify(userData));
      localStorage.setItem('auth_token', data.token);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  } catch (error) {
    console.error('Login error:', error);
    setIsLoading(false);
    return false;
  }
};

const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // After registration, login the user
      return await login(userData.email, userData.password, userData.role);
    }
    
    setIsLoading(false);
    return false;
  } catch (error) {
    console.error('Registration error:', error);
    setIsLoading(false);
    return false;
  }
};
```

### 2. Add Token to API Requests

Create an API utility file `src/lib/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5001/api';

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};
```

## Grievance Management

### 1. Update GrievanceContext

Replace mock data in `src/contexts/GrievanceContext.tsx`:

```typescript
const addGrievance = async (data: Partial<Grievance>): Promise<Grievance> => {
  const formData = new FormData();
  formData.append('category', data.category || '');
  formData.append('ward', data.ward || '');
  formData.append('description', data.description || '');
  formData.append('priority', data.priority || 'medium');
  if (data.latitude) formData.append('latitude', data.latitude.toString());
  if (data.longitude) formData.append('longitude', data.longitude.toString());
  if (data.imageUrl) {
    // Convert base64 to file if needed
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
    return result.data;
  }
  throw new Error(result.message);
};

const getGrievancesByUser = async (userId: string): Promise<Grievance[]> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(
    `http://localhost:5001/api/grievances?citizenId=${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  
  const result = await response.json();
  return result.data || [];
};

const getGrievanceByTrackingId = async (trackingId: string): Promise<Grievance | undefined> => {
  const response = await fetch(
    `http://localhost:5001/api/grievances/track/${trackingId}`
  );
  
  const result = await response.json();
  return result.data;
};
```

### 2. Update SubmitGrievance Component

In `src/pages/citizen/SubmitGrievance.tsx`, update the submit handler:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.category || !formData.ward || !formData.description) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields.",
      variant: "destructive",
    });
    return;
  }

  if (!selectedLocation) {
    toast({
      title: "Location Required",
      description: "Please pinpoint the location on the map.",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('category', formData.category);
    formDataToSend.append('ward', formData.ward);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('latitude', selectedLocation.lat.toString());
    formDataToSend.append('longitude', selectedLocation.lng.toString());
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch('http://localhost:5001/api/grievances', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formDataToSend,
    });

    const result = await response.json();
    
    if (response.ok) {
      setSubmittedId(result.data.tracking_id);
      toast({
        title: "Success",
        description: "Grievance submitted successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to submit grievance",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "An error occurred while submitting",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

## Real-time Updates with WebSocket

### 1. Install Socket.io Client

```bash
npm install socket.io-client
```

### 2. Create WebSocket Service

Create `src/services/websocket.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectWebSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io('http://localhost:5001', {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });

  return socket;
};

export const subscribeToGrievance = (
  trackingId: string,
  callback: (data: any) => void
) => {
  if (!socket) return;

  socket.emit('subscribe:grievance', trackingId);
  socket.on('grievance:update', callback);
};

export const unsubscribeFromGrievance = (trackingId: string) => {
  if (!socket) return;
  socket.emit('unsubscribe:grievance', trackingId);
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

### 3. Use in Components

In `TrackGrievance.tsx`:

```typescript
import { useEffect } from 'react';
import { subscribeToGrievance, unsubscribeFromGrievance } from '@/services/websocket';

useEffect(() => {
  if (grievance?.tracking_id) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const socket = connectWebSocket(token);
      subscribeToGrievance(grievance.tracking_id, (update) => {
        // Update grievance state with new data
        setGrievance(update.data);
      });
    }
    
    return () => {
      unsubscribeFromGrievance(grievance.tracking_id);
    };
  }
}, [grievance?.tracking_id]);
```

## Analytics Integration

For admin dashboard, fetch analytics:

```typescript
const fetchAnalytics = async () => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch('http://localhost:5001/api/analytics/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  const result = await response.json();
  return result.data;
};
```

## Error Handling

Add global error handling:

```typescript
const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('grievance_user');
    window.location.href = '/login';
  }
};
```

## CORS Configuration

Ensure your backend CORS configuration in `.env` includes your frontend URL:

```env
CORS_ORIGIN=http://localhost:5173
```

## Testing

1. Start the backend: `npm run dev` (in backend directory)
2. Start the frontend: `npm run dev` (in frontend directory)
3. Test authentication flow
4. Test grievance submission
5. Test real-time updates

## Common Issues

### CORS Errors
- Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check browser console for specific CORS errors

### 401 Unauthorized
- Verify token is being sent in Authorization header
- Check token expiration
- Ensure auth service is running

### Image Upload Issues
- Verify `uploads/` directory exists in backend
- Check file size limits (5MB default)
- Ensure proper Content-Type headers

### WebSocket Connection Issues
- Verify WebSocket server is running
- Check token is valid
- Ensure CORS allows WebSocket connections

