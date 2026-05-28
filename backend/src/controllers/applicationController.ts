import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getApplications = async (req: Request, res: Response) => {
  try {
    const clerkId = req.params.clerkId as string;

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: { job: true, resume: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ applications });
  } catch (error) {
    console.error('getApplications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, notes } = req.body;

    const application = await prisma.application.update({
      where: { id },
      data: { status, notes },
    });

    res.status(200).json({ application });
  } catch (error) {
    console.error('updateApplicationStatus error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.application.delete({ where: { id } });

    res.status(200).json({ message: 'Application deleted' });
  } catch (error) {
    console.error('deleteApplication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};