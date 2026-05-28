import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { parseWithGemini } from '../lib/gemini';

const pdfParse = require('pdf-parse');

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

export const parseResume = async (req: FileRequest, res: Response) => {
  try {
    const { clerkId } = req.body;

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    if (!clerkId) {
      res.status(400).json({ error: 'clerkId is required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const prompt = `
      Extract structured information from this resume and return ONLY a valid JSON object.
      No markdown, no backticks, no explanation, no extra text. Just raw JSON.
      
      Return this exact structure:
      {
        "name": "",
        "email": "",
        "phone": "",
        "skills": [],
        "experience": [{ "company": "", "role": "", "duration": "", "description": "" }],
        "education": [{ "institution": "", "degree": "", "year": "" }],
        "summary": ""
      }
      
      Resume:
      ${resumeText}
    `;

    const parsedText = await parseWithGemini(prompt);
    const cleaned = parsedText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleaned);

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        content: resumeText,
        parsedData,
      },
    });

    res.status(201).json({ resume });
  } catch (error) {
    console.error('parseResume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getResumes = async (req: FileRequest, res: Response) => {
  try {
    const clerkId = req.params.clerkId as string;

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ resumes });
  } catch (error) {
    console.error('getResumes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};