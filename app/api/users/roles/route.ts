export const runtime = 'edge';

import { kv } from '@vercel/kv';

const KV_KEY = 'user:roles';
const PROFILE_KEY = 'user:profiles';

const FALLBACK_ROLE_MAP: Record<string, 'admin' | 'mentor' | 'student'> = {
  'ou_22dcf59d9895159de15367a680387aed': 'admin',
  'defe83g4': 'admin',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requesterRole = searchParams.get('requesterRole');

    if (requesterRole !== 'admin') {
      return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    const roles: Record<string, 'admin' | 'mentor' | 'student'> = (await kv.get(KV_KEY)) || {};
    const profiles: Record<string, string> = (await kv.get(PROFILE_KEY)) || {};

    // Build effective roles for all known profiles
    const effectiveRoles: Record<string, 'admin' | 'mentor' | 'student' | 'pending'> = {};
    Object.keys(profiles).forEach((uid) => {
      effectiveRoles[uid] = roles[uid] ?? FALLBACK_ROLE_MAP[uid] ?? 'pending';
    });

    // Also include KV roles that might not have profiles yet
    Object.keys(roles).forEach((uid) => {
      if (!effectiveRoles[uid]) {
        effectiveRoles[uid] = roles[uid];
      }
    });

    return Response.json({ ok: true, data: { roles: effectiveRoles, profiles } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requesterRole, userId, role } = body;

    if (requesterRole !== 'admin') {
      return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    if (!userId || !role || !['admin', 'mentor', 'student'].includes(role)) {
      return Response.json({ ok: false, error: 'Missing or invalid fields' }, { status: 400 });
    }

    const roles: Record<string, 'admin' | 'mentor' | 'student'> = (await kv.get(KV_KEY)) || {};
    roles[userId] = role;
    await kv.set(KV_KEY, roles);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { requesterRole, userId } = body;

    if (requesterRole !== 'admin') {
      return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    if (!userId) {
      return Response.json({ ok: false, error: 'Missing userId' }, { status: 400 });
    }

    const roles: Record<string, 'admin' | 'mentor' | 'student'> = (await kv.get(KV_KEY)) || {};
    delete roles[userId];
    await kv.set(KV_KEY, roles);

    return Response.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
