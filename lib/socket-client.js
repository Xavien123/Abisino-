// lib/socket-client.js
import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    // Nimmt den Token aus dem LocalStorage (wird beim Login gesetzt)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    
    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
      auth: { token },
      autoConnect: false, // Wird erst explizit nach dem Login verbunden
    });
  }
  return socket;
};
