import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // 1. Prüfen ob User existiert
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Diese E-Mail wird bereits verwendet.' }, { status: 400 });
    }

    // 2. 6-stelligen Code generieren (z.B. "482910")
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. User MIT dem Code in der Datenbank erstellen
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
        verificationCode: verificationCode // Code wird für die spätere Prüfung gespeichert
      }
    });

    // 4. Postbote (Nodemailer) vorbereiten
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5. E-Mail abschicken
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Dein Abisino VIP-Code',
      text: `Hallo ${name},\n\ndein 6-stelliger VIP-Code lautet: ${verificationCode}\n\nViel Spaß im Casino!`,
      html: `<p>Hallo ${name},</p><p>dein 6-stelliger VIP-Code lautet: <strong>${verificationCode}</strong></p><p>Viel Spaß im Casino!</p>`
    });

    return NextResponse.json({ success: true, message: 'Account erstellt und E-Mail versendet' }, { status: 201 });
    
  } catch (error) {
    console.error("Fehler beim Registrieren:", error);
    return NextResponse.json({ error: 'Fehler bei der Kontoerstellung.' }, { status: 500 });
  }
}
