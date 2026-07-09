// 게시글 상세 페이지
import React from 'react';
import { notFound } from 'next/navigation';

// 추후 getPost(postId) API 연동 예정
export default function PostDetailPage({ params }: { params: { postId: string } }) {
  const { postId } = params;
  // TODO: 에러/로딩 처리, 게시글 서비스 연동
  // 임시: postId 유무 확인
  if (!postId) return notFound();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">게시글 상세 (ID: {postId})</h2>
      <div className="bg-white border rounded p-4">
        <div className="font-semibold mb-2">[제목] 부트캠프 후기 공유</div>
        <div className="text-sm text-gray-500 mb-4">by 홍길동 · 2024-06-01</div>
        <div className="mb-6">
          여기에 실제 게시글 본문이 들어갑니다. (임시)
        </div>
        {/* TODO: 댓글, 신고/수정/삭제 등 부가 기능 예정 */}
      </div>
    </div>
  );
}
