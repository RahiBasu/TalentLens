import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email) {
      res.status(400).json({ error: 'clerkId and email are required' });
      return;
    }

    const user = await prisma.user.upsert({
      where: { clerkId: clerkId as string },
      update: { email, name },
      create: { clerkId, email, name },
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error('syncUser error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const clerkId = req.params.clerkId as string;

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('getUser error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};