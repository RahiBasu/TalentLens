import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyDZwmruNaJO22Cb-x1I_JGx0yLKN_gn1Yk");

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const parseWithGemini = async (prompt: string): Promise<string> => {
  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
};