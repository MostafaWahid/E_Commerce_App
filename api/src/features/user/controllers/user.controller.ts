import {getAuth} from '@clerk/express'
import { db } from '../../../db/index';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const getUserProfile=async (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);
    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await db.select().from(users).where(eq(users.clerkUserId,userId))

    res.json({ user });
  } catch (e) {
    next(e);
  }
}