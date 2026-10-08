import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Diese E-Mail wird bereits verwendet.' }, { status: 400 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Nutzer in der Datenbank erstellen
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
        verificationCode: verificationCode
      }
    });

    // E-MAIL-VERSAND IST HIER FÜR DEN TEST DEAKTIVIERT

    return NextResponse.json({ success: true, message: 'Account erstellt (Ohne E-Mail)' }, { status: 201 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ein Fehler ist aufgetreten.' }, { status: 500 });
  }
}
