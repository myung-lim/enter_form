import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const setCors = (res: VercelResponse) => {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
};

const getTransporter = () => {
  const user = process.env.SMTP_USER ?? 'auraji05';
  const authUser = user.includes('@') ? user : `${user}@naver.com`;
  return nodemailer.createTransport({
    host: process.env.SMTP_SERVER ?? 'smtp.naver.com',
    port: Number(process.env.SMTP_PORT ?? '465'),
    secure: true,
    auth: {
      user: authUser,
      pass: process.env.SMTP_PASS ?? 'X1GVQ226NZ7H',
    },
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, content } = req.body ?? {};

  if (!subject || !content) {
    return res.status(400).json({ error: 'Missing subject or content' });
  }

  const transporter = getTransporter();
  const user = process.env.SMTP_USER ?? 'auraji05';
  const authUser = user.includes('@') ? user : `${user}@naver.com`;

  try {
    await transporter.sendMail({
      from: authUser,
      to: process.env.SMTP_TO_EMAIL ?? 'auraji05@naver.com',
      subject,
      text: content,
    });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('send-email error', error);
    return res
      .status(500)
      .json({ success: false, error: error?.message ?? 'Unable to send email' });
  }
}
