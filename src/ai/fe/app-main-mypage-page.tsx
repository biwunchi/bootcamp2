// 마이페이지 (간략 프로필/내 게시글 등)
import React from 'react';

export default function MyPage() {
  // TODO: 실제 프로필 데이터 및 내 게시글 불러오기
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">마이페이지</h2>
      <div className="bg-white rounded border shadow p-4 mb-4">
        <div className="font-semibold">홍길동 님</div>
        <div className="text-gray-500">email@bootcamp.com</div>
      </div>
      <div>
        <h3 className="font-bold mb-2">내가 쓴 게시글</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>부트캠프 후기 공유 (2024-06-01)</li>
          {/* TODO: 실제 데이터 리스트로 대체 */}
        </ul>
      </div>
    </div>
  );
}
