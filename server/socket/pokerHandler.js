// server/socket/pokerHandler.js
const { getOrCreateTable, buyIn, cashOut } = require('../poker/manager');

function registerPokerHandlers(io, socket) {
  socket.on('poker_join', async ({ tableId, seatIndex, buyInAmount }) => {
    try {
      // Strikt Integer
      const buyInInt = Math.floor(Number(buyInAmount)); 
      await buyIn(socket.user.id, tableId, buyInInt, seatIndex, io);
      
      // Update globales Client-Wallet
      const newWallet = await prisma.wallet.findUnique({ where: { userId: socket.user.id } });
      socket.emit('balance_update', { balance: newWallet.balance });
      
    } catch (err) {
      socket.emit('error_notification', { message: err.message });
    }
  });

  socket.on('poker_action', ({ tableId, action, amount }) => {
    try {
      const table = getOrCreateTable(tableId, io);
      table.handleAction(socket.user.id, action, amount);
    } catch (err) {
      socket.emit('error_notification', { message: err.message });
    }
  });

  socket.on('poker_leave', async ({ tableId }) => {
    await cashOut(socket.user.id, tableId);
    // Erneuter Balance-Push an Client
    const newWallet = await prisma.wallet.findUnique({ where: { userId: socket.user.id } });
    socket.emit('balance_update', { balance: newWallet.balance });
  });

  // Disconnect Fallback: Auto-Cash-Out und Auto-Fold
  socket.on('disconnect', async () => {
    // Hier alle aktiven Tische des Users iterieren und cashOut() callen
  });
}

module.exports = { registerPokerHandlers };
