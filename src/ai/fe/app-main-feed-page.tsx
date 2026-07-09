// 메인 피드 페이지
import React from 'react';

export default function FeedPage() {
  // TODO: 실제 게시글 데이터 불러오기 및 카드 뷰 연결
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🔥 메인 피드</h2>
      {/* 게시글 카드 리스트 - 추후 연동 */}
      <div className="grid gap-4">
        <div className="p-4 bg-white border rounded shadow-sm">
          <div className="font-semibold">[예시] 부트캠프 후기 공유합니다</div>
          <div className="text-sm text-gray-500">by 홍길동 · 2024-06-01</div>
        </div>
        {/* ... 더미 데이터 2-4개 추가 가능 */}
      </div>
    </div>
  );
}
