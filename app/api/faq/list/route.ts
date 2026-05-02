export const runtime = 'edge';

import { kv } from '@vercel/kv';

const KV_KEY = 'faq:items';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  askedBy?: string;
  askedByName?: string;
  createdAt: string;
  answeredBy?: string;
  answeredAt?: string;
  isPreset?: boolean;
}

const presetFAQs: FAQItem[] = [
  {
    id: 'preset-1',
    category: '日常使用',
    question: '如何完成课程学习？',
    answer: '点击左侧课程目录中的章节即可在右侧查看飞书文档。阅读完成后，点击右上角「标记为已完成」按钮记录学习进度。',
    createdAt: '2025-01-01T00:00:00Z',
    isPreset: true,
  },
  {
    id: 'preset-2',
    category: '日常使用',
    question: '为什么有些资料打不开？',
    answer: '部分文件夹类型资料需要在飞书中打开。点击「在飞书中打开」按钮，使用已登录的飞书账号访问即可。',
    createdAt: '2025-01-01T00:00:00Z',
    isPreset: true,
  },
  {
    id: 'preset-3',
    category: '日常使用',
    question: '我的学习进度会保存吗？',
    answer: '会。学习进度自动保存在浏览器本地，下次用同一设备登录时会自动恢复。',
    createdAt: '2025-01-01T00:00:00Z',
    isPreset: true,
  },
  {
    id: 'preset-4',
    category: '日常使用',
    question: '如何参加考试和考核？',
    answer: '学员可切换到顶部「考试」板块参加考试；考核入口仅对导师和管理员可见。',
    createdAt: '2025-01-01T00:00:00Z',
    isPreset: true,
  },
  {
    id: 'preset-5',
    category: '日常使用',
    question: '登录时提示「没有权限」怎么办？',
    answer: '请联系管理员确认你的飞书账号已被添加到系统中。新员工的权限需要管理员手动开通。',
    createdAt: '2025-01-01T00:00:00Z',
    isPreset: true,
  },
  {
    id: 'preset-6',
    category: '日常使用',
    question: '学习心得可以修改或删除吗？',
    answer: '目前支持删除后重新填写。后续版本将支持编辑功能。',
    createdAt: '2025-01-01T00:00:00Z',
    isPreset: true,
  },
  {
    id: 'preset-search-1',
    category: '搜索广告',
    question: '收费模式与出价策略如何区分？',
    answer: '收费模式指的是Google广告的计费方式，是广告主如何为广告的表现付费（按点击或展示），主要收费模式有两种：\n\n- CPC（Cost Per Click，按点击付费）：广告主每当有人点击广告时才付费，适合希望优化网站流量和转化的广告主。\n- CPM（Cost Per Mille，按千次展示付费）：广告主每千次广告展示付费。适合品牌宣传和曝光优化的场景。\n\n出价策略是广告主如何在竞价过程中设定出价以实现特定目标，Google Ads提供了多种出价策略，主要分为自动出价和手动出价两类：\n\n- 目标CPC（Target CPA）：系统自动调整出价以优化每次获取消费者的成本。\n- 目标ROAS（Target Return on Ad Spend）：系统根据目标收益点自动优化出价。',
    createdAt: '2025-01-01T00:00:00Z',
    isPreset: true,
  },
];

export async function GET() {
  try {
    const dynamicItems: FAQItem[] = (await kv.get(KV_KEY)) || [];
    const allItems = [...presetFAQs, ...dynamicItems];
    // Sort by createdAt desc
    allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return Response.json({ ok: true, data: allItems });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
