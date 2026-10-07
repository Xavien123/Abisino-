// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateDeviceHash } from '@/lib/auth-server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password, inviteToken } = await req.json();
    const deviceHash = generateDeviceHash(req);
    const normalizedUsername = username.toLowerCase().trim();

    // 1. Prüfe, ob Device/IP bereits existiert (Anti-Multi-Account)
    const existingDevice = await prisma.user.findUnique({ where: { deviceHash } });
    if (existingDevice) {
      return NextResponse.json({ error: 'Device or IP already registered.' }, { status: 403 });
    }

    // 2. Transaktion zur sicheren Anlage
    const newUser = await prisma.$transaction(async (tx) => {
      // Invite validieren
      const invite = await tx.inviteToken.findUnique({ where: { token: inviteToken } });
      if (!invite || invite.usedBy || (invite.expiresAt && invite.expiresAt < new Date())) {
        throw new Error('Invalid or expired invite token.');
      }

      // User validieren
      const existingUser = await tx.user.findUnique({ where: { username: normalizedUsername } });
      if (existingUser) throw new Error('Username already taken.');

      const passwordHash = await bcrypt.hash(password, 10);

      // User erstellen
      const user = await tx.user.create({
        data: {
          username: normalizedUsername,
          passwordHash,
          deviceHash,
          wallet: {
            create: { balance: 200 } // Exakt 2.00 AC Startguthaben
          }
        },
      });

      // Token entwerten
      await tx.inviteToken.update({
        where: { id: invite.id },
        data: { usedBy: user.id, usedAt: new Date() }
      });

      return user;
    });

    return NextResponse.json({ message: 'Registration successful', userId: newUser.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
