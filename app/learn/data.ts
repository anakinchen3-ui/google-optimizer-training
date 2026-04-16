export type LessonType = 'docx' | 'sheet' | 'slides' | 'folder';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  url: string;
  isHomework?: boolean;
  children?: Lesson[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const courseData: Section[] = [
  {
    id: 'foundation',
    title: '基础认知阶段',
    lessons: [
      {
        id: 'foundation-1',
        title: '一、了解数字营销与品牌独立站',
        type: 'docx',
        url: 'https://pwl28kvg7c4.feishu.cn/docx/EXMUdQtUwodccQxDqjWcb8FXnJf',
      },
      {
        id: 'foundation-2',
        title: '二、了解 Google',
        type: 'docx',
        url: 'https://pwl28kvg7c4.feishu.cn/docx/HkYsdzISFo43YLxSansc8x6onec',
      },
      {
        id: 'foundation-3',
        title: '三、了解 Google Ads',
        type: 'docx',
        url: 'https://pwl28kvg7c4.feishu.cn/docx/Oi9Bd0r31o5XnVxq3sWce62Xn5e',
      },
      {
        id: 'foundation-4',
        title: 'Google Ads 基本知识框架',
        type: 'docx',
        url: 'https://pwl28kvg7c4.feishu.cn/docx/SXAtdy4EEoZaLvxWxYDcyqPYnLf',
      },
    ],
  },
  {
    id: 'phase1',
    title: '第一阶段 · 核心广告类型（第 1 个月）',
    lessons: [
      {
        id: 'phase1-search',
        title: '搜索广告及应用',
        type: 'folder',
        url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/SryOfJCvBllFv5d0qaecZvEzn9f',
        children: [
          {
            id: 'search-1',
            title: '搜索广告的原理',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/Y1bCdqpyvog41Vx6wzQcB9WynBe',
          },
          {
            id: 'search-2',
            title: '搜索广告的组成',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/KssbdawFJoiwg1xAM8ccd5LYnIf',
          },
          {
            id: 'search-hw1',
            title: '作业：搜索广告方案',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/KssbdawFJoiwg1xAM8ccd5LYnIf',
            isHomework: true,
          },
          {
            id: 'search-3',
            title: '搜索广告的出价策略',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/ZU56dxGKMoXj6zx8w27ctnYunoe',
          },
          {
            id: 'search-hw2',
            title: '作业：搜索广告出价策略',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/ZU56dxGKMoXj6zx8w27ctnYunoe',
            isHomework: true,
          },
          {
            id: 'search-4',
            title: '搜索广告的创建',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/MesQdYhpmo0CDRxZzJycbfJKnNh',
          },
          {
            id: 'search-hw3',
            title: '作业：创建搜索广告',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/MesQdYhpmo0CDRxZzJycbfJKnNh',
            isHomework: true,
          },
          {
            id: 'search-5',
            title: '搜索广告数据分析与优化',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/W9VsdYuRaoPbj9xDlrZcZUJcnoe',
          },
          {
            id: 'search-hw4',
            title: '作业：搜索广告优化',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/W9VsdYuRaoPbj9xDlrZcZUJcnoe',
            isHomework: true,
          },
        ],
      },
      {
        id: 'phase1-shopping',
        title: '购物广告及应用',
        type: 'folder',
        url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/XDekfFFnalC7ZTdpNAuc4Uprngc',
        children: [
          {
            id: 'shopping-1',
            title: '购物广告的原理及展示组成',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/UtIOdunHvoVTD8xJ33jc71eHnGg',
          },
          {
            id: 'shopping-2',
            title: '购物广告的重要基站-GMC',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/Udz1dPpMsoe9BvxjRfCcCCCVnXc',
          },
          {
            id: 'shopping-3',
            title: '如何创建 GMC 账户/Feed/促销信息/自定义标签',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/E5PWdL0MMoRXKXxP44ZcKRYrnGn',
          },
          {
            id: 'shopping-hw1',
            title: '作业：购物广告 feed 制作',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/E5PWdL0MMoRXKXxP44ZcKRYrnGn',
            isHomework: true,
          },
          {
            id: 'shopping-4',
            title: '购物广告的数据分析与优化',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/WrJKdgd7do4rBHx896ac9t7vn1J',
          },
          {
            id: 'shopping-hw2',
            title: '作业：购物广告优化',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/WrJKdgd7do4rBHx896ac9t7vn1J',
            isHomework: true,
          },
        ],
      },
      {
        id: 'phase1-pmax',
        title: 'Pmax 广告及应用',
        type: 'folder',
        url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/XWxXfOCE3l5mTrd6g09cIFnpntf',
        children: [
          {
            id: 'pmax-1',
            title: 'Pmax 广告的原理',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/VEPvdgoMio5Wk3x4HlwcQdxynN9',
          },
          {
            id: 'pmax-2',
            title: 'Pmax 广告的组成与创建',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/GssEdBSP0o9wdAxvXWfcb6B6nYg',
          },
          {
            id: 'pmax-3',
            title: 'Pmax 广告的核心指标与优化',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/Hbk8dzGXmoSidBxiBV5cVBaMnOc',
          },
          {
            id: 'pmax-hw1',
            title: '作业：PLA 与 Pmax 综合测试',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/Hbk8dzGXmoSidBxiBV5cVBaMnOc',
            isHomework: true,
          },
        ],
      },
    ],
  },
  {
    id: 'phase2',
    title: '第二阶段 · 进阶广告类型（第 2 个月）',
    lessons: [
      {
        id: 'phase2-demand',
        title: 'Demand Gen 广告及应用',
        type: 'folder',
        url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/QG45fS6UZl4sDFdrXQZc0ZJAnTf',
        children: [
          {
            id: 'demand-1',
            title: 'Demand Gen 的原理',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/MGQDdIqnNojD1WxdGLCciixfnsg',
          },
          {
            id: 'demand-2',
            title: 'Demand Gen 的创建',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/P0N9diLCZoVnOsxvX03cRVQwn4g',
          },
          {
            id: 'demand-3',
            title: 'Demand Gen 的数据指标',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/L1eIdZn3Lo7coOxKdDlca3N0nJd',
          },
          {
            id: 'demand-hw1',
            title: '作业：Demand Gen 综合测试',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/L1eIdZn3Lo7coOxKdDlca3N0nJd',
            isHomework: true,
          },
        ],
      },
      {
        id: 'phase2-video',
        title: '视频广告及应用',
        type: 'folder',
        url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/J8gHfiO6xluGDUdDbKEcTPBLnwc',
        children: [
          {
            id: 'video-1',
            title: '视频广告的原理',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/RxKGdrVgyoWfy8xWWhZcM1B6nZe',
          },
          {
            id: 'video-2',
            title: '创建视频广告',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/CnAWdm8JiovvtVxwr96c7y09nKb',
          },
          {
            id: 'video-3',
            title: '视频广告的数据指标',
            type: 'docx',
            url: 'https://pwl28kvg7c4.feishu.cn/docx/D2Gwdxljyo228AxhEOMcdgihnDh',
          },
        ],
      },
    ],
  },
  {
    id: 'extra',
    title: '其他培训资料',
    lessons: [
      {
        id: 'extra-1',
        title: '2025年 Google 优化师培训流程',
        type: 'docx',
        url: 'https://pwl28kvg7c4.feishu.cn/docx/BCtKdvrXjopxinxlqDMczwitnbh',
      },
      {
        id: 'extra-2',
        title: 'google 分享内容安排',
        type: 'sheet',
        url: 'https://pwl28kvg7c4.feishu.cn/sheets/YTGmsSjfYhQyFrtTyWLcy6DRnmb',
      },
      {
        id: 'extra-3',
        title: '2025 网站布局培训',
        type: 'slides',
        url: 'https://pwl28kvg7c4.feishu.cn/slides/CMFosEFuwlsuLed3VsjcfxJ2nue',
      },
      {
        id: 'extra-4',
        title: 'Google 广告账户前期设置与关联',
        type: 'folder',
        url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/TkOPfI8B4lwKUmdDVficI2Eansb',
      },
    ],
  },
  {
    id: 'assessment',
    title: '考核与评估',
    lessons: [
      {
        id: 'assess-1',
        title: '阶段性考核',
        type: 'folder',
        url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/KwIgfZ9BElo56tdSaWhcsrasnHb',
      },
      {
        id: 'assess-2',
        title: '优化师试用期考核表和转正考核表',
        type: 'folder',
        url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/FqrtfExOJlzhVHdNwL1cTNlZnWr',
      },
    ],
  },
];

export interface Homework {
  id: string;
  title: string;
  phase: string;
  description?: string;
}

export const homeworkData: Homework[] = [
  { id: 'search-hw1', title: '搜索广告方案', phase: '搜索广告及应用' },
  { id: 'search-hw2', title: '搜索广告出价策略', phase: '搜索广告及应用' },
  { id: 'search-hw3', title: '创建搜索广告', phase: '搜索广告及应用' },
  { id: 'search-hw4', title: '搜索广告优化', phase: '搜索广告及应用' },
  { id: 'shopping-hw1', title: '购物广告 feed 制作', phase: '购物广告及应用' },
  { id: 'shopping-hw2', title: '购物广告优化', phase: '购物广告及应用' },
  { id: 'pmax-hw1', title: 'PLA 与 Pmax 综合测试', phase: 'Pmax 广告及应用' },
  { id: 'demand-hw1', title: 'Demand Gen 综合测试', phase: 'Demand Gen 广告及应用' },
];

export const flatLessons: Lesson[] = courseData.reduce<Lesson[]>((acc, section) => {
  section.lessons.forEach((lesson) => {
    acc.push(lesson);
    if (lesson.children) {
      acc.push(...lesson.children);
    }
  });
  return acc;
}, []);

export function getLessonById(id: string): Lesson | undefined {
  return flatLessons.find((l) => l.id === id);
}

export function getFirstLesson(): Lesson {
  return courseData[0].lessons[0];
}
