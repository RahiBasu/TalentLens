import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { parseWithAI } from '../lib/gemini';

export const parseJob = async (req: Request, res: Response) => {
  try {
    const { description, title, company, url, source } = req.body;

    if (!description) {
      res.status(400).json({ error: 'Job description is required' });
      return;
    }

    const prompt = `
      Extract structured information from this job description and return ONLY a valid JSON object.
      No markdown, no backticks, no explanation, no extra text. Just raw JSON.

      Return this exact structure:
      {
        "requiredSkills": [],
        "preferredSkills": [],
        "experience": "",
        "education": "",
        "responsibilities": [],
        "benefits": [],
        "jobType": "",
        "location": "",
        "salary": ""
      }

      Job Description:
      ${description}
    `;

    const parsedText = await parseWithAI(prompt);
    const cleaned = parsedText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleaned);

    const job = await prisma.job.create({
      data: {
        title: title || 'Untitled',
        company: company || 'Unknown',
        description,
        parsedData,
        url,
        source,
      },
    });

    res.status(201).json({ job });
  } catch (error) {
    console.error('parseJob error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error('getJobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    res.status(200).json({ job });
  } catch (error) {
    console.error('getJobById error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};