import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { parseWithAI } from '../lib/gemini';

export const matchResumeToJob = async (req: Request, res: Response) => {
  try {
    const { resumeId, jobId, clerkId, resumeText, jobText } = req.body;

    // Support both modes: text mode and ID mode
    const isTextMode = resumeText && jobText;
    const isIdMode = resumeId && jobId && clerkId;

    if (!isTextMode && !isIdMode) {
      res.status(400).json({ error: 'Provide either (resumeText + jobText) or (resumeId + jobId + clerkId)' });
      return;
    }

    let finalResumeContent = resumeText;
    let finalJobDescription = jobText;

    // ID mode — fetch from DB
    if (isIdMode && !isTextMode) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) { res.status(404).json({ error: 'User not found' }); return; }

      const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (!resume) { res.status(404).json({ error: 'Resume not found' }); return; }

      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) { res.status(404).json({ error: 'Job not found' }); return; }

      finalResumeContent = resume.content;
      finalJobDescription = job.description;
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
      ${finalResumeContent}

      Job Description:
      ${finalJobDescription}
    `;

    const parsedText = await parseWithAI(prompt);
    const cleaned = parsedText.replace(/```json|```/g, '').trim();
    const matchData = JSON.parse(cleaned);

    // Save to DB only in ID mode
    if (isIdMode && clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user) {
        const existing = await prisma.application.findFirst({
          where: { userId: user.id, jobId, resumeId },
        });

        if (existing) {
          await prisma.application.update({
            where: { id: existing.id },
            data: { matchScore: matchData.matchScore },
          });
        } else {
          await prisma.application.create({
            data: {
              userId: user.id,
              jobId,
              resumeId,
              matchScore: matchData.matchScore,
              status: 'SAVED',
            },
          });
        }
      }
    }

    res.status(200).json({ matchData });
  } catch (error) {
    console.error('matchResumeToJob error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};