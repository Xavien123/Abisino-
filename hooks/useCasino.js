// hooks/useCasino.js
'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket-client';

export function useCasino() {
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [activePlayers, setActivePlayers] = useState(0);

  useEffect(() => {
    const socket = getSocket();
    
    socket.connect();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    
    // Globales Echtzeit-Wallet-Update
    socket.on('balance_update', (data) => {
      setBalance(data.balance);
    });

    // Lobby Statistiken
    socket.on('global_stats', (data) => {
      setActivePlayers(data.activeConnections);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('balance_update');
      socket.off('global_stats');
    };
  }, []);

  return { socket: getSocket(), balance, isConnected, activePlayers };
}
