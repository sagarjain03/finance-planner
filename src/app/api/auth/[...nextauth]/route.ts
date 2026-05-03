/**
 * NextAuth Route Handler
 * Handles authentication endpoints: /api/auth/signin, /api/auth/callback, etc.
 */

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
