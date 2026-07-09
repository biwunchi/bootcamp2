// 주요 레이아웃: 인증 후 메인 UI, 상단바/네비/Wrapper
import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* TODO: TopNavBar, SideBar 등 추가 - 임시 */}
      <header className="w-full p-4 border-b bg-white font-bold text-teal-700">부트캠프 커뮤니티</header>
      <main className="flex-1 w-full max-w-2xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
