import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Mistral } from '@mistralai/mistralai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || ''
});

app.post('/api/equations', async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, subtopic } = req.body;
    
    if (!process.env.MISTRAL_API_KEY) {
      res.status(500).json({ error: 'MISTRAL_API_KEY is missing in backend/.env' });
      return;
    }

    const prompt = `You are a Physics expert. Provide 3 key interactive physics equations for the topic '${topic}' and subtopic '${subtopic}' suitable for classes 9 to 12. 
Format as a JSON object containing an "equations" array. Each object in the array should have:
- "id": a unique string ID
- "title": Title of the equation
- "description": A brief description
- "latexFormula": The formula in LaTeX (e.g. "F = m \\cdot a")
- "variables": An array of variable names used (e.g. ["m", "a"])
- "evaluatorTemplate": A string representing a JavaScript math expression that evaluates the result, using variable names matching the 'variables' array (e.g. "m * a").
Output ONLY the JSON object without any markdown formatting.`;

    const response = await mistral.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
      responseFormat: { type: 'json_object' }
    });

    const content = response.choices?.[0]?.message?.content as string;
    let equations = [];
    if (content) {
      const parsed = JSON.parse(content);
      equations = Array.isArray(parsed) ? parsed : (parsed.equations || []);
    }
    
    res.status(200).json({ equations });
  } catch (error) {
    console.error('Mistral API error:', error);
    res.status(500).json({ error: 'Failed to fetch equations' });
  }
});

// Basic Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Graviton Physics API Server',
    timestamp: new Date().toISOString(),
    mode: 'open-access'
  });
});

// Sample Simulations Metadata Route
app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({
    platform: 'Graviton Physics Workspace',
    targetBoards: ['CBSE', 'ICSE', 'ISC', 'WBCHSE'],
    classes: [7, 8, 9, 10, 11, 12],
    features: ['60-FPS-Vector-Engine', 'KaTeX-Substitution', 'No-Auth-Open-Access']
  });
});

app.listen(PORT, () => {
  console.log(`[Graviton Backend] Server running on http://localhost:${PORT}`);
});
