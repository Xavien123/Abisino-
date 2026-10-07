import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // 1. Prüfen, ob der Spieler schon existiert (Verhindert doppelte 2 AC Boni)
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Diese E-Mail wird bereits verwendet.' }, { status: 400 });
    }

    // 2. Neuen Spieler im Tresor speichern
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password // In einer finalen Version wird das noch verschlüsselt
      }
    });

    return NextResponse.json({ success: true, message: 'Account erfolgreich erstellt!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fehler bei der Kontoerstellung.' }, { status: 500 });
  }
}
