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

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password 
      }
    });

    return NextResponse.json({ success: true, message: 'Account erfolgreich erstellt!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fehler bei der Kontoerstellung.' }, { status: 500 });
  }
}
