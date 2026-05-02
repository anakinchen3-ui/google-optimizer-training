export const runtime = 'edge';

import { kv } from '@vercel/kv';
import type { FAQItem } from '../list/route';

const KV_KEY = 'faq:items';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answererId, answererName, role, faqId, answer } = body;

    if (!answererId || !answererName || !faqId || !answer || typeof answer !== 'string') {
      return Response.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (role !== 'mentor' && role !== 'admin') {
      return Response.json(
        { ok: false, error: 'Only mentors or admins can answer' },
        { status: 403 }
      );
    }

    const trimmedAnswer = answer.trim();
    if (trimmedAnswer.length === 0) {
      return Response.json(
        { ok: false, error: 'Answer cannot be empty' },
        { status: 400 }
      );
    }

    const items: FAQItem[] = (await kv.get(KV_KEY)) || [];
    const index = items.findIndex((item) => item.id === faqId);

    if (index === -1) {
      return Response.json(
        { ok: false, error: 'FAQ item not found' },
        { status: 404 }
      );
    }

    items[index] = {
      ...items[index],
      answer: trimmedAnswer,
      answeredBy: answererName,
      answeredAt: new Date().toISOString(),
    };

    await kv.set(KV_KEY, items);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
