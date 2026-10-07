import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    // 1. Spieler in der Datenbank suchen
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Account nicht gefunden.' }, { status: 404 });
    }
    if (user.isVerified) {
      return NextResponse.json({ error: 'Dein Konto ist bereits freigeschaltet.' }, { status: 400 });
    }
    if (user.verificationCode !== code) {
      return NextResponse.json({ error: 'Der eingegebene Code ist falsch.' }, { status: 400 });
    }

    // 2. Code stimmt! Spieler verifizieren und den Code aus Sicherheitsgründen löschen
    await prisma.user.update({
      where: { email },
      data: { 
        isVerified: true, 
        verificationCode: null 
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fehler bei der Serververbindung.' }, { status: 500 });
  }
}
