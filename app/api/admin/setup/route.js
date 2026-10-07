// app/api/admin/setup/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { username, password, adminSecret } = await req.json();

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const normalizedUsername = username.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        username: normalizedUsername,
        passwordHash,
        role: 'ADMIN',
        wallet: { create: { balance: 0 } }
      }
    });

    return NextResponse.json({ message: 'Admin created', adminId: admin.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
