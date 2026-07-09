import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "부트캠프 커뮤니티 (임시 UI)",
  description: "부트캠프 수강생을 위한 커뮤니티 웹 앱 - 초기 FE 스캐폴딩",
};

interface RootLayoutProps {
  children: ReactNode;
}

// NOTE:
// - Next.js App Router 기준의 루트 레이아웃입니다.
// - 헤더/푸터/기본 패딩 등은 디자인 확정 전까지 사용하는 임시 구현입니다.
// - 색감은 라이트 테마 + teal 포인트 컬러 방향의 예시일 뿐, 최종안은 팀 협의 후 교체합니다.
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className="h-full bg-slate-50">
      <body className="min-h-full text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-white shadow-sm">
                  BC
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight text-slate-900">
                    부트캠프 커뮤니티
                  </span>
                  <span className="text-xs text-slate-500">
                    FE 초기 스택 · 레이아웃 임시 구현
                  </span>
                </div>
              </div>
              <nav className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <span className="rounded-full border border-dashed border-slate-200 px-2.5 py-1">
                  Next.js · TypeScript · Tailwind CSS
                </span>
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              {children}
            </div>
          </main>

          <footer className="border-t bg-white/60">
            <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>이 레이아웃은 디자인 확정 전까지 사용하는 임시 FE 스캐폴딩입니다.</p>
              <p className="text-right sm:text-left">
                FE 스택: Next.js App Router · TypeScript · Tailwind CSS
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
