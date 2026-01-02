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
  socket.on('grievance:update', (update: any) => {
    if (update.data && update.data.tracking_id === trackingId) {
      callback(update);
    }
  });
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
