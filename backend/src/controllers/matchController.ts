import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { parseWithAI } from '../lib/gemini';

export const matchResumeToJob = async (req: Request, res: Response) => {
  try {
    const { resumeId, jobId, clerkId } = req.body;

    if (!resumeId || !jobId || !clerkId) {
      res.status(400).json({ error: 'resumeId, jobId and clerkId are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const prompt = `
      Compare this resume with the job description and return ONLY a valid JSON object.
      No markdown, no backticks, no explanation, no extra text. Just raw JSON.

      Return this exact structure:
      {
        "matchScore": 0,
        "matchedSkills": [],
        "missingSkills": [],
        "strengths": [],
        "gaps": [],
        "recommendation": ""
      }

      matchScore should be a number between 0 and 100.

      Resume:
      ${resume.content}

      Job Description:
      ${job.description}
    `;

    const parsedText = await parseWithAI(prompt);
    const cleaned = parsedText.replace(/```json|```/g, '').trim();
    const matchData = JSON.parse(cleaned);

    // Save application with match score
    const existing = await prisma.application.findFirst({
  where: {
    userId: user.id,
    jobId,
    resumeId,
  },
});

const application = existing
  ? await prisma.application.update({
      where: { id: existing.id },
      data: { matchScore: matchData.matchScore },
    })
  : await prisma.application.create({
      data: {
        userId: user.id,
        jobId,
        resumeId,
        matchScore: matchData.matchScore,
        status: 'SAVED',
      },
    });

    res.status(200).json({ matchData, application });
  } catch (error) {
    console.error('matchResumeToJob error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};