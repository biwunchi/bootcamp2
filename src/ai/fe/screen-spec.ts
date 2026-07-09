/**
 * 핵심 화면(메인 피드, 글 상세, 마이페이지)의
 * 컴포넌트 분할 구조와 기본 UI 상태(loading/empty/error 등)를
 * 정리한 FE 관점 임시 스펙입니다.
 *
 * - DS 와이어프레임이 아직 없다는 가정 하에 작성된 초안입니다.
 * - 실제 구현 시 DS/PM 확정안에 맞춰 조정이 필요합니다.
 * - Next.js App Router + React + Tailwind CSS를 전제로 하는 구조 제안입니다.
 */

// 화면 식별자
export type ScreenId = 'main-feed' | 'post-detail' | 'my-page';

// 컴포넌트 역할 분류 (FE 관점)
export type ComponentKind =
  | 'layout' // 페이지/섹션 레이아웃 컨테이너
  | 'navigation' // 상단/하단 네비게이션, 탭 등
  | 'section' // 의미 단위 섹션 래퍼
  | 'data-display' // 데이터 표시(카드, 리스트 등)
  | 'interaction' // 버튼, 필터, 탭 등 상호작용 중심
  | 'feedback' // 로딩, 빈 상태, 에러, 토스트 등
  | 'form' // 입력 폼, 댓글 입력, 프로필 편집 등
  | 'overlay'; // 모달, 바텀시트 등

// 공통 UI 상태 ID
export type ScreenStateId =
  | 'loading-initial' // 페이지 최초 진입/첫 데이터 로딩
  | 'loading-more' // 무한 스크롤/추가 로딩
  | 'loading-sub' // 부분 영역(댓글, 탭 등) 로딩
  | 'success-with-data' // 정상 데이터가 존재하는 상태
  | 'empty' // 데이터 조회 성공 + 표시할 데이터 없음
  | 'error-network' // 네트워크/클라이언트 에러
  | 'error-server' // 서버 에러(5xx 등)
  | 'unauthenticated' // 비로그인 상태로 접근
  | 'not-found' // 리소스 없음(삭제/잘못된 URL 등)
  | 'permission-denied' // 권한 없음(비공개 글 등)
  | 'optimistic-updating'; // 낙관적 업데이트 진행 중(좋아요/북마크 등)

// 개별 컴포넌트 스펙
export interface ComponentSpec {
  /** 화면 내에서의 로컬 ID (디자인/문서화 용도) */
  id: string;
  /** 예상 React 컴포넌트 이름 (실제 구현 시 변경 가능) */
  name: string;
  /** 역할/성격 분류 */
  kind: ComponentKind;
  /** 어떤 역할을 하는지 간단 설명 (한국어) */
  description: string;
  /** 하위에 중첩되는 서브 컴포넌트 구조 (선택) */
  children?: ComponentSpec[];
  /** 상태 처리/재사용/접근성 등에 대한 메모 (선택) */
  notes?: string[];
}

// 화면 단위 상태 스펙
export interface ScreenStateSpec {
  id: ScreenStateId;
  /** 사람이 읽기 쉬운 상태 이름 */
  label: string;
  /** 언제/무엇 때문에 이 상태가 되는지 */
  triggers: string[];
  /** UI가 어떻게 보여야 하는지에 대한 요약 */
  uiBehavior: string[];
}

// 화면 스펙
export interface ScreenSpec {
  id: ScreenId;
  /** 화면 이름 (한글) */
  title: string;
  /** 예상 라우트 예시 (실제 라우팅 구조는 PM/BE 협의 필요) */
  routeExamples: string[];
  /** 화면 목적/역할 */
  description: string;
  /** 모바일 우선 레이아웃 요약 */
  layoutSummary: string;
  /** 이 화면에서 사용자가 가장 우선적으로 해야 할 행동 */
  primaryActionDescription?: string;
  /** DS 확정 전 임시 초안 여부 (현재 모두 true) */
  isDraft: boolean;
  /** 컴포넌트 트리 구조 제안 */
  components: ComponentSpec[];
  /** 이 화면에서 기본적으로 고려해야 할 상태들 */
  states: ScreenStateSpec[];
  /** 구현/상태 관리/재사용 등에 대한 FE 메모 */
  notes?: string[];
}

/**
 * 메인 피드, 글 상세, 간단 마이페이지 화면 스펙 모음
 */
export const screenSpecs: ScreenSpec[] = [
  {
    id: 'main-feed',
    title: '메인 피드 화면',
    routeExamples: ['/', '/feed'],
    description:
      '부트캠프 사용자들의 최신 글을 카드 리스트 형태로 보여주는 홈 피드 화면입니다. 질문/회고/정보 등 카테고리 탭과 글 쓰기 진입이 핵심입니다.',
    layoutSummary:
      '모바일 우선 단일 컬럼 스크롤 레이아웃. 상단 고정 헤더(로고, 검색 진입), 카테고리 탭, 게시글 카드 리스트, 우측 하단 글쓰기 플로팅 버튼, 하단 글로벌 네비게이션 구조.',
    primaryActionDescription: '새 글 작성 플로우로 진입(글쓰기 버튼 탭).',
    isDraft: true,
    components: [
      {
        id: 'main-feed-page',
        name: 'MainFeedPage',
        kind: 'layout',
        description: 'Next.js App Router 페이지 컴포넌트 (예: app/page.tsx). 화면 전체 컨테이너.',
        notes: [
          '데이터 패칭 훅(예: useFeedQuery)을 내부에서 사용하거나 상위에서 주입받는 구조 모두 가능.',
          '모바일 우선 스타일을 Tailwind로 정의하고, 중단점(breakpoint) 별로 레이아웃 보완.',
        ],
        children: [
          {
            id: 'feed-top-nav',
            name: 'TopNav',
            kind: 'navigation',
            description:
              '상단 네비게이션 바. 로고/서비스명, 간단한 검색 진입 버튼, 알림/마이페이지 아이콘 등을 포함.',
            notes: ['모든 주요 화면에서 재사용 가능한 공통 컴포넌트로 설계.'],
          },
          {
            id: 'feed-filter-tabs',
            name: 'FeedFilterTabs',
            kind: 'interaction',
            description:
              '전체/질문/회고/정보 등 카테고리 탭. 선택된 탭에 따라 피드 쿼리 파라미터를 변경.',
            notes: [
              '키보드 포커스 이동 및 스크린 리더를 위한 role="tablist"/"tab" 적용.',
              '선택된 탭은 aria-selected, 하이라이트 스타일로 명확히 구분.',
            ],
          },
          {
            id: 'feed-content-area',
            name: 'FeedContentArea',
            kind: 'section',
            description: '피드 본문 영역 래퍼. 상태에 따라 다른 하위 컴포넌트 렌더링.',
            children: [
              {
                id: 'feed-state-boundary',
                name: 'FeedStateBoundary',
                kind: 'feedback',
                description:
                  '로딩/빈/에러/성공 상태에 따라 PostList, FeedEmptyState, FeedErrorState 등을 분기 렌더링하는 컨테이너.',
                notes: [
                  '데이터 패칭 훅에서 받은 isLoading/isError/data 길이 등을 기반으로 분기.',
                  '상태별로 aria-live, skeleton 등 피드백 방식을 일관되게 적용.',
                ],
                children: [
                  {
                    id: 'feed-loading-skeleton',
                    name: 'FeedSkeleton',
                    kind: 'feedback',
                    description:
                      '초기 로딩/필터 변경 시 게시글 카드 자리의 skeleton UI를 3~5개 정도 노출.',
                    notes: ['실제 PostCard 레이아웃과 유사한 스켈레톤 블록 구성.'],
                  },
                  {
                    id: 'feed-post-list',
                    name: 'PostList',
                    kind: 'data-display',
                    description:
                      '게시글 카드 리스트 컨테이너. 무한 스크롤 또는 “더 보기” 버튼을 통해 추가 로딩 처리.',
                    notes: ['PostCard 컴포넌트를 재사용 가능하도록 props 설계.'],
                    children: [
                      {
                        id: 'feed-post-card',
                        name: 'PostCard',
                        kind: 'data-display',
                        description:
                          '각 게시글을 보여주는 카드 컴포넌트. 제목, 요약, 작성자/부트캠프 정보, 태그, 좋아요/댓글 수, 작성일 등을 포함.',
                        notes: [
                          '카드 전체를 클릭 시 상세 진입, 하단 액션(좋아요/북마크)은 개별 클릭 가능하게 hit area 분리.',
                          '카드 내부에서 좋아요/북마크 클릭 시 낙관적 업데이트(optimistic-updating) 상태 고려.',
                        ],
                      },
                    ],
                  },
                  {
                    id: 'feed-empty-state',
                    name: 'FeedEmptyState',
                    kind: 'feedback',
                    description:
                      '조회 성공이지만 게시글이 하나도 없을 때 보여주는 빈 상태 컴포넌트. 안내 문구와 “첫 글 쓰기” CTA 포함.',
                    notes: ['전체 필터/검색 결과 없음 등 상황별 메시지 분기 가능.'],
                  },
                  {
                    id: 'feed-error-state',
                    name: 'FeedErrorState',
                    kind: 'feedback',
                    description:
                      '네트워크/서버 에러로 피드 로딩에 실패했을 때 보여주는 에러 상태 컴포넌트.',
                    notes: ['재시도 버튼, 간단한 에러 메시지, 홈으로 이동 링크 등을 제공.'],
                  },
                ],
              },
            ],
          },
          {
            id: 'feed-create-post-fab',
            name: 'CreatePostButton',
            kind: 'interaction',
            description:
              '우측 하단 플로팅 액션 버튼(FAB). 글 작성 페이지/모달로 진입하는 주요 CTA.',
            notes: [
              '로그인하지 않은 상태에서 탭하면 로그인 페이지 또는 로그인 모달로 유도.',
              '모바일에서 한 손 조작 가능한 위치(우측 하단) 고정.',
            ],
          },
          {
            id: 'feed-bottom-nav',
            name: 'BottomNav',
            kind: 'navigation',
            description:
              '모바일 하단 글로벌 네비게이션. 메인 피드, 검색/탐색, 알림, 마이페이지 등으로 이동.',
            notes: ['모든 주요 화면에서 공통으로 사용하는 컴포넌트 후보.'],
          },
        ],
      },
    ],
    states: [
      {
        id: 'loading-initial',
        label: '초기 로딩',
        triggers: ['페이지 최초 진입 시 첫 피드 요청', '카테고리 탭 변경 후 첫 데이터 요청'],
        uiBehavior: [
          '상단 TopNav, FeedFilterTabs, BottomNav는 즉시 렌더링.',
          '게시글 리스트 영역에는 FeedSkeleton을 3~5개 표시.',
          '재시도 버튼은 기본적으로 숨김(에러 상태에서 노출).',
        ],
      },
      {
        id: 'loading-more',
        label: '추가 로딩(무한 스크롤)',
        triggers: ['스크롤이 리스트 하단 근처에 도달해 다음 페이지를 요청할 때'],
        uiBehavior: [
          '기존 PostCard 목록은 그대로 유지.',
          '리스트 하단에 작은 스피너/"불러오는 중" 문구를 추가로 노출.',
          '에러 발생 시 하단 영역만 에러 메시지+재시도 버튼으로 교체.',
        ],
      },
      {
        id: 'success-with-data',
        label: '정상 데이터 표시',
        triggers: ['피드 조회 성공 && 게시글 개수 > 0'],
        uiBehavior: [
          'PostList + PostCard들을 카드 형태로 노출.',
          '카테고리/필터 상태를 상단 탭 선택 상태로 반영.',
          '좋아요/북마크 클릭 시 부분적인 낙관적 업데이트를 허용.',
        ],
      },
      {
        id: 'empty',
        label: '빈 상태(게시글 없음)',
        triggers: [
          '피드 조회 성공 && 게시글 개수 === 0',
          '검색/필터 결과가 비어 있을 때',
        ],
        uiBehavior: [
          'FeedEmptyState 컴포넌트를 표시하고, 설명 텍스트 + 글쓰기 CTA 버튼 제공.',
          '검색/필터 결과 없음인 경우, 현재 필터 조합을 함께 표시.',
        ],
      },
      {
        id: 'error-network',
        label: '네트워크/요청 에러',
        triggers: ['초기 피드 요청 실패', '추가 페이지 로딩 실패'],
        uiBehavior: [
          '초기 요청 실패 시 FeedErrorState를 리스트 영역 전체에 표시.',
          '이미 일부 데이터가 있는 상태에서 추가 로딩 실패 시, 상단 토스트 또는 하단 작은 에러 문구로 제한 노출.',
          '에러 메시지와 함께 재시도 버튼을 제공.',
        ],
      },
      {
        id: 'unauthenticated',
        label: '비로그인 상태',
        triggers: ['사용자 세션/토큰이 없을 때'],
        uiBehavior: [
          '피드 열람은 가능하다고 가정(가정은 추후 PM/BE와 협의).',
          'CreatePostButton 탭 시 로그인 페이지 또는 모달로 라우팅.',
          '좋아요/북마크 시도 시 로그인 유도 다이얼로그/바텀시트를 노출.',
        ],
      },
    ],
    notes: [
      '로딩/빈/에러를 한 곳에서 관리하는 FeedStateBoundary 패턴을 우선 시도.',
      'PostCard, FeedEmptyState, FeedErrorState는 마이페이지 등 다른 화면에서도 재사용 가능하도록 설계.',
    ],
  },
  {
    id: 'post-detail',
    title: '글 상세 화면',
    routeExamples: ['/posts/[postId]'],
    description:
      '하나의 게시글 본문과 댓글을 읽고 상호작용(좋아요, 북마크, 댓글 작성)하는 화면입니다.',
    layoutSummary:
      '상단 고정 헤더(뒤로 가기, 더보기 메뉴), 스크롤 가능한 본문 영역(글 정보, 본문, 태그, 액션), 하단 댓글 입력 바(모바일 기준).',
    primaryActionDescription: '댓글 작성 또는 좋아요/북마크 등 상호작용.',
    isDraft: true,
    components: [
      {
        id: 'post-detail-page',
        name: 'PostDetailPage',
        kind: 'layout',
        description: '게시글 상세 페이지 컨테이너. URL 파라미터(postId)를 읽어 상세 데이터를 패칭.',
        notes: ['App Router의 동적 라우트 세그먼트(/posts/[id])를 사용.'],
        children: [
          {
            id: 'post-detail-header',
            name: 'DetailTopBar',
            kind: 'navigation',
            description:
              '상단 고정 헤더. 좌측 뒤로가기, 우측 옵션(수정/삭제 · 공유 등)을 포함.',
            notes: ['모바일에서 안전 영역(safe area) 및 스크롤 시 배경/그림자 처리.'],
          },
          {
            id: 'post-detail-content-area',
            name: 'PostDetailContentArea',
            kind: 'section',
            description: '본문 및 댓글을 포함하는 스크롤 가능한 메인 영역.',
            children: [
              {
                id: 'post-detail-state-boundary',
                name: 'PostDetailStateBoundary',
                kind: 'feedback',
                description:
                  '상세 데이터 로딩/에러/404/권한 없음 등을 분기하여 적절한 뷰를 보여주는 컨테이너.',
                children: [
                  {
                    id: 'post-detail-skeleton',
                    name: 'PostDetailSkeleton',
                    kind: 'feedback',
                    description:
                      '제목/작성자 영역과 본문 블록에 대한 skeleton UI. 초기 로딩 동안 노출.',
                  },
                  {
                    id: 'post-not-found-state',
                    name: 'PostNotFoundState',
                    kind: 'feedback',
                    description:
                      '삭제되었거나 존재하지 않는 게시글일 때 보여줄 404 스타일 상태.',
                    notes: ['"게시글을 찾을 수 없습니다" 안내 + 메인 피드로 이동 버튼.'],
                  },
                  {
                    id: 'post-permission-denied-state',
                    name: 'PostPermissionDeniedState',
                    kind: 'feedback',
                    description:
                      '비공개 글이거나 접근 권한이 없을 때 보여줄 권한 없음 상태.',
                    notes: ['로그인/권한 요청 안내와 함께 홈/이전 페이지로 이동 제공.'],
                  },
                  {
                    id: 'post-detail-main',
                    name: 'PostDetailMain',
                    kind: 'section',
                    description: '정상적으로 게시글 데이터를 로드했을 때의 본문 섹션.',
                    children: [
                      {
                        id: 'post-header',
                        name: 'PostHeader',
                        kind: 'data-display',
                        description:
                          '게시글 제목, 작성자 정보(프로필 이미지, 닉네임, 부트캠프), 작성일, 조회수 등을 표시.',
                      },
                      {
                        id: 'post-meta',
                        name: 'PostMeta',
                        kind: 'data-display',
                        description:
                          '태그, 카테고리(질문/회고/정보 등), 읽는 시간(예: 3분 읽기) 등의 메타 정보.',
                      },
                      {
                        id: 'post-body',
                        name: 'PostBody',
                        kind: 'data-display',
                        description:
                          '실제 글 본문을 렌더링. 마크다운 또는 리치 텍스트를 지원한다는 가정.',
                        notes: [
                          '헤딩/코드블럭/리스트 등 기본 마크다운 스타일의 Tailwind 프리셋 적용.',
                        ],
                      },
                      {
                        id: 'post-actions',
                        name: 'PostActions',
                        kind: 'interaction',
                        description:
                          '좋아요, 북마크, 공유, 신고 등 상호작용 버튼 모음.',
                        notes: [
                          '좋아요/북마크는 클릭 시 낙관적 업데이트(optimistic-updating) 상태를 UI로 피드백.',
                          '비로그인 시 탭하면 로그인 유도.',
                        ],
                      },
                      {
                        id: 'post-comments-section',
                        name: 'CommentsSection',
                        kind: 'section',
                        description:
                          '댓글 헤더(댓글 수), 댓글 리스트, 빈 상태, 댓글 로딩/에러, 댓글 작성 폼을 포함하는 섹션.',
                        children: [
                          {
                            id: 'comments-header',
                            name: 'CommentsHeader',
                            kind: 'data-display',
                            description: '댓글 수와 간단한 정렬/필터(최신순, 인기순 등) 표시.',
                          },
                          {
                            id: 'comments-list-boundary',
                            name: 'CommentsListBoundary',
                            kind: 'feedback',
                            description:
                              '댓글 리스트에 대한 로딩/빈/에러/성공 상태 분기를 담당.',
                            children: [
                              {
                                id: 'comments-loading',
                                name: 'CommentsSkeleton',
                                kind: 'feedback',
                                description:
                                  '댓글 아바타/텍스트에 대응하는 skeleton UI.',
                              },
                              {
                                id: 'comments-list',
                                name: 'CommentsList',
                                kind: 'data-display',
                                description:
                                  'CommentItem들의 리스트. 들여쓰기/대댓글이 필요하면 계층 구조도 고려.',
                              },
                              {
                                id: 'comments-empty',
                                name: 'CommentsEmptyState',
                                kind: 'feedback',
                                description:
                                  '댓글이 하나도 없을 때의 빈 상태. "첫 댓글을 남겨보세요" 안내.',
                              },
                              {
                                id: 'comments-error',
                                name: 'CommentsErrorState',
                                kind: 'feedback',
                                description:
                                  '댓글 조회에 실패했을 때의 에러 상태. 재시도 버튼 포함.',
                              },
                            ],
                          },
                          {
                            id: 'comment-form',
                            name: 'CommentForm',
                            kind: 'form',
                            description:
                              '댓글 입력 텍스트 영역과 전송 버튼. 모바일에서는 하단 고정 입력 바 형태로도 고려.',
                            notes: [
                              '로그인하지 않은 경우 비활성화 + 로그인 유도 문구/버튼.',
                              '전송 시 낙관적 추가 또는 전송 중 상태 표시.',
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    states: [
      {
        id: 'loading-initial',
        label: '상세 초기 로딩',
        triggers: ['/posts/[id] 페이지 최초 진입 시 상세 데이터 요청'],
        uiBehavior: [
          'DetailTopBar는 즉시 렌더링(뒤로가기 가능).',
          'PostDetailSkeleton을 본문 영역에 표시.',
          '댓글 섹션도 skeleton 또는 로딩 인디케이터만 간단히 노출.',
        ],
      },
      {
        id: 'success-with-data',
        label: '정상 상세 표시',
        triggers: ['상세 데이터 조회 성공 && 게시글 존재'],
        uiBehavior: [
          'PostHeader, PostBody, PostMeta, PostActions를 순서대로 렌더링.',
          '댓글 섹션은 별도 요청이라면 CommentsSkeleton → CommentsList 순으로 전환.',
          '좋아요/북마크/댓글 작성 시 각 액션에 따른 부분 상태(optimistic-updating)를 표현.',
        ],
      },
      {
        id: 'empty',
        label: '댓글 없음(부분 빈 상태)',
        triggers: ['게시글은 존재하지만 댓글 개수 === 0'],
        uiBehavior: [
          '게시글 본문은 정상 표시.',
          '댓글 리스트 영역에는 CommentsEmptyState를 표시.',
          'CommentForm은 활성 상태로, 첫 댓글 작성을 유도.',
        ],
      },
      {
        id: 'not-found',
        label: '게시글 없음(404)',
        triggers: ['상세 데이터 요청 결과가 404 또는 null/undefined'],
        uiBehavior: [
          'PostNotFoundState를 본문 영역 전체에 표시.',
          '메인 피드로 이동하는 버튼 또는 이전 페이지로 돌아가기 링크 제공.',
          '댓글/액션 영역은 렌더링하지 않음.',
        ],
      },
      {
        id: 'permission-denied',
        label: '접근 권한 없음',
        triggers: ['비공개 글이거나 현재 사용자 권한으로 접근 불가'],
        uiBehavior: [
          'PostPermissionDeniedState에 권한 관련 설명 및 대체 경로 제공.',
          '민감한 데이터(제목/작성자 등)는 노출하지 않음(가정).',
        ],
      },
      {
        id: 'error-network',
        label: '네트워크/요청 에러',
        triggers: ['상세 데이터 요청 실패', '댓글 리스트 요청 실패'],
        uiBehavior: [
          '상세 데이터 요청 실패 시, 본문 영역에 간단한 에러 상태 + 재시도 버튼 노출.',
          '댓글만 실패한 경우, 댓글 섹션 내부에만 CommentsErrorState 표시.',
        ],
      },
      {
        id: 'unauthenticated',
        label: '비로그인 상태(상세 보기)',
        triggers: ['세션 없음 상태에서 상세 화면 접근'],
        uiBehavior: [
          '게시글 읽기는 허용한다고 가정.',
          'CommentForm 입력 영역을 비활성화하고 "댓글을 쓰려면 로그인" 안내와 버튼 제공.',
          '좋아요/북마크 시도 시 로그인 유도.',
        ],
      },
      {
        id: 'optimistic-updating',
        label: '상호작용 낙관적 업데이트',
        triggers: ['좋아요/북마크/댓글 작성 등 즉각적 피드백이 필요한 액션 수행 시'],
        uiBehavior: [
          '좋아요/북마크 토글 시 즉시 UI 상태를 변경 후, 실패 시 다시 롤백.',
          '댓글 작성 시, 전송 중 상태 인디케이터 및 중복 전송 방지.',
        ],
      },
    ],
    notes: [
      '댓글 영역은 별도 상태(loading/empty/error)를 가지므로 CommentsListBoundary에서 세부 제어.',
      '좋아요/북마크/신고 등 액션은 훗날 전역 상태 또는 React Query mutation으로 추상화 가능.',
    ],
  },
  {
    id: 'my-page',
    title: '간단 마이페이지 화면',
    routeExamples: ['/me', '/profile'],
    description:
      '사용자 본인의 프로필 정보, 활동(작성한 글), 간단한 통계를 보여주는 마이페이지입니다.',
    layoutSummary:
      '상단 프로필 헤더(아바타, 닉네임, 부트캠프/기수), 활동 통계, 탭(작성 글/북마크), 하단에 자신의 글 목록 카드 리스트.',
    primaryActionDescription: '프로필 관리(편집) 또는 내 글/북마크 탐색.',
    isDraft: true,
    components: [
      {
        id: 'my-page-root',
        name: 'MyPage',
        kind: 'layout',
        description: '본인 마이페이지 컨테이너. 인증된 사용자 정보에 기반하여 렌더링.',
        notes: ['로그인 필수 화면으로 가정. 비로그인 시 리다이렉트/게이트 처리 필요.'],
        children: [
          {
            id: 'my-page-top-nav',
            name: 'TopNav',
            kind: 'navigation',
            description:
              '상단 네비게이션 바. 좌측에는 뒤로가기 또는 로고, 우측에는 설정 아이콘(계정/로그아웃) 등을 포함.',
          },
          {
            id: 'my-profile-header',
            name: 'ProfileHeader',
            kind: 'data-display',
            description:
              '프로필 이미지, 닉네임, 한 줄 소개, 부트캠프/기수 등 핵심 프로필 정보를 보여주는 상단 헤더.',
            notes: ['프로필 편집 버튼을 우측 상단 또는 헤더 하단에 배치.'],
          },
          {
            id: 'my-stats',
            name: 'ProfileStats',
            kind: 'data-display',
            description:
              '작성한 글 수, 받은 좋아요 수, 댓글 수 등 기본 활동 통계를 카드/배지 형태로 표시.',
          },
          {
            id: 'my-page-tabs',
            name: 'MyPageTabs',
            kind: 'interaction',
            description:
              '"작성 글"/"북마크" 등 탭 전환. 선택된 탭에 따라 아래 리스트 내용 변경.',
            notes: ['FeedFilterTabs와 유사한 role="tablist" 접근성 패턴 재사용.'],
          },
          {
            id: 'my-page-content',
            name: 'MyPageContentArea',
            kind: 'section',
            description: '선택된 탭에 따라 다른 리스트를 보여주는 콘텐츠 영역.',
            children: [
              {
                id: 'my-page-state-boundary',
                name: 'MyPageStateBoundary',
                kind: 'feedback',
                description:
                  '작성 글/북마크 목록에 대한 로딩/빈/에러/성공 상태를 분기 렌더링.',
                children: [
                  {
                    id: 'my-page-loading',
                    name: 'MyPageSkeleton',
                    kind: 'feedback',
                    description: '프로필 헤더와 리스트 영역에 대한 skeleton UI.',
                  },
                  {
                    id: 'my-posts-list',
                    name: 'MyPostsList',
                    kind: 'data-display',
                    description:
                      '본인이 작성한 게시글 리스트. 메인 피드의 PostCard를 재사용하거나 변형.',
                  },
                  {
                    id: 'my-bookmarks-list',
                    name: 'MyBookmarksList',
                    kind: 'data-display',
                    description:
                      '북마크한 게시글 리스트. PostCard를 재사용하되, 북마크 해제 액션을 강조.',
                  },
                  {
                    id: 'my-page-empty',
                    name: 'MyPageEmptyState',
                    kind: 'feedback',
                    description:
                      '작성 글이 없거나 북마크가 없을 때 보여줄 빈 상태. 각 탭에 맞는 안내 문구 포함.',
                  },
                  {
                    id: 'my-page-error',
                    name: 'MyPageErrorState',
                    kind: 'feedback',
                    description:
                      '사용자 정보 또는 활동 데이터를 불러오지 못했을 때의 에러 상태.',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    states: [
      {
        id: 'loading-initial',
        label: '마이페이지 초기 로딩',
        triggers: ['로그인된 사용자가 /me 또는 /profile에 최초 진입할 때'],
        uiBehavior: [
          'TopNav는 즉시 렌더링.',
          '프로필 정보/통계/리스트를 위한 MyPageSkeleton 표시.',
        ],
      },
      {
        id: 'success-with-data',
        label: '정상 데이터 표시',
        triggers: ['사용자 정보, 활동 통계, 기본 탭 데이터 조회 성공'],
        uiBehavior: [
          'ProfileHeader, ProfileStats, MyPageTabs를 순서대로 렌더링.',
          '기본 탭(예: 작성 글)에 해당하는 리스트를 MyPostsList로 표시.',
        ],
      },
      {
        id: 'empty',
        label: '활동 데이터 없음',
        triggers: [
          '작성 글 개수 === 0 (작성 글 탭)',
          '북마크 개수 === 0 (북마크 탭)',
        ],
        uiBehavior: [
          'MyPageEmptyState에서 탭 종류에 따라 다른 안내 문구/CTA를 노출.',
          '작성 글 없음: 메인 피드 또는 글쓰기 페이지로 가는 버튼 제공.',
          '북마크 없음: 메인 피드로 이동해 글을 탐색하도록 유도.',
        ],
      },
      {
        id: 'error-network',
        label: '네트워크/요청 에러',
        triggers: ['사용자 정보 또는 활동 데이터 API 요청 실패'],
        uiBehavior: [
          '전체 데이터 실패 시, MyPageErrorState를 콘텐츠 영역 전체에 표시.',
          '일부(예: 북마크만) 실패 시 해당 탭에서만 에러 메시지/재시도 버튼 노출.',
        ],
      },
      {
        id: 'unauthenticated',
        label: '비로그인 상태(마이페이지)',
        triggers: ['세션 없음 상태에서 /me 또는 /profile 접근'],
        uiBehavior: [
          '마이페이지는 로그인 필수 화면으로 가정.',
          '로그인 페이지로 리다이렉트하거나, 간단한 게이트 화면에서 로그인/회원가입 CTA 제공.',
        ],
      },
    ],
    notes: [
      'PostCard, Empty/Error 상태 컴포넌트는 메인 피드와 공유하도록 설계해 유지보수 비용을 줄이는 것을 권장.',
      '초기 버전에서는 "프로필 편집" 동작을 최소화(예: 닉네임/소개만)하고 이후 확장 가능.',
    ],
  },
];

/**
 * ID로 화면 스펙을 조회하는 유틸 함수 (문서/스토리북 등에서 활용 가능)
 */
export const getScreenSpec = (id: ScreenId): ScreenSpec | undefined =>
  screenSpecs.find((screen) => screen.id === id);
