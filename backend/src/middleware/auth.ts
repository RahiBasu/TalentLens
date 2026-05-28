import * as dotenv from 'dotenv';
dotenv.config();

import { requireAuth } from '@clerk/express';

export const protect = requireAuth({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
});