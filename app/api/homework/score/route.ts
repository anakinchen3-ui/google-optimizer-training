export const runtime = 'edge';

import { kv } from '@vercel/kv';
import type { HomeworkSubmission } from '../submit/route';

const KV_KEY = 'homework:submissions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scorerId, scorerName, role, submissionId, score, feedback } = body;

    if (!scorerId || !scorerName || !submissionId || score === undefined || score === null) {
      return Response.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (role !== 'mentor' && role !== 'admin') {
      return Response.json(
        { ok: false, error: 'Only mentors or admins can score' },
        { status: 403 }
      );
    }

    const numScore = Number(score);
    if (Number.isNaN(numScore) || numScore < 0 || numScore > 100) {
      return Response.json(
        { ok: false, error: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }

    const submissions: HomeworkSubmission[] = (await kv.get(KV_KEY)) || [];
    const index = submissions.findIndex((s) => s.id === submissionId);

    if (index === -1) {
      return Response.json(
        { ok: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    submissions[index] = {
      ...submissions[index],
      score: numScore,
      feedback: typeof feedback === 'string' ? feedback.trim() : undefined,
      scoredBy: scorerName,
      scoredAt: new Date().toISOString(),
    };

    await kv.set(KV_KEY, submissions);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
