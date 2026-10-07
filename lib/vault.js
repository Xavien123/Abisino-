// lib/vault.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function adminTransferCoins(adminId, targetUserId, amountUnits, description) {
  // Sicherheits-Check: Nur Ganzzahlen erlaubt (Cents/Units)
  if (!Number.isInteger(amountUnits) || amountUnits <= 0) {
    throw new Error('Invalid amount: Must be a positive integer (units).');
  }

  // Atomare Transaktion: 
  // 1. AuditLog schreiben
  // 2. User Wallet updaten
  // 3. Transaction Log schreiben
  const result = await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.update({
      where: { userId: targetUserId },
      data: { balance: { increment: amountUnits } },
    });

    await tx.transaction.create({
      data: {
        userId: targetUserId,
        amount: amountUnits,
        type: 'ADMIN_MINT',
        description: description || 'Admin Bonus',
      },
    });

    await tx.auditLog.create({
      data: {
        adminId: adminId,
        action: 'MINT_COINS',
        details: { targetUserId, amountUnits, description },
      },
    });

    return wallet;
  });

  // WICHTIG: WebSocket Push an den spezifischen Nutzer in Echtzeit!
  // global.io wurde in server/socket.js (Paket 2) registriert.
  if (global.io) {
    global.io.to(`user_${targetUserId}`).emit('balance_update', { balance: result.balance });
  }

  return result;
}
