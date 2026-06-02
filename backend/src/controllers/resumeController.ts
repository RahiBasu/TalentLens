import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { parseWithAI } from '../lib/gemini';

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

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let resumeText = '';

    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch (pdfError) {
      console.error('PDF parse error:', pdfError);
      res.status(400).json({ error: 'Failed to parse PDF' });
      return;
    }

    const prompt = `
Extract structured information from this resume and return ONLY a valid JSON object.
No markdown, no backticks, no explanation, no extra text. Just raw JSON.

Return this exact structure:

{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "year": ""
    }
  ],
  "summary": ""
}

Rules:
- location should be the candidate's current city/state/country.
- Examples:
  - "Kolkata, India"
  - "Bangalore, India"
  - "Mumbai, India"
  - "New York, USA"
- If location cannot be determined, return an empty string.
- skills must be an array of strings.
- summary should be a concise professional summary.

Resume:

${resumeText}
`;

    const parsedText = await parseWithAI(prompt);

    const cleaned = parsedText
      .replace(/```json|```/g, '')
      .trim();

    const parsedData = JSON.parse(cleaned);

    // fallback location detection
    if (!parsedData.location) {
      const text = resumeText.toLowerCase();

      if (text.includes('kolkata')) {
        parsedData.location = 'Kolkata, India';
      } else if (text.includes('bangalore') || text.includes('bengaluru')) {
        parsedData.location = 'Bangalore, India';
      } else if (text.includes('mumbai')) {
        parsedData.location = 'Mumbai, India';
      } else if (text.includes('delhi')) {
        parsedData.location = 'Delhi, India';
      } else if (text.includes('hyderabad')) {
        parsedData.location = 'Hyderabad, India';
      } else if (text.includes('chennai')) {
        parsedData.location = 'Chennai, India';
      } else if (text.includes('pune')) {
        parsedData.location = 'Pune, India';
      }
    }

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

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

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