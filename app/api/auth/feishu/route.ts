export const runtime = 'edge';

import { kv } from '@vercel/kv';

const APP_ID = 'cli_a954b3694f381cb0';
const APP_SECRET = 'u9yUFAb1iMdQqQ6IugXv8fmrp2ERz8m7';

// Hardcoded fallback role mapping (user_id -> role)
const FALLBACK_ROLE_MAP: Record<string, 'admin' | 'mentor' | 'student'> = {
  'ou_22dcf59d9895159de15367a680387aed': 'admin',
  'defe83g4': 'admin',
};

const KV_KEY = 'user:roles';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return Response.json(
        { ok: false, error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    // Step 1: Get app_access_token
    const appTokenRes = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: APP_ID,
          app_secret: APP_SECRET,
        }),
      }
    );

    const appTokenData = await appTokenRes.json();
    if (appTokenData.code !== 0) {
      return Response.json(
        { ok: false, error: 'Failed to get app access token', detail: appTokenData },
        { status: 500 }
      );
    }

    const appAccessToken = appTokenData.app_access_token;

    // Step 2: Exchange code for user access_token
    const accessTokenRes = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appAccessToken}`,
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
        }),
      }
    );

    const accessTokenData = await accessTokenRes.json();
    if (accessTokenData.code !== 0) {
      return Response.json(
        { ok: false, error: 'Failed to exchange code for token', detail: accessTokenData },
        { status: 500 }
      );
    }

    const userAccessToken = accessTokenData.data.access_token;

    // Step 3: Get user info
    const userInfoRes = await fetch(
      'https://open.feishu.cn/open-apis/authen/v1/user_info',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userAccessToken}`,
        },
      }
    );

    const userInfoData = await userInfoRes.json();
    if (userInfoData.code !== 0) {
      return Response.json(
        { ok: false, error: 'Failed to get user info', detail: userInfoData },
        { status: 500 }
      );
    }

    const user = userInfoData.data;
    const userId = user.user_id || user.open_id;

    const kvRoles: Record<string, 'admin' | 'mentor' | 'student'> = (await kv.get(KV_KEY)) || {};
    const role = kvRoles[userId] ?? FALLBACK_ROLE_MAP[userId] ?? 'student';

    return Response.json({
      ok: true,
      data: {
        user_id: userId,
        open_id: user.open_id,
        union_id: user.union_id,
        name: user.name,
        avatar: user.avatar_url || user.avatar_thumb,
        role,
        access_token: userAccessToken,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
