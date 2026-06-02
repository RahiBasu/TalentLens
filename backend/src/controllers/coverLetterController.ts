import { Request, Response } from 'express';
import { parseWithAI } from '../lib/gemini';

export const coverLetter = async (req: Request, res: Response) => {
  try {
    const { resumeText, jobText, tone } = req.body;

    if (!resumeText || !jobText) {
      res.status(400).json({ error: 'resumeText and jobText are required' });
      return;
    }

    const prompt = `
      You are an expert career coach and professional writer. Write a tailored cover letter based on this resume and job description.
      Return ONLY a valid JSON object. No markdown, no backticks, no explanation. Just raw JSON.

      Return this exact structure:
      {
        "subject": "",
        "coverLetter": "",
        "keyPoints": []
      }

      subject: email subject line for sending this cover letter.
      coverLetter: the full cover letter text, 3-4 paragraphs, professional but human tone. Address it to "Hiring Manager". Sign off with the candidate's name from the resume.
      keyPoints: 3-4 bullet points of what makes this candidate a strong fit.

      Tone: ${tone || 'professional and confident'}

      Resume:
      ${resumeText}

      Job Description:
      ${jobText}
    `;

    const parsedText = await parseWithAI(prompt);
    const cleaned = parsedText.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleaned);

    res.status(200).json({ data });
  } catch (error) {
    console.error('coverLetter error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};