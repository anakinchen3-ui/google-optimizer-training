'use client';

import { useState, useEffect, useCallback } from 'react';
import { courseData, homeworkData, type Lesson, type LessonType, getLessonById, getFirstLesson } from './data';

const STORAGE_KEY = 'google-learn-progress-v1';
const USER_KEY = 'google-learn-user-v1';
const REFLECTION_KEY = 'google-learn-reflections-v1';

const APP_ID = 'cli_a954b3694f381cb0';
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://google-optimizer-training.vercel.app/learn';

export type UserRole = 'admin' | 'mentor' | 'student';

export interface User {
  user_id: string;
  open_id: string;
  union_id: string;
  name: string;
  avatar: string;
  role: UserRole;
  access_token: string;
}

interface HomeworkSubmission {
  id: string;
  userId: string;
  userName: string;
  homeworkId: string;
  content: string;
  createdAt: string;
  score?: number;
  feedback?: string;
  scoredBy?: string;
  scoredAt?: string;
}

type TabKey = 'learn' | 'exam' | 'homework' | 'reflection' | 'faq' | 'users';

function getIconByType(type: LessonType) {
  switch (type) {
    case 'docx':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#3370ff">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" fill="none" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case 'sheet':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#34c759">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" stroke="#fff" strokeWidth="2" />
          <line x1="9" y1="21" x2="9" y2="9" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case 'slides':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#ff6b6b">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          <line x1="3" y1="10" x2="21" y2="10" stroke="#fff" strokeWidth="2" />
        </svg>
      );
    case 'folder':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#f6a700">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
  }
}

function getRoleLabel(role: UserRole) {
  switch (role) {
    case 'admin':
      return '管理员';
    case 'mentor':
      return '导师';
    case 'student':
      return '学员';
  }
}

function getRoleBadgeColor(role: UserRole) {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-700';
    case 'mentor':
      return 'bg-blue-100 text-blue-700';
    case 'student':
      return 'bg-slate-100 text-slate-600';
  }
}

function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    const authUrl = `https://accounts.feishu.cn/open-apis/authen/v1/index?app_id=${APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-6">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="12,6 16,14 8,14" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Google 优化师培训学习系统</h1>
        <p className="text-sm text-slate-500 mb-8">内部员工培训学习平台，请使用飞书扫码登录</p>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              跳转中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3H9V9h2v1c.55-.55 1.45-1 2.5-1 1.38 0 2.5 1.12 2.5 2.5V17z" />
              </svg>
              飞书扫码登录
            </>
          )}
        </button>

        <p className="text-xs text-slate-400 mt-6">若无法登录，请联系管理员开通权限</p>
      </div>
    </div>
  );
}

function ExamPanel() {
  const examLinks = [
    {
      id: 'assess-1',
      title: '阶段性考核',
      desc: '完成阶段性理论知识与实践操作考核，检验学习成果。',
      url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/KwIgfZ9BElo56tdSaWhcsrasnHb',
    },
    {
      id: 'assess-2',
      title: '优化师试用期考核表和转正考核表',
      desc: '试用期及转正考核所需填写和提交的表格与材料。',
      url: 'https://pwl28kvg7c4.feishu.cn/drive/folder/FqrtfExOJlzhVHdNwL1cTNlZnWr',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">考试与考核</h2>
        <p className="text-slate-500 mb-8">请按需进入对应考核页面，完成阶段性评估或转正考核。</p>

        <div className="grid gap-6 md:grid-cols-2">
          {examLinks.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </a>
          ))}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <h4 className="font-medium text-amber-900 mb-1">考核须知</h4>
              <ul className="text-sm text-amber-800 list-disc list-inside space-y-1">
                <li>考核内容以飞书文档形式发布，点击卡片即可打开。</li>
                <li>请确保在截止日期前完成并提交。</li>
                <li>如有疑问，请联系导师或管理员。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeworkPanel({ user }: { user: User }) {
  const isMentor = user.role === 'mentor' || user.role === 'admin';
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mentor scoring modal
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [scoringSubmission, setScoringSubmission] = useState<HomeworkSubmission | null>(null);
  const [scoreValue, setScoreValue] = useState('');
  const [feedbackValue, setFeedbackValue] = useState('');
  const [scoring, setScoring] = useState(false);

  // Mentor view filter
  const [mentorView, setMentorView] = useState<'byHomework' | 'byStudent'>('byHomework');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const url = isMentor
        ? '/api/homework/list'
        : `/api/homework/list?userId=${encodeURIComponent(user.user_id)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok && data.data) {
        setSubmissions(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [isMentor, user.user_id]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const openSubmit = (hwId: string, existing?: HomeworkSubmission) => {
    setSelectedHomeworkId(hwId);
    setContent(existing ? existing.content : '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHomeworkId || !content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/homework/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.user_id,
          userName: user.name,
          role: user.role,
          homeworkId: selectedHomeworkId,
          content: content.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setModalOpen(false);
        await fetchSubmissions();
      } else {
        alert(data.error || '提交失败');
      }
    } catch {
      alert('网络错误，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const openScore = (sub: HomeworkSubmission) => {
    setScoringSubmission(sub);
    setScoreValue(sub.score !== undefined ? String(sub.score) : '');
    setFeedbackValue(sub.feedback || '');
    setScoreModalOpen(true);
  };

  const handleScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoringSubmission) return;
    setScoring(true);
    try {
      const res = await fetch('/api/homework/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scorerId: user.user_id,
          scorerName: user.name,
          role: user.role,
          submissionId: scoringSubmission.id,
          score: Number(scoreValue),
          feedback: feedbackValue,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setScoreModalOpen(false);
        await fetchSubmissions();
      } else {
        alert(data.error || '评分失败');
      }
    } catch {
      alert('网络错误，请重试');
    } finally {
      setScoring(false);
    }
  };

  const getSubmission = (hwId: string) => submissions.find((s) => s.homeworkId === hwId);

  // Student view
  if (!isMentor) {
    const grouped = homeworkData.reduce<Record<string, typeof homeworkData>>((acc, hw) => {
      if (!acc[hw.phase]) acc[hw.phase] = [];
      acc[hw.phase].push(hw);
      return acc;
    }, {});

    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">作业提交</h2>
          <p className="text-slate-500 mb-6">请按阶段完成并提交作业，导师批改后可在此查看评分和评语。</p>

          {loading && submissions.length === 0 && (
            <div className="text-center py-12">
              <svg className="animate-spin h-6 w-6 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-slate-500 mt-2">加载中...</p>
            </div>
          )}

          <div className="space-y-6">
            {Object.entries(grouped).map(([phase, items]) => (
              <div key={phase} className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{phase}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((hw) => {
                    const sub = getSubmission(hw.id);
                    const status = sub?.score !== undefined ? 'scored' : sub ? 'submitted' : 'pending';
                    return (
                      <div key={hw.id} className="rounded-lg border border-slate-100 p-4 hover:border-blue-200 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-slate-900">{hw.title}</h4>
                          {status === 'pending' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">未提交</span>
                          )}
                          {status === 'submitted' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">已提交，待批改</span>
                          )}
                          {status === 'scored' && sub && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">已评分 {sub.score} 分</span>
                          )}
                        </div>
                        {sub && (
                          <div className="text-xs text-slate-500 mb-3">
                            提交时间：{new Date(sub.createdAt).toLocaleString('zh-CN')}
                          </div>
                        )}
                        {sub?.score !== undefined && (
                          <div className="bg-slate-50 rounded-md p-3 mb-3 text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-900">评分：{sub.score} 分</span>
                              <span className="text-xs text-slate-400">by {sub.scoredBy}</span>
                            </div>
                            {sub.feedback && <p className="text-slate-600">评语：{sub.feedback}</p>}
                          </div>
                        )}
                        <button
                          onClick={() => openSubmit(hw.id, sub)}
                          className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {sub ? '重新编辑' : '去提交'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                提交作业：{homeworkData.find((h) => h.id === selectedHomeworkId)?.title}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="在此输入作业内容..."
                  rows={8}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  required
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                  >
                    {submitting ? '提交中...' : '提交'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mentor / Admin view
  const uniqueStudents = Array.from(new Map(submissions.map((s) => [s.userId, s])).values());

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">作业批改</h2>
            <p className="text-slate-500">查看学员提交的作业并进行评分。</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setMentorView('byHomework')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mentorView === 'byHomework' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              按作业查看
            </button>
            <button
              onClick={() => setMentorView('byStudent')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mentorView === 'byStudent' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              按学员查看
            </button>
          </div>
        </div>

        {loading && submissions.length === 0 && (
          <div className="text-center py-12">
            <svg className="animate-spin h-6 w-6 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-slate-500 mt-2">加载中...</p>
          </div>
        )}

        {mentorView === 'byHomework' && (
          <div className="space-y-6">
            {homeworkData.map((hw) => {
              const hwSubs = submissions.filter((s) => s.homeworkId === hw.id);
              return (
                <div key={hw.id} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">{hw.title}</h3>
                    <span className="text-xs text-slate-500">{hw.phase} · 已提交 {hwSubs.length} 份</span>
                  </div>
                  {hwSubs.length === 0 ? (
                    <p className="text-sm text-slate-400">暂无学员提交</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500 border-b border-slate-100">
                            <th className="pb-2 font-medium">学员</th>
                            <th className="pb-2 font-medium">提交时间</th>
                            <th className="pb-2 font-medium">内容摘要</th>
                            <th className="pb-2 font-medium">评分</th>
                            <th className="pb-2 font-medium text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hwSubs.map((sub) => (
                            <tr key={sub.id} className="border-b border-slate-50 last:border-0">
                              <td className="py-3 text-slate-900">{sub.userName}</td>
                              <td className="py-3 text-slate-500">{new Date(sub.createdAt).toLocaleString('zh-CN')}</td>
                              <td className="py-3 text-slate-500 max-w-xs truncate">{sub.content}</td>
                              <td className="py-3">
                                {sub.score !== undefined ? (
                                  <span className="text-green-700 font-medium">{sub.score} 分</span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => openScore(sub)}
                                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  {sub.score !== undefined ? '修改评分' : '评分'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {mentorView === 'byStudent' && (
          <div className="space-y-6">
            {uniqueStudents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-400 text-sm">暂无学员提交记录</p>
              </div>
            ) : (
              uniqueStudents.map((student) => {
                const studentSubs = submissions.filter((s) => s.userId === student.userId);
                return (
                  <div key={student.userId} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">{student.userName}</h3>
                      <span className="text-xs text-slate-500">已提交 {studentSubs.length} 份作业</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500 border-b border-slate-100">
                            <th className="pb-2 font-medium">作业名称</th>
                            <th className="pb-2 font-medium">提交时间</th>
                            <th className="pb-2 font-medium">评分</th>
                            <th className="pb-2 font-medium text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentSubs.map((sub) => (
                            <tr key={sub.id} className="border-b border-slate-50 last:border-0">
                              <td className="py-3 text-slate-900">
                                {homeworkData.find((h) => h.id === sub.homeworkId)?.title || sub.homeworkId}
                              </td>
                              <td className="py-3 text-slate-500">{new Date(sub.createdAt).toLocaleString('zh-CN')}</td>
                              <td className="py-3">
                                {sub.score !== undefined ? (
                                  <span className="text-green-700 font-medium">{sub.score} 分</span>
                                ) : (
                                  <span className="text-slate-400">待批改</span>
                                )}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => openScore(sub)}
                                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  {sub.score !== undefined ? '修改评分' : '评分'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {scoreModalOpen && scoringSubmission && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              批改作业：{homeworkData.find((h) => h.id === scoringSubmission.homeworkId)?.title}
            </h3>
            <p className="text-sm text-slate-500 mb-4">学员：{scoringSubmission.userName}</p>
            <div className="bg-slate-50 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto text-sm text-slate-700">
              <p className="whitespace-pre-wrap">{scoringSubmission.content}</p>
            </div>
            <form onSubmit={handleScore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">评分（0-100）</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={scoreValue}
                  onChange={(e) => setScoreValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">评语</label>
                <textarea
                  value={feedbackValue}
                  onChange={(e) => setFeedbackValue(e.target.value)}
                  placeholder="输入评语..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScoreModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={scoring}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {scoring ? '保存中...' : '保存评分'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UserManagementPanel({ user }: { user: User }) {
  const [roles, setRoles] = useState<Record<string, 'admin' | 'mentor' | 'student'>>({});
  const [loading, setLoading] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [roleInput, setRoleInput] = useState<'mentor' | 'admin' | 'student'>('mentor');
  const [saving, setSaving] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/roles?requesterRole=${user.role}`);
      const data = await res.json();
      if (data.ok && data.data) {
        setRoles(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdInput.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/users/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterRole: user.role,
          userId: userIdInput.trim(),
          role: roleInput,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setUserIdInput('');
        await fetchRoles();
      } else {
        alert(data.error || '保存失败');
      }
    } catch {
      alert('网络错误，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (targetUserId: string) => {
    if (!confirm('确定要移除该用户的特殊权限吗？移除后将恢复为学员身份。')) return;
    try {
      const res = await fetch('/api/users/roles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterRole: user.role,
          userId: targetUserId,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        await fetchRoles();
      } else {
        alert(data.error || '删除失败');
      }
    } catch {
      alert('网络错误，请重试');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">用户权限管理</h2>
        <p className="text-slate-500 mb-6">为其他飞书用户分配导师或管理员角色。需要知道对方的飞书 user_id。</p>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">添加/修改权限</h3>
          <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="飞书 user_id（如 ou_xxx）"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value as 'mentor' | 'admin' | 'student')}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="mentor">导师</option>
              <option value="admin">管理员</option>
              <option value="student">学员</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm font-medium"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">当前权限列表</h3>
          {loading && Object.keys(roles).length === 0 && (
            <div className="text-center py-8">
              <svg className="animate-spin h-5 w-5 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {!loading && Object.keys(roles).length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">暂无自定义权限记录，所有未配置用户默认为学员。</p>
          )}

          {Object.keys(roles).length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="pb-2 font-medium">飞书 user_id</th>
                    <th className="pb-2 font-medium">角色</th>
                    <th className="pb-2 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(roles).map(([uid, r]) => (
                    <tr key={uid} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 text-slate-900 font-mono text-xs">{uid}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(r)}`}>
                          {getRoleLabel(r)}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDelete(uid)}
                          className="text-xs text-red-600 hover:text-red-700 hover:underline"
                        >
                          移除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Reflection {
  id: string;
  topic: string;
  content: string;
  date: string;
  createdAt: string;
}

function ReflectionPanel({ userName }: { userName: string }) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? localStorage.getItem(REFLECTION_KEY) : null;
    if (saved) {
      try {
        setReflections(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(REFLECTION_KEY, JSON.stringify(reflections));
    }
  }, [reflections, mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !content.trim()) return;
    const now = new Date();
    const newReflection: Reflection = {
      id: crypto.randomUUID(),
      topic: topic.trim(),
      content: content.trim(),
      date: now.toISOString().split('T')[0],
      createdAt: now.toISOString(),
    };
    setReflections((prev) => [newReflection, ...prev]);
    setTopic('');
    setContent('');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条学习心得吗？')) {
      setReflections((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">学习心得</h2>
        <p className="text-slate-500 mb-8">记录学习过程中的收获与思考，方便回顾与总结。</p>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">填写新心得</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">学习主题</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：搜索广告出价策略"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">心得内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你的学习收获、疑问或总结..."
                rows={5}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">填写人：{userName}</span>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                提交心得
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {reflections.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-400 text-sm">暂无学习心得，快去记录第一条吧！</p>
            </div>
          ) : (
            reflections.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900">{r.topic}</h4>
                  <span className="text-xs text-slate-400">{r.date}</span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap mb-3">{r.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">by {userName}</span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const faqData = [
  {
    q: '如何完成课程学习？',
    a: '点击左侧课程目录中的章节即可在右侧查看飞书文档。阅读完成后，点击右上角「标记为已完成」按钮记录学习进度。',
  },
  {
    q: '为什么有些资料打不开？',
    a: '部分文件夹类型资料需要在飞书中打开。点击「在飞书中打开」按钮，使用已登录的飞书账号访问即可。',
  },
  {
    q: '我的学习进度会保存吗？',
    a: '会。学习进度自动保存在浏览器本地，下次用同一设备登录时会自动恢复。',
  },
  {
    q: '如何参加考试和考核？',
    a: '切换到顶部「考试」板块，即可查看阶段性考核和转正考核的入口。',
  },
  {
    q: '登录时提示「没有权限」怎么办？',
    a: '请联系管理员确认你的飞书账号已被添加到系统中。新员工的权限需要管理员手动开通。',
  },
  {
    q: '学习心得可以修改或删除吗？',
    a: '目前支持删除后重新填写。后续版本将支持编辑功能。',
  },
];

function FAQPanel() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">常见问题</h2>
        <p className="text-slate-500 mb-8">使用过程中遇到问题？先来这里看看。</p>

        <div className="space-y-3">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-900 pr-4">{item.q}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('learn');

  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        setAuthLoading(true);
        fetch('/api/auth/feishu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.ok && data.data) {
              setUser(data.data);
              localStorage.setItem(USER_KEY, JSON.stringify(data.data));
              window.history.replaceState({}, document.title, window.location.pathname);
            } else {
              setAuthError(data.error || '登录失败，请重试');
            }
          })
          .catch(() => {
            setAuthError('网络错误，请重试');
          })
          .finally(() => {
            setAuthLoading(false);
          });
      }
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const savedProgress = saved ? JSON.parse(saved) : {};
    setProgress(savedProgress);

    const defaultExpanded: Record<string, boolean> = {};
    courseData.slice(0, 3).forEach((s) => {
      defaultExpanded[s.id] = true;
    });
    setExpandedSections(defaultExpanded);

    const first = getFirstLesson();
    if (first) setActiveId(first.id);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, mounted]);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  const activeLesson = getLessonById(activeId);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const handleLessonClick = useCallback((lesson: Lesson) => {
    if (lesson.type === 'folder') {
      window.open(lesson.url, '_blank');
      return;
    }
    setActiveId(lesson.id);
  }, []);

  const toggleComplete = useCallback((lessonId: string) => {
    setProgress((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = courseData.reduce((acc, section) => {
    section.lessons.forEach((l) => {
      acc++;
      if (l.children) acc += l.children.length;
    });
    return acc;
  }, 0);

  if (!mounted) {
    return null;
  }

  if (!user) {
    return (
      <div className="relative">
        <LoginScreen />
        {authLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg px-6 py-4 shadow-lg flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm text-slate-700">登录中...</span>
            </div>
          </div>
        )}
        {authError && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-50 text-red-700 px-4 py-2 rounded-lg shadow-lg text-sm z-50">
            {authError}
            <button onClick={() => setAuthError(null)} className="ml-3 text-red-800 hover:underline">
              知道了
            </button>
          </div>
        )}
      </div>
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'learn', label: '学习' },
    { key: 'exam', label: '考试' },
    { key: 'homework', label: '作业' },
    { key: 'reflection', label: '学习心得' },
    { key: 'faq', label: 'FAQ' },
    ...(user.role === 'admin' ? [{ key: 'users' as TabKey, label: '用户管理' }] : []),
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="12,6 16,14 8,14" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">Google 优化师培训学习系统</h1>
              <p className="text-xs text-slate-500">
                {activeTab === 'learn' ? `学习进度: ${completedCount} / ${totalCount} 节已完成` : '内部员工培训学习平台'}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 ml-2 border-l border-slate-200 pl-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'learn' && activeLesson && activeLesson.type !== 'folder' && (
            <button
              onClick={() => toggleComplete(activeLesson.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                progress[activeLesson.id]
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {progress[activeLesson.id] ? '✓ 已完成' : '标记为已完成'}
            </button>
          )}

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                {user.name?.[0] || 'U'}
              </div>
            )}
            <span className="text-sm text-slate-700 hidden sm:inline">{user.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(user.role)}`}>
              {getRoleLabel(user.role)}
            </span>
            <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-slate-600 ml-1" title="退出登录">
              退出
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === t.key ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'learn' && (
          <>
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider">
                课程目录
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {courseData.map((section) => (
                  <div key={section.id} className="rounded-lg border border-slate-100 overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-left text-sm font-semibold text-slate-800 transition-colors"
                    >
                      <span className="truncate pr-2">{section.title}</span>
                      <svg
                        className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                          expandedSections[section.id] ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {expandedSections[section.id] && (
                      <div className="py-1">
                        {section.lessons.map((lesson) => (
                          <div key={lesson.id}>
                            <button
                              onClick={() => handleLessonClick(lesson)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                                activeId === lesson.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span className="flex-shrink-0">{getIconByType(lesson.type)}</span>
                              <span className="flex-1 truncate">{lesson.title}</span>
                              {progress[lesson.id] && (
                                <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>

                            {lesson.children && (
                              <div className="pl-4">
                                {lesson.children.map((child) => (
                                  <button
                                    key={child.id}
                                    onClick={() => handleLessonClick(child)}
                                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors ${
                                      activeId === child.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span className="flex-shrink-0">{getIconByType(child.type)}</span>
                                    <span className="flex-1 truncate">
                                      {child.isHomework ? (
                                        <span className="inline-flex items-center gap-1">
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                                            作业
                                          </span>
                                          {child.title.replace('作业：', '')}
                                        </span>
                                      ) : (
                                        child.title
                                      )}
                                    </span>
                                    {progress[child.id] && (
                                      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 bg-slate-50 relative overflow-hidden">
              {activeLesson ? (
                activeLesson.type === 'folder' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">{activeLesson.title}</h2>
                    <p className="text-slate-500 mb-6 max-w-md">
                      文件夹内容无法在页面内直接预览，请点击下方按钮在飞书中查看完整资料。
                    </p>
                    <a
                      href={activeLesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      在飞书中打开
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col">
                    <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {getIconByType(activeLesson.type)}
                        <span className="font-medium text-slate-900">{activeLesson.title}</span>
                      </div>
                      <a
                        href={activeLesson.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        在飞书中打开
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                    <iframe
                      src={activeLesson.url}
                      className="flex-1 w-full border-0"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
                      allow="fullscreen"
                      title={activeLesson.title}
                    />
                  </div>
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">请选择课程</h2>
                  <p className="text-slate-500">点击左侧目录中的课程，即可在此开始学习。</p>
                </div>
              )}
            </main>
          </>
        )}

        {activeTab === 'exam' && <ExamPanel />}
        {activeTab === 'homework' && user && <HomeworkPanel user={user} />}
        {activeTab === 'users' && user && user.role === 'admin' && <UserManagementPanel user={user} />}
        {activeTab === 'reflection' && <ReflectionPanel userName={user.name} />}
        {activeTab === 'faq' && <FAQPanel />}
      </div>
    </div>
  );
}
