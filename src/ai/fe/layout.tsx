import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { PRIMARY_NAV_ROUTES } from './routes-config';

// Tailwind 전역 스타일은 프로젝트 설정에 따라 app/globals.css 등에서 불러옵니다.
// 필요 시 아래 주석을 해제해 사용하세요.
// import './globals.css';

export const metadata: Metadata = {
  title: '부트캠프 커뮤니티 · MVP',
  description: '부트캠프 수강생 커뮤니티 및 포트폴리오 공유를 위한 MVP 화면 구조',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500 text-sm font-bold text-white shadow-sm">
                  BC
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    부트캠프 커뮤니티
                  </span>
                  <span className="text-xs text-slate-500">
                    MVP 화면 구조 · 임시 레이아웃
                  </span>
                </div>
              </div>

              <div className="hidden text-xs text-slate-500 sm:block">
                <span className="rounded-full border border-dashed border-slate-300 bg-slate-50 px-2 py-0.5">
                  디자인/플로우 확정 전 · 구조 검토용
                </span>
              </div>
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
            <nav
              className="flex items-center justify-between py-3 text-sm"
              aria-label="주요 화면 이동"
            >
              <ul className="flex flex-1 gap-2 overflow-x-auto pr-2 text-slate-600">
                {PRIMARY_NAV_ROUTES.map((route) => (
                  <li key={route.id} className="whitespace-nowrap">
                    <Link
                      href={route.path}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:ring-teal-200"
                    >
                      <span>{route.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="ml-2 hidden text-[11px] text-slate-500 sm:block">
                <span>이 내비게이션은 MVP 설계용 임시 구성입니다.</span>
              </div>
            </nav>

            <main className="flex-1 pb-8">{children}</main>
          </div>

          <footer className="border-t border-slate-200 bg-white/80">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-[11px] text-slate-500 sm:px-6">
              <span>부트캠프 커뮤니티 · MVP 구조 초안</span>
              <span>실제 디자인/흐름은 팀 협의 후 업데이트 예정</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
