// components/Navbar.jsx
'use client';

import { useCasino } from '@/hooks/useCasino';
import { formatAC } from '@/lib/utils';
import { Wallet, SignalHigh, SignalZero, Users } from 'lucide-react';

export default function Navbar() {
  const { balance, isConnected, activePlayers } = useCasino();

  return (
    <nav className="fixed top-0 w-full bg-casino-graphite border-b border-casino-gold/20 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-widest text-casino-gold uppercase">
            Abi Casino
          </span>
          <div className="flex items-center gap-1 ml-4 text-xs text-gray-400">
            <Users size={14} /> {activePlayers} Online
          </div>
        </div>

        {/* User Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-casino-dark px-4 py-2 rounded-full border border-casino-gold/30">
            <Wallet size={16} className="text-casino-gold" />
            <span className="font-mono text-sm font-semibold tracking-wider text-green-400">
              {formatAC(balance)}
            </span>
          </div>

          <div title={isConnected ? "Verbunden" : "Getrennt"}>
            {isConnected ? (
              <SignalHigh size={20} className="text-green-500" />
            ) : (
              <SignalZero size={20} className="text-casino-danger" />
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
