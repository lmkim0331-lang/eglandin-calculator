import './globals.css'

export const metadata = {
  title: 'EGLANDIN CALCULATOR',
  description: 'Medical Infusion Rate Calculator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {/* 기존의 복잡한 네비게이션 바를 제거하고 깔끔하게 설정합니다 */}
        <header className="bg-red-700 text-white p-4 shadow-md">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="font-black tracking-tighter text-lg uppercase">EGLANDIN CALCULATOR</h1>
            {/* '계산기' 글자를 삭제하고 '프로토콜'만 남기거나 아예 비워둘 수 있습니다. 여기서는 모두 삭제합니다. */}
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}