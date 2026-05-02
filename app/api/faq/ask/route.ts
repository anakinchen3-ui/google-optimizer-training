export const runtime = 'edge';

import { kv } from '@vercel/kv';
import type { FAQItem } from '../list/route';

const KV_KEY = 'faq:items';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, category, question } = body;

    if (!userId || !userName || !question || typeof question !== 'string') {
      return Response.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length === 0) {
      return Response.json(
        { ok: false, error: 'Question cannot be empty' },
        { status: 400 }
      );
    }

    const items: FAQItem[] = (await kv.get(KV_KEY)) || [];

    items.push({
      id: crypto.randomUUID(),
      category: category || '其他',
      question: trimmedQuestion,
      answer: '',
      askedBy: userId,
      askedByName: userName,
      createdAt: new Date().toISOString(),
    });

    await kv.set(KV_KEY, items);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
