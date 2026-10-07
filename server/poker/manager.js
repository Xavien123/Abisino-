// server/poker/manager.js
const { PrismaClient } = require('@prisma/client');
const PokerTable = require('./engine');

const prisma = new PrismaClient();
const activeTables = new Map(); // tableId -> PokerTable instance

function getOrCreateTable(tableId, io) {
  if (!activeTables.has(tableId)) {
    activeTables.set(tableId, new PokerTable(tableId, io));
  }
  return activeTables.get(tableId);
}

// Atomarer Buy-In am Tisch (Datenbank zu In-Memory-Stack)
async function buyIn(userId, tableId, buyInAmountUnits, seatIndex, io) {
  const table = getOrCreateTable(tableId, io);
  
  // 1. Sichere Transaktion: Chips vom Wallet abziehen
  const result = await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < buyInAmountUnits) {
      throw new Error("Insufficient funds for Buy-In");
    }

    const updatedWallet = await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: buyInAmountUnits } }
    });

    // Logging für den Vault
    await tx.transaction.create({
      data: {
        userId,
        amount: buyInAmountUnits,
        type: 'BET',
        description: `Poker Buy-In Table ${tableId}`,
        referenceId: tableId
      }
    });

    return updatedWallet;
  });

  // 2. User aus DB laden für Username
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // 3. Dem Tisch hinzufügen
  table.addPlayer(user, seatIndex, buyInAmountUnits);

  return result.balance; // Neues Wallet-Guthaben
}

// Cash-Out: Spieler verlässt Tisch, Stack geht zurück ins Wallet
async function cashOut(userId, tableId) {
  const table = activeTables.get(tableId);
  if (!table) return;

  const playerSeat = table.seats.find(p => p && p.id === userId);
  if (!playerSeat) return;

  const amountToReturn = playerSeat.stack;

  // Atomares Zurückbuchen in DB
  await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: amountToReturn } }
    });

    await tx.transaction.create({
      data: {
        userId,
        amount: amountToReturn,
        type: 'WIN',
        description: `Poker Cash-Out Table ${tableId}`,
        referenceId: tableId
      }
    });
  });

  table.removePlayer(userId);
}

module.exports = { getOrCreateTable, buyIn, cashOut };
