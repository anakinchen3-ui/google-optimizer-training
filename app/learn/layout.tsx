export const metadata = {
  title: 'Google 优化师培训学习系统',
  description: '内部员工培训学习平台',
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="m-0 p-0 overflow-hidden">{children}</body>
    </html>
  );
}
