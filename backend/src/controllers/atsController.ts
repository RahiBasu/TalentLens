import { Request, Response } from 'express';
import { parseWithAI } from '../lib/gemini';

export const atsCheck = async (req: Request, res: Response) => {
  try {
    const { resumeText, jobText } = req.body;

    if (!resumeText || !jobText) {
      res.status(400).json({ error: 'resumeText and jobText are required' });
      return;
    }

    const prompt = `
      You are an ATS (Applicant Tracking System) expert. Analyse this resume against the job description.
      Return ONLY a valid JSON object. No markdown, no backticks, no explanation. Just raw JSON.

      Return this exact structure:
      {
        "atsScore": 0,
        "summary": "",
        "keywordMatches": [],
        "missingKeywords": [],
        "suggestions": [
          {
            "section": "",
            "issue": "",
            "suggestion": ""
          }
        ],
        "tailoredBullets": [
          {
            "original": "",
            "improved": ""
          }
        ]
      }

      atsScore: number 0-100 representing ATS compatibility.
      summary: 2-3 sentence overall assessment.
      keywordMatches: keywords from JD found in resume.
      missingKeywords: important keywords from JD missing in resume.
      suggestions: specific line-by-line improvement suggestions (max 5).
      tailoredBullets: take 3 bullet points from the resume and rewrite them to better match the JD.

      Resume:
      ${resumeText}

      Job Description:
      ${jobText}
    `;

    const parsedText = await parseWithAI(prompt);
    const cleaned = parsedText.replace(/```json|```/g, '').trim();
    const atsData = JSON.parse(cleaned);

    res.status(200).json({ atsData });
  } catch (error) {
    console.error('atsCheck error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};