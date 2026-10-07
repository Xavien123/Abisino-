// app/api/admin/invite/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { authenticateAdmin } from '@/lib/auth-server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const admin = await authenticateAdmin(req);
    
    // Generiert einen sicheren, 16-stelligen Hex-String
    const tokenStr = crypto.randomBytes(8).toString('hex');
    
    // Optional: Ablaufdatum (z.B. in 24 Stunden)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const invite = await prisma.inviteToken.create({
      data: {
        token: tokenStr,
        createdBy: admin.userId,
        expiresAt: expiresAt
      }
    });

    return NextResponse.json({ token: invite.token, expiresAt });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
