export const runtime = 'edge';

import { kv } from '@vercel/kv';

const REFLECTION_KEY = 'sharing:reflections';

export interface SharingReflection {
  id: string;
  sharingId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sharingId = url.searchParams.get('sharingId');
    const userId = url.searchParams.get('userId');

    let items: SharingReflection[] = (await kv.get(REFLECTION_KEY)) || [];

    if (sharingId) {
      items = items.filter((i) => i.sharingId === sharingId);
    }
    if (userId) {
      items = items.filter((i) => i.userId === userId);
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return Response.json({ ok: true, data: items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sharingId, userId, userName, content } = body;

    if (!sharingId || !userId || !userName || !content || typeof content !== 'string') {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (content.trim().length === 0) {
      return Response.json({ ok: false, error: 'Content cannot be empty' }, { status: 400 });
    }

    const items: SharingReflection[] = (await kv.get(REFLECTION_KEY)) || [];

    const existingIndex = items.findIndex((i) => i.sharingId === sharingId && i.userId === userId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        content: content.trim(),
        createdAt: now,
      };
    } else {
      items.push({
        id: crypto.randomUUID(),
        sharingId,
        userId,
        userName,
        content: content.trim(),
        createdAt: now,
      });
    }

    await kv.set(REFLECTION_KEY, items);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
