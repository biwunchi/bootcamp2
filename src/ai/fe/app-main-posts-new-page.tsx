// 새 게시글 작성 페이지
import React from 'react';

export default function NewPostPage() {
  // TODO: 제출 처리, 제목/내용 폼 상태 관리, 인증 체크
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📋 게시글 작성</h2>
      <form className="bg-white border rounded p-4 max-w-lg mx-auto">
        <label className="block font-medium mb-2">제목</label>
        <input className="w-full border rounded p-2 mb-4" placeholder="제목을 입력하세요" />

        <label className="block font-medium mb-2">내용</label>
        <textarea className="w-full border rounded p-2 mb-4 h-32" placeholder="내용을 입력하세요" />

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">등록</button>
      </form>
    </div>
  );
}
