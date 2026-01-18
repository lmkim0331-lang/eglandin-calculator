import type { Metadata } from "next";
import './globals.css'

// 카톡 공유 시 나타나는 제목과 설명을 요청하신 내용으로 수정했습니다.
export const metadata: Metadata = {
  title: "Eglandin Calculator",
  description: "에글란딘 질환 별 프로토콜과 투여 계산",
  openGraph: {
    title: "Eglandin Calculator",
    description: "에글란딘 질환 별 프로토콜과 투여 계산",
    url: 'https://eglandin-calculator-psi.vercel.app/',
    siteName: 'EGLANDIN CALCULATOR',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {/* 상단 헤더 부분입니다 */}
        <header className="bg-red-700 text-white p-4 shadow-md">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="font-black tracking-tighter text-lg uppercase">EGLANDIN CALCULATOR</h1>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}