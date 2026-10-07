// lib/auth-server.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verifiziert den JWT aus dem Authorization-Header
export async function authenticate(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

export async function authenticateAdmin(req) {
  const decoded = await authenticate(req);
  if (decoded.role !== 'ADMIN') throw new Error('Forbidden: Admin only');
  return decoded;
}

// Generiert den Device Hash für die Anti-Multi-Account-Sperre
export function generateDeviceHash(req) {
  // x-forwarded-for greift die echte IP hinter Cloud-Loadbalancern ab (Render/Railway)
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip';
  const userAgent = req.headers.get('user-agent') || 'unknown-ua';
  
  return crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex');
}
