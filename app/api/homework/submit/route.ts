export const runtime = 'edge';

import { kv } from '@vercel/kv';

const KV_KEY = 'homework:submissions';

export interface HomeworkSubmission {
  id: string;
  userId: string;
  userName: string;
  homeworkId: string;
  content: string;
  createdAt: string;
  score?: number;
  feedback?: string;
  scoredBy?: string;
  scoredAt?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, homeworkId, content } = body;

    if (!userId || !userName || !homeworkId || !content || typeof content !== 'string') {
      return Response.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return Response.json(
        { ok: false, error: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    const submissions: HomeworkSubmission[] = (await kv.get(KV_KEY)) || [];

    const existingIndex = submissions.findIndex(
      (s) => s.userId === userId && s.homeworkId === homeworkId
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Update existing submission, preserve score info
      submissions[existingIndex] = {
        ...submissions[existingIndex],
        content: content.trim(),
        createdAt: now,
      };
    } else {
      submissions.push({
        id: crypto.randomUUID(),
        userId,
        userName,
        homeworkId,
        content: content.trim(),
        createdAt: now,
      });
    }

    await kv.set(KV_KEY, submissions);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
