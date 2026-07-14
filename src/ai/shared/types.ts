// 부트캠프 커뮤니티 주요 엔티티 및 DTO 타입 정의

export interface User {
  id: number;
  email: string;
  nickname: string;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface Study {
  id: number;
  title: string;
  description?: string;
  creator_id: number;
  created_at: string;
}

export interface StudyMember {
  id: number;
  study_id: number;
  user_id: number;
  joined_at: string;
}

// DTO (Request/Response) 예시
export interface CreatePostRequest {
  title: string;
  content: string;
}
export interface CreateCommentRequest {
  post_id: number;
  content: string;
}
export interface CreateStudyRequest {
  title: string;
  description?: string;
}
// ... (기본 CRUD의 input/output DTO를 필요시 추가)