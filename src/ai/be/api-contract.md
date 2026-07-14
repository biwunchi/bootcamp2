# 부트캠프 커뮤니티 주요 API 스펙 초안

## User
- POST `/api/users/register`  
  - 회원가입
  - body: `{ email, nickname, password }`
  - response: User
- POST `/api/users/login`  
  - 로그인 (JWT 혹은 세션)
  - body: `{ email, password }`
  - response: `{ token, user }`
- GET `/api/users/me`  
  - 내 정보 조회
  - response: User

## Post
- POST `/api/posts`
  - 게시글 작성
  - body: CreatePostRequest
  - response: Post
- GET `/api/posts` 
  - 게시글 목록 (paging 쿼리: ?limit, ?offset)
  - response: `Post[]`
- GET `/api/posts/{id}`
  - 게시글 상세
  - response: Post
- PUT `/api/posts/{id}`
  - 게시글 수정
  - body: `{ title?, content? }`
  - response: Post
- DELETE `/api/posts/{id}`
  - 게시글 삭제

## Comment
- POST `/api/posts/{post_id}/comments`
  - 댓글 작성
  - body: CreateCommentRequest
  - response: Comment
- GET `/api/posts/{post_id}/comments`
  - 댓글 목록
  - response: `Comment[]`
- DELETE `/api/comments/{id}`
  - 댓글 삭제

## Study
- POST `/api/studies`
  - 스터디 생성
  - body: CreateStudyRequest
  - response: Study
- GET `/api/studies`
  - 스터디 목록
  - response: `Study[]`
- GET `/api/studies/{id}`
  - 스터디 상세
  - response: Study
- POST `/api/studies/{id}/join`
  - 스터디 가입
  - response: StudyMember
- GET `/api/studies/{id}/members`
  - 스터디 멤버 목록
  - response: `User[]`

## 인증/권한 및 기타 주의사항
- 모든 write/delete API는 인증 필수 (JWT/세션 등)
- 자신의 게시글/댓글/스터디만 삭제·수정 가능
- paging/List API는 limit/offset 등 기본 제공
- 추후 확장(태그, 이미지 등)을 위해 단순화