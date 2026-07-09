// MVP 화면 / 라우팅 설계용 공용 라우트 설정
// FE, PM, BE가 함께 참조할 수 있는 최소한의 경로 정의입니다.

export type AppRouteId =
  | 'home'
  | 'feed'
  | 'projects'
  | 'projectDetail'
  | 'projectCreate'
  | 'profile'
  | 'authSignIn'
  | 'authSignUp';

export type AppRouteCategory = 'community' | 'portfolio' | 'auth' | 'etc';

// 현재 상태: 실제 페이지 구현 여부
export type RouteStatus =
  | 'ready' // Next.js 페이지/레이아웃까지 뼈대 구현 완료
  | 'planned'; // 경로/역할만 정의된 상태 (추가 구현 필요)

export interface AppRouteConfig {
  id: AppRouteId;
  /** Next.js App Router 기준 경로 (동적 세그먼트 포함 가능) */
  path: string;
  /** 내비게이션/라우트 맵에 노출할 이름 */
  label: string;
  /** 화면 역할 요약 (기획/PM 공유용) */
  description: string;
  /** 커뮤니티 / 포트폴리오 / 인증 등 대략적인 영역 */
  category: AppRouteCategory;
  status: RouteStatus;
  /** 이 화면에 진입하기 위해 인증이 필요한지 여부 (기획/가드 설계용) */
  requiresAuth: boolean;
  /** 상단 내비게이션에 노출할지 여부 */
  showInPrimaryNav: boolean;
  /** MVP 라우트 맵(홈) 화면에 노출할지 여부 */
  showInSitemap: boolean;
}

/**
 * MVP 기준 합의가 필요했던 핵심 플로우를 중심으로 한 라우트 목록입니다.
 * - status === 'ready' : 이 작업에서 실제 Next.js 페이지 뼈대까지 포함된 경로
 * - status === 'planned': 경로/역할만 정의되었고 후속 작업에서 페이지를 추가할 경로
 */
export const APP_ROUTES: AppRouteConfig[] = [
  {
    id: 'home',
    path: '/',
    label: '홈 · MVP 화면 구성',
    description: 'MVP 화면/라우팅 구조를 한눈에 보는 임시 홈 화면',
    category: 'etc',
    status: 'ready',
    requiresAuth: false,
    showInPrimaryNav: true,
    showInSitemap: true,
  },
  {
    id: 'feed',
    path: '/feed',
    label: '커뮤니티 피드',
    description: '부트캠프 수강생들의 질문, 후기, 정보 공유 피드를 모아보는 화면',
    category: 'community',
    status: 'planned',
    // 열람은 공개, 글쓰기 등은 추후 권한 가드로 제한하는 가정
    requiresAuth: false,
    showInPrimaryNav: true,
    showInSitemap: true,
  },
  {
    id: 'projects',
    path: '/projects',
    label: '작품 둘러보기',
    description: '디자이너/수강생들이 업로드한 포트폴리오·작품 리스트',
    category: 'portfolio',
    status: 'planned',
    requiresAuth: false,
    showInPrimaryNav: true,
    showInSitemap: true,
  },
  {
    id: 'projectDetail',
    path: '/projects/[projectId]',
    label: '작품 상세',
    description: '개별 작품의 상세 정보, 제작 과정, 피드백 스레드를 보는 화면',
    category: 'portfolio',
    status: 'planned',
    requiresAuth: false,
    // 상세 화면은 주요 내비게이션에는 노출하지 않고 리스트/피드에서 진입
    showInPrimaryNav: false,
    showInSitemap: true,
  },
  {
    id: 'projectCreate',
    path: '/projects/new',
    label: '작품 업로드',
    description: '디자이너가 새 작품을 업로드하고 설명/태그를 입력하는 화면',
    category: 'portfolio',
    status: 'planned',
    requiresAuth: true,
    showInPrimaryNav: true,
    showInSitemap: true,
  },
  {
    id: 'profile',
    path: '/me',
    label: '내 프로필 / 포트폴리오',
    description: '내 정보와 내가 올린 작품, 참여한 커뮤니티 활동을 모아보는 화면',
    category: 'portfolio',
    status: 'planned',
    requiresAuth: true,
    showInPrimaryNav: true,
    showInSitemap: true,
  },
  {
    id: 'authSignIn',
    path: '/auth/sign-in',
    label: '로그인',
    description: '부트캠프 커뮤니티에 로그인하는 화면 (이메일/소셜 로그인 등)',
    category: 'auth',
    status: 'planned',
    requiresAuth: false,
    showInPrimaryNav: false,
    showInSitemap: true,
  },
  {
    id: 'authSignUp',
    path: '/auth/sign-up',
    label: '회원가입',
    description: '부트캠프 수강생/졸업생이 계정을 생성하는 온보딩 화면',
    category: 'auth',
    status: 'planned',
    requiresAuth: false,
    showInPrimaryNav: false,
    showInSitemap: true,
  },
];

// 상단 내비게이션에 노출할 경로 (현재는 구현 완료된 홈만 연결)
export const PRIMARY_NAV_ROUTES: AppRouteConfig[] = APP_ROUTES.filter(
  (route) => route.showInPrimaryNav && route.status === 'ready',
);

// MVP 라우트 맵(홈)에서 설계용으로 보여줄 경로
export const SITEMAP_ROUTES: AppRouteConfig[] = APP_ROUTES.filter(
  (route) => route.showInSitemap,
);
