import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "舆论危机监控中心 - 罗永浩与西贝预制菜争议事件追踪",
  description: "专业的舆论危机监控平台，实时追踪罗永浩与西贝预制菜争议事件，提供AI驱动的危机处理建议和公关策略分析。",
  keywords: ["舆论危机", "危机公关", "罗永浩", "西贝", "预制菜", "餐饮危机", "品牌管理", "公关策略", "AI助手"],
  authors: [{ name: "危机处理专家团队" }],
  openGraph: {
    title: "舆论危机监控中心 - 罗永浩与西贝预制菜争议",
    description: "专业的舆论危机监控与AI驱动的危机处理建议平台",
    url: "https://74a0d879.lyh-crisis-relations.pages.dev",
    siteName: "舆论危机监控中心",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "舆论危机监控中心",
    description: "专业的舆论危机监控与AI驱动的危机处理建议平台",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
