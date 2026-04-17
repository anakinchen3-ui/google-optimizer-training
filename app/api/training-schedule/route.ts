export const runtime = 'edge';

import { kv } from '@vercel/kv';
import { initialTrainingSchedule, type TrainingScheduleItem } from './data';

const KV_KEY = 'training:schedule';

export async function GET() {
  try {
    const data: TrainingScheduleItem[] | null = await kv.get(KV_KEY);
    return Response.json({ ok: true, data: data || initialTrainingSchedule });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message, data: initialTrainingSchedule }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requesterRole, schedule } = body;

    if (requesterRole !== 'admin') {
      return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    if (!Array.isArray(schedule)) {
      return Response.json({ ok: false, error: 'Invalid schedule data' }, { status: 400 });
    }

    await kv.set(KV_KEY, schedule);
    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
