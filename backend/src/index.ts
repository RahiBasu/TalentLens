import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import resumeRoutes from './routes/resumeRoutes';
import jobRoutes from './routes/jobRoutes';
import matchRoutes from './routes/matchRoutes';
import applicationRoutes from './routes/applicationRoutes';
import { createApplication } from './controllers/applicationController';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://talent-lens-epx6.vercel.app',
    'https://talentlens.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'TalentLens API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/match', matchRoutes);

app.use('/api/applications', applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.stdin.resume();

export default app;