export const runtime = 'edge';

import { kv } from '@vercel/kv';
import type { HomeworkSubmission } from '../submit/route';

const KV_KEY = 'homework:submissions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const homeworkId = searchParams.get('homeworkId');

    const submissions: HomeworkSubmission[] = (await kv.get(KV_KEY)) || [];

    let result = submissions;

    if (userId) {
      result = result.filter((s) => s.userId === userId);
    }

    if (homeworkId) {
      result = result.filter((s) => s.homeworkId === homeworkId);
    }

    // Sort by createdAt desc
    result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return Response.json({ ok: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
