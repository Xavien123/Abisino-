// app/api/admin/mint/route.js
import { NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth-server';
import { adminTransferCoins } from '@/lib/vault';

export async function POST(req) {
  try {
    const admin = await authenticateAdmin(req);
    const { targetUserId, amountUnits, description } = await req.json();

    // Ruft die Ledger-Engine auf und triggert den WebSocket-Push
    const updatedWallet = await adminTransferCoins(admin.userId, targetUserId, amountUnits, description);

    return NextResponse.json({ 
      message: 'Coins minted and transferred successfully.',
      newBalance: updatedWallet.balance
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
