import './globals.css'

export const metadata = {
  // 1. 카카오톡/브라우저 탭에 표시될 제목
  title: '에글란딘 계산기 | Eglandin Calculator', 
  // 2. 검색 엔진 및 공유 시 표시될 설명
  description: '의료진 전용 에글란딘 정밀 주입 속도 계산기 (2ml 앰플 부피 보정)',
  // 3. SNS 공유(Open Graph) 설정
  openGraph: {
    title: '에글란딘 정밀 계산기',
    description: '앰플 부피 보정 및 gtt/min 계산 지원',
    url: 'https://eglandin-calculator-psi.vercel.app/',
    siteName: 'EGLANDIN CALCULATOR',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {/* 상단 헤더: '계산기' 글자를 제거하고 타이틀만 깔끔하게 남겼습니다 */}
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