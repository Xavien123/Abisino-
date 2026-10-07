// server/socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { addPlayer, removePlayer } = require('./state');

const prisma = new PrismaClient();

function initSocket(httpServer) {
  // Strikte Heartbeat-Settings für schnelle Disconnect-Erkennung (z.B. für Auto-Fold beim Poker)
  const io = new Server(httpServer, {
    cors: { origin: '*' },
    pingInterval: 10000, 
    pingTimeout: 5000    
  });

  // Middleware: Handshake & JWT Validierung
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Auth_Error: Missing Token'));
      }

      // Token verifizieren
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Datenbank-Abgleich (Sicherstellen, dass User nicht gelöscht/gesperrt wurde)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { wallet: true }
      });

      if (!user) return next(new Error('Auth_Error: User not found'));

      // Relevante, unkritische User-Daten an den Socket binden (KEIN Passwort-Hash)
      socket.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        balance: user.wallet.balance // Reminder: Dies ist ein Integer (Units)
      };
      
      next();
    } catch (err) {
      next(new Error('Auth_Error: Invalid Token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🟢 Verbunden: ${socket.user.username} (${socket.id})`);

    // 1. In-Memory Tracking
    addPlayer(socket.user.id, socket.id);

    // 2. Privater Raum für direkte Server-zu-Client Pushes (z.B. Guthaben-Updates)
    const privateRoom = `user_${socket.user.id}`;
    socket.join(privateRoom);

    // 3. Globalen Stats-Broadcast (z.B. für Lobby-Anzeige)
    io.emit('global_stats', { activeConnections: io.engine.clientsCount });

    // --- GENERIC GAME ROOM HANDLING ---
    socket.on('join_game', ({ gameId }) => {
      const roomName = `game_${gameId}`;
      socket.join(roomName);
      console.log(`${socket.user.username} hat Raum ${roomName} betreten.`);
    });

    socket.on('leave_game', ({ gameId }) => {
      const roomName = `game_${gameId}`;
      socket.leave(roomName);
    });

    // --- DISCONNECT HANDLING ---
    socket.on('disconnect', (reason) => {
      console.log(`🔴 Getrennt: ${socket.user.username} (${reason})`);
      removePlayer(socket.user.id);
      
      // TODO (Paket 4): Wenn Spieler in einem Poker-Raum war, Auto-Check/Fold Trigger auslösen
      
      io.emit('global_stats', { activeConnections: io.engine.clientsCount });
    });
  });

  // Den io-Context global verfügbar machen, damit Next.js API-Routen ihn nutzen können 
  // (z.B. wenn der Admin Coins verteilt, triggert die REST-API einen Socket-Push)
  global.io = io; 

  return io;
}

module.exports = { initSocket };
