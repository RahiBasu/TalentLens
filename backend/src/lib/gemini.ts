export async function parseWithAI(prompt: string): Promise<string> {
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    })
  });

  const data = await response.json() as any;

  if (!response.ok) {
    throw new Error(`Groq error: ${data.error?.message || 'Unknown error'}`);
  }

  return data.choices[0].message.content;
}