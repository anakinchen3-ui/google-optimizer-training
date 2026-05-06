export const runtime = 'edge';

import { kv } from '@vercel/kv';

const SCHEDULE_KEY = 'sharing:schedule';

export interface SharingSchedule {
  id: string;
  date: string;
  time: string;
  topic: string;
  sharer: string;
  materialName?: string;
  materialUrl?: string;
  createdAt: string;
  createdBy: string;
}

export async function GET() {
  try {
    const items: SharingSchedule[] = (await kv.get(SCHEDULE_KEY)) || [];
    items.sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
    return Response.json({ ok: true, data: items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, time, topic, sharer, materialName, materialUrl, createdBy, role } = body;

    if (role !== 'mentor' && role !== 'admin') {
      return Response.json({ ok: false, error: 'Unauthorized' }, { status: 403 });
    }

    if (!date || !time || !topic || !sharer || !createdBy) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const items: SharingSchedule[] = (await kv.get(SCHEDULE_KEY)) || [];

    items.push({
      id: crypto.randomUUID(),
      date,
      time,
      topic: topic.trim(),
      sharer: sharer.trim(),
      materialName: materialName?.trim() || undefined,
      materialUrl: materialUrl?.trim() || undefined,
      createdAt: new Date().toISOString(),
      createdBy,
    });

    await kv.set(SCHEDULE_KEY, items);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, date, time, topic, sharer, materialName, materialUrl, role } = body;

    if (role !== 'mentor' && role !== 'admin') {
      return Response.json({ ok: false, error: 'Unauthorized' }, { status: 403 });
    }

    if (!id || !date || !time || !topic || !sharer) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const items: SharingSchedule[] = (await kv.get(SCHEDULE_KEY)) || [];
    const index = items.findIndex((i) => i.id === id);

    if (index < 0) {
      return Response.json({ ok: false, error: 'Not found' }, { status: 404 });
    }

    items[index] = {
      ...items[index],
      date,
      time,
      topic: topic.trim(),
      sharer: sharer.trim(),
      materialName: materialName?.trim() || undefined,
      materialUrl: materialUrl?.trim() || undefined,
    };

    await kv.set(SCHEDULE_KEY, items);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
