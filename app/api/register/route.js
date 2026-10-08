import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

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

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
        verificationCode: verificationCode
      }
    });

    // HIER IST DIE ÄNDERUNG: Explizite Daten, damit Render nicht blockiert
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Dein Abisino VIP-Code',
      text: `Hallo ${name},\n\ndein 6-stelliger VIP-Code lautet: ${verificationCode}\n\nViel Spaß im Casino!`,
      html: `<p>Hallo ${name},</p><p>dein 6-stelliger VIP-Code lautet: <strong>${verificationCode}</strong></p><p>Viel Spaß im Casino!</p>`
    });

    return NextResponse.json({ success: true, message: 'Account erstellt' }, { status: 201 });
    
  } catch (error) {
    // Falls es nochmal hakt, gibt es jetzt sofort eine Fehlermeldung statt ewigem Laden!
    console.error(error);
    return NextResponse.json({ error: 'Fehler beim E-Mail-Versand.' }, { status: 500 });
  }
}
