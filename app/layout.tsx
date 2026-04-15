import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google 优化师培训学习系统",
  description: "内部员工培训学习平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
