import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EGLANDIN Main App",
  description: "에글란딘 통합 대시보드",
  openGraph: {
    title: "EGLANDIN Main App",
    description: "에글란딘의 모든 업무용 앱을 한곳에서 이용하세요.",
    images: [{ url: "/opengraph-image.png" }],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}