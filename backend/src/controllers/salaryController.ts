import { Request, Response } from 'express';
import { parseWithAI } from '../lib/gemini';

export const salaryEstimator = async (req: Request, res: Response) => {
  try {
    const { jobText } = req.body;

    if (!jobText) {
      res.status(400).json({ error: 'jobText is required' });
      return;
    }

    const prompt = `
  You are a compensation and salary expert with deep knowledge of global job markets.
  Analyse this job description and estimate the salary range.
  Return ONLY a valid JSON object. No markdown, no backticks, no explanation. Just raw JSON.

  STEP 1 — Detect location from the JD:
  Look for clues like office city, company HQ, currency mentioned, timezone, visa requirements, or phrases like "based in", "located in", "our office in".
  If multiple locations mentioned, pick the primary hiring location.
  If genuinely unclear, default to India.

  STEP 2 — Set salary based on detected location:
  - India: salaries in INR (interns: 15K-40K/month, junior: 40K-80K/month, senior: 1.5L-4L/month)
  - USA: salaries in USD (interns: $3000-6000/month, junior: $80K-120K/year, senior: $150K-250K/year)
  - UK: salaries in GBP (junior: £30K-50K/year, senior: £70K-120K/year)
  - Singapore: salaries in SGD (junior: SGD 3K-5K/month, senior: SGD 8K-15K/month)
  - Remote: use USD as base
  - Other countries: use appropriate local currency and market rates

  Return this exact structure:
  {
    "role": "",
    "level": "",
    "location": "",
    "currency": "",
    "currencySymbol": "",
    "salaryMin": 0,
    "salaryMax": 0,
    "salaryMedian": 0,
    "period": "",
    "factors": [],
    "marketInsights": "",
    "negotiationTips": []
  }

  role: job title extracted from JD.
  level: Junior / Mid / Senior / Lead / Manager / Intern.
  location: the location you detected from the JD (city or country, be specific).
  currency: INR, USD, GBP, SGD, or appropriate local currency.
  currencySymbol: ₹, $, £, S$, or appropriate symbol.
  salaryMin, salaryMax, salaryMedian: realistic numbers for the detected location.
  period: "per month" for India/Singapore, "per year" for USA/UK/Remote.
  factors: list of 4-6 factors affecting this salary.
  marketInsights: 2-3 sentences about the job market for this role in the detected location.
  negotiationTips: 3 specific tips for negotiating this salary in this market.

  Job Description:
  ${jobText}
`;

    const parsedText = await parseWithAI(prompt);
    const cleaned = parsedText.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleaned);

    res.status(200).json({ data });
  } catch (error) {
    console.error('salaryEstimator error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};