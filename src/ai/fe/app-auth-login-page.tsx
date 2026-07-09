// 로그인 페이지
import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow border">
        <h1 className="text-2xl font-bold mb-4 text-center text-teal-600">로그인</h1>
        {/* TODO: 실제 로그인 폼 및 소셜 로그인 */}
        <button className="w-full py-2 bg-teal-500 text-white rounded font-semibold hover:bg-teal-600">계정으로 로그인</button>
        <div className="mt-4 text-center text-gray-500 text-xs">아직 회원이 아니신가요?</div>
      </div>
    </div>
  );
}
