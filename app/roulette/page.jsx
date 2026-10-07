// app/roulette/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCasino } from '@/hooks/useCasino';

export default function RouletteTable() {
  const { socket, balance } = useCasino();
  const [rotation, setRotation] = useState(0);
  const [winningNumber, setWinningNumber] = useState(null);
  const [betAmount, setBetAmount] = useState(100); // 1.00 AC default (Integer!)
  const [phase, setPhase] = useState('BETTING'); // BETTING, SPINNING, RESULT

  useEffect(() => {
    // Wenn der Server den globalen Spin einleitet
    socket.on('roulette_spin', (data) => {
      setPhase('SPINNING');
      setWinningNumber(null);
      // data.degrees ist z.B. 3600 (10 Umdrehungen) + Zielgrad der Kugel
      setRotation(prev => prev + data.degrees); 
    });

    socket.on('roulette_result', (data) => {
      setWinningNumber(data.number);
      setPhase('RESULT');
      // Nach 5 Sekunden wieder setzen freigeben
      setTimeout(() => setPhase('BETTING'), 5000);
    });

    return () => {
      socket.off('roulette_spin');
      socket.off('roulette_result');
    };
  }, [socket]);

  const placeBet = (type) => {
    if (phase !== 'BETTING') return;
    socket.emit('place_bet', { game: 'roulette', type, amount: betAmount });
  };

  return (
    <div className="flex flex-col items-center gap-12 mt-8">
      
      {/* 3D Roulette Rad Simulation */}
      <div className="relative w-80 h-80 rounded-full border-[16px] border-casino-graphite shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center bg-casino-greenLight overflow-hidden">
        <motion.div 
          className="absolute w-full h-full"
          animate={{ rotate: rotation }}
          transition={{ duration: 6, ease: [0.2, 0.8, 0.2, 1] }} // Casino-typisches Ausrollen
        >
          {/* Stark vereinfachte Rad-Darstellung für den Code */}
          <div className="w-full h-full bg-[conic-gradient(red_0_49%,black_50_100%)] rounded-full opacity-80 mix-blend-overlay"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="w-4 h-4 bg-white rounded-full translate-y-28 shadow-lg"></span> {/* Kugel */}
          </div>
        </motion.div>
        
        {/* Center Pivot */}
        <div className="absolute z-10 w-16 h-16 rounded-full bg-casino-gold flex items-center justify-center shadow-inner">
          {winningNumber !== null && (
            <span className="text-2xl font-bold text-black">{winningNumber}</span>
          )}
        </div>
      </div>

      {/* Betting Dashboard */}
      <div className="bg-casino-green p-8 rounded-2xl border border-casino-gold/30 shadow-2xl w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-casino-gold uppercase tracking-wider">Einsatz platzieren</h2>
          <div className="flex gap-2">
            {[100, 500, 1000, 5000].map(amt => ( // 1 AC, 5 AC, 10 AC, 50 AC
              <button 
                key={amt}
                onClick={() => setBetAmount(amt)}
                className={`w-12 h-12 rounded-full border-2 font-bold transition-all ${betAmount === amt ? 'border-white bg-casino-gold text-black shadow-[0_0_15px_#D4AF37]' : 'border-casino-gold text-casino-gold hover:bg-casino-gold/10'}`}
              >
                {amt / 100}
              </button>
            ))}
          </div>
        </div>

        {/* Wett-Felder */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            disabled={phase !== 'BETTING'}
            onClick={() => placeBet('RED')}
            className="py-4 bg-red-700/80 hover:bg-red-600 rounded-lg text-xl font-bold uppercase transition-colors disabled:opacity-50"
          >
            Rot (1:1)
          </button>
          <button 
            disabled={phase !== 'BETTING'}
            onClick={() => placeBet('BLACK')}
            className="py-4 bg-black/80 hover:bg-gray-900 rounded-lg text-xl font-bold uppercase transition-colors border border-gray-700 disabled:opacity-50"
          >
            Schwarz (1:1)
          </button>
        </div>
      </div>
    </div>
  );
}
