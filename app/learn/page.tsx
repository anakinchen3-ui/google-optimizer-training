'use client';

import { useState, useEffect, useCallback } from 'react';
import { courseData, type Lesson, type LessonType, getLessonById, getFirstLesson } from './data';

const STORAGE_KEY = 'google-learn-progress-v1';
const USER_KEY = 'google-learn-user-v1';

const APP_ID = 'cli_a954b3694f381cb0';
// 部署到 Vercel 后，在 Environment Variables 里设置 NEXT_PUBLIC_REDIRECT_URI
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://your-domain.vercel.app/learn';

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

export default function LearnPage() {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore session from localStorage and handle OAuth callback
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
            <button
              onClick={() => setAuthError(null)}
              className="ml-3 text-red-800 hover:underline"
            >
              知道了
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
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
              学习进度: {completedCount} / {totalCount} 节已完成
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeLesson && activeLesson.type !== 'folder' && (
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
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-slate-600 ml-1"
              title="退出登录"
            >
              退出
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
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
                            activeId === lesson.id
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-600 hover:bg-slate-50'
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
                                  activeId === child.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-slate-500 hover:bg-slate-50'
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
      </div>
    </div>
  );
}
