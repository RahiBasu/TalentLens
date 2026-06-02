import { Request, Response } from 'express';
import { parseWithAI } from '../lib/gemini';

export const interviewPrep = async (req: Request, res: Response) => {
  try {
    const { resumeText, jobText } = req.body;

    if (!resumeText || !jobText) {
      res.status(400).json({ error: 'resumeText and jobText are required' });
      return;
    }

    const prompt = `
      You are an expert interview coach. Generate tailored interview questions based on this resume and job description.
      Return ONLY a valid JSON object. No markdown, no backticks, no explanation. Just raw JSON.

      Return this exact structure:
      {
        "overview": "",
        "questions": [
          {
            "question": "",
            "type": "",
            "answer": "",
            "tip": ""
          }
        ]
      }

      overview: 2 sentence summary of what to focus on.
      questions: exactly 8 questions total — mix of technical, behavioural, and culture fit.
      type: one of "Technical", "Behavioural", "Culture Fit".
      answer: a suggested answer framework using the candidate's background.
      tip: what the interviewer is really looking for with this question.

      Resume:
      ${resumeText}

      Job Description:
      ${jobText}
    `;

    const parsedText = await parseWithAI(prompt);
    const cleaned = parsedText.replace(/```json|```/g, '').trim();
    const interviewData = JSON.parse(cleaned);

    res.status(200).json({ interviewData });
  } catch (error) {
    console.error('interviewPrep error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};