import React from "react";

type RouteTemplateSection = {
  id: string;
  title: string;
  description: string;
  directoryTree: string[];
  notes?: string[];
};

type StackTemplateId = "next" | "cra";

type StackTemplate = {
  id: StackTemplateId;
  label: string;
  summary: string;
  recommendedWhen: string[];
  notIdealWhen: string[];
  sections: RouteTemplateSection[];
};

const STACK_TEMPLATES: StackTemplate[] = [
  {
    id: "next",
    label: "안 1. Next.js (App Router) + Tailwind 기본 템플릿",
    summary:
      "파일 기반 라우팅과 서버 컴포넌트를 활용해 SEO·초기 로딩 속도·구조적 일관성을 확보하는 스택입니다.",
    recommendedWhen: [
      "SEO·초기 로딩 성능이 중요하고, 검색/공유 가능한 퍼블릭 페이지가 많을 때",
      "마케팅/랜딩 페이지와 로그인 이후 앱 화면이 공존하는 경우",
      "API BFF(Backend For Frontend)를 Next.js route handler로 두고 싶을 때",
      "협업 시 라우트 구조를 디렉터리만 봐도 알 수 있게 하고 싶을 때",
    ],
    notIdealWhen: [
      "순수 클라이언트 사이드 SPA만 필요하고 서버 기능이 전혀 필요 없을 때",
      "팀이 이미 CRA/Vite + React Router에 매우 익숙하고 SSR/SSG가 필요 없을 때",
      "호스팅 환경이 정적 파일만 허용되어 서버 런타임을 둘 수 없을 때",
    ],
    sections: [
      {
        id: "next-app-structure",
        title: "기본 app 디렉터리 구조 (부트캠프 커뮤니티 예시)",
        description:
          "Next.js App Router 기준으로, 비로그인 영역과 로그인 이후 메인 영역을 route group으로 분리한 최소 구조입니다.",
        directoryTree: [
          "app/",
          "  layout.tsx                      // 전체 공통 레이아웃 (글로벌 네비, 폰트, 메타)",
          "  page.tsx                        // 비로그인 홈 / 랜딩 페이지",
          "",
          "  (auth)/                         // 인증 관련 route group (선택)",
          "    layout.tsx                    // 인증 화면 전용 레이아웃",
          "    sign-in/",
          "      page.tsx                    // 로그인 페이지",
          "    sign-up/",
          "      page.tsx                    // 회원가입 페이지",
          "",
          "  (main)/                         // 로그인 이후 메인 앱 영역 (route group)",
          "    layout.tsx                    // 로그인 사용자 공통 레이아웃",
          "    dashboard/",
          "      page.tsx                    // 대시보드: 피드 + 추천 콘텐츠",
          "",
          "    community/",
          "      page.tsx                    // 커뮤니티 글 목록 / 필터 / 검색",
          "      [postId]/",
          "        page.tsx                  // 게시글 상세 페이지",
          "",
          "    works/",
          "      page.tsx                    // 작품 업로드 + 내 작품 목록",
          "",
          "    profile/",
          "      [username]/",
          "        page.tsx                  // 사용자 프로필 / 포트폴리오",
          "",
          "    settings/",
          "      page.tsx                    // 계정 / 알림 / 테마 설정",
          "",
          "  api/                            // (선택) Next.js Route Handler 기반 BFF",
          "    auth/",
          "      route.ts                    // 로그인 / 로그아웃 / 세션 관리",
          "    posts/",
          "      route.ts                    // 게시글 생성 / 수정 / 삭제",
        ],
        notes: [
          "(auth) / (main) 과 같은 route group은 URL 경로에는 노출되지 않고, 레이아웃과 구조만 분리할 때 사용합니다.",
          "페이지와 API를 한 프로젝트에서 관리할 수 있어, 작은 팀에서 운영/배포 단순화에 유리합니다.",
          "Tailwind 설정은 프로젝트 루트의 tailwind.config.ts, app/globals.css 등에서 관리합니다.",
        ],
      },
      {
        id: "next-routing-principles",
        title: "라우팅 / 페이지 설계 원칙",
        description:
          "파일명과 폴더 구조만으로 라우팅이 결정되므로, URL·컴포넌트·데이터 흐름을 같이 설계하는 것이 중요합니다.",
        directoryTree: [
          "경로 예시:",
          "/                      -> app/page.tsx (비로그인 홈 / 랜딩)",
          "/sign-in               -> app/(auth)/sign-in/page.tsx",
          "/sign-up               -> app/(auth)/sign-up/page.tsx",
          "/app                   -> app/(main)/dashboard/page.tsx (로그인 홈)",
          "/app/community         -> app/(main)/community/page.tsx",
          "/app/community/[id]    -> app/(main)/community/[postId]/page.tsx",
          "/app/works             -> app/(main)/works/page.tsx",
          "/app/profile/[username]-> app/(main)/profile/[username]/page.tsx",
          "/app/settings          -> app/(main)/settings/page.tsx",
        ],
        notes: [
          "로그인 전/후를 URL로 완전히 분리할지((auth), (main)) 또는 같은 트리 안에서 보호 라우트로 처리할지 팀에서 합의가 필요합니다.",
          "Next.js의 loading.tsx, error.tsx, not-found.tsx를 각 폴더에 두어 로딩/에러/404 상태를 세밀하게 제어할 수 있습니다.",
          "App Router 기준으로 대부분의 페이지는 서버 컴포넌트로 시작하고, 상호작용이 필요한 부분만 client 컴포넌트로 분리하는 것을 권장합니다.",
        ],
      },
    ],
  },
  {
    id: "cra",
    label: "안 2. CRA 또는 Vite + React Router + Tailwind 기본 템플릿",
    summary:
      "순수 클라이언트 사이드 렌더링을 사용하는 전통적인 SPA 구조로, 러닝 커브가 낮고 설정 자유도가 높은 스택입니다.",
    recommendedWhen: [
      "SEO 요구가 낮고, 로그인 이후 내부 사용자 위주의 웹앱일 때",
      "팀이 React Router 기반 SPA 패턴에 익숙하거나, 기존 프로젝트가 같은 스택일 때",
      "정적 호스팅(S3, GitHub Pages 등)만으로 간단히 배포하고 싶을 때",
      "백엔드 API가 별도 도메인(예: /api 대신 외부 REST/GraphQL)으로 이미 구성되어 있을 때",
    ],
    notIdealWhen: [
      "검색 유입이 중요한 퍼블릭 페이지가 많거나, SSR/SSG가 꼭 필요한 경우",
      "페이지 초기 로딩 성능에 매우 민감한 마케팅/랜딩이 핵심일 때",
      "프론트엔드에서 BFF 역할까지 같이 수행해야 하는 경우 (Next.js route handler가 더 적합)",
    ],
    sections: [
      {
        id: "cra-src-structure",
        title: "src 구조 및 라우트 구성 (React Router 기준)",
        description:
          "React Router를 사용하는 SPA 구조에서, 페이지/레이아웃/공통 컴포넌트를 분리한 최소 예시입니다.",
        directoryTree: [
          "src/",
          "  main.tsx                         // ReactDOM.createRoot + <BrowserRouter />",
          "  App.tsx                          // 전역 레이아웃 + 최상위 라우트 스위치",
          "",
          "  routes/",
          "    AppRoutes.tsx                  // React Router 라우트 정의",
          "",
          "  pages/",
          "    LandingPage.tsx                // 비로그인 홈 / 랜딩",
          "    DashboardPage.tsx              // 로그인 후 홈",
          "    CommunityListPage.tsx          // 커뮤니티 목록",
          "    CommunityPostDetailPage.tsx    // 게시글 상세",
          "    UploadWorkPage.tsx             // 작품 업로드",
          "    ProfilePage.tsx                // 프로필",
          "    SettingsPage.tsx               // 설정",
          "    SignInPage.tsx                 // 로그인",
          "    SignUpPage.tsx                 // 회원가입",
          "",
          "  components/",
          "    layout/",
          "      MainLayout.tsx              // 헤더/푸터/공통 레이아웃",
          "      Header.tsx                  // 상단 네비게이션",
          "      Footer.tsx                  // 푸터",
          "      BottomNav.tsx               // 모바일 하단 네비게이션",
          "    community/",
          "      CommunityCard.tsx           // 커뮤니티 리스트 카드",
          "      PostCard.tsx                // 게시글 카드",
          "    works/",
          "      WorkUploadForm.tsx          // 작품 업로드 폼",
          "",
          "  styles/",
          "    index.css                      // Tailwind base/directives(@tailwind base 등)",
          "",
          "  libs/",
          "    apiClient.ts                   // fetch/axios 래퍼 및 공통 에러 처리",
        ],
        notes: [
          "라우트 정의는 routes/AppRoutes.tsx에서 관리하고, App.tsx에서는 레이아웃·전역 상태만 담당하게 분리합니다.",
          "코드 스플리팅은 React.lazy + Suspense 또는 React Router의 lazy 로 지연 로딩을 적용할 수 있습니다.",
          "Tailwind 설정은 프로젝트 루트의 tailwind.config.ts와 src/index.css에 작성합니다.",
        ],
      },
      {
        id: "cra-routing-principles",
        title: "React Router 기반 라우팅 예시",
        description:
          "URL 설계는 Next.js 안과 유사하게 가져가되, 라우트 테이블로 명시적으로 관리합니다.",
        directoryTree: [
          "경로 예시:",
          "/                      -> <LandingPage />",
          "/app                   -> <DashboardPage />",
          "/community             -> <CommunityListPage />",
          "/community/:postId     -> <CommunityPostDetailPage />",
          "/works                 -> <UploadWorkPage />",
          "/profile/:username     -> <ProfilePage />",
          "/settings              -> <SettingsPage />",
          "/sign-in               -> <SignInPage />",
          "/sign-up               -> <SignUpPage />",
        ],
        notes: [
          "보호 라우트(로그인 필요)는 AppRoutes.tsx에서 Outlet 앞에 Guard 컴포넌트를 두는 형태로 처리합니다.",
          "라우트 파일이 커지면 도메인별(communityRoutes, profileRoutes 등)로 분리 후 compose 하는 방식을 고려합니다.",
          "데이터 패칭은 React Query/SWR 등과 조합해, 페이지 컴포넌트에서 useQuery를 사용하는 패턴이 일반적입니다.",
        ],
      },
    ],
  },
];

const COMPARISON_NOTES: { title: string; items: string[] }[] = [
  {
    title: "라우팅 및 구조",
    items: [
      "Next.js는 디렉터리 구조와 파일명만으로 라우트가 자동 생성되어, 페이지 추가/이동 시 규칙이 단순합니다.",
      "CRA/React Router는 라우트 구성이 코드(AppRoutes.tsx)에 모이므로, 조건부 라우팅·권한 제어를 세밀하게 표현하기 쉽습니다.",
      "부트캠프 커뮤니티처럼 도메인(커뮤니티/작품/프로필)이 명확한 서비스에서는 두 스택 모두 URL 설계 자체는 크게 다르지 않습니다.",
    ],
  },
  {
    title: "렌더링 전략 및 성능",
    items: [
      "Next.js는 기본적으로 SSR/SSG를 활용할 수 있어, 퍼블릭 피드·프로필 페이지의 초기 표시 속도와 SEO에 유리합니다.",
      "CRA/React는 CSR 기반이라 초기 번들 크기 관리와 코드 스플리팅 설계를 잘 하지 않으면 첫 로딩이 느려질 수 있습니다.",
      "내부 사용자 위주의 도구형 서비스라면 CSR만으로도 충분한 경우가 많아, 구현 단순성을 우선할 수 있습니다.",
    ],
  },
  {
    title: "팀 경험 및 운영",
    items: [
      "Next.js는 학습해야 할 개념(App Router, 서버 컴포넌트, Route Handler 등)이 더 많지만, 통합된 빌드/배포 경험을 제공합니다.",
      "CRA/React는 설정과 라이브러리 선택의 자유도가 높아, 프로젝트마다 구조가 달라질 위험이 있는 대신 유연합니다.",
      "장기적으로 디자인 시스템·공통 레이아웃·접근성 등을 표준화할 계획이 있다면 Next.js의 의견이 있는 구조가 도움이 될 수 있습니다.",
    ],
  },
  {
    title: "이 프로젝트 관점에서의 1차 제안",
    items: [
      "포트폴리오 공개·프로필 공유·커뮤니티 글 공유 등 퍼블릭 페이지 비중이 높다면 Next.js 안을 기본값으로 두는 것이 적합합니다.",
      "반대로, 초기에는 닫힌 베타 사용자 위주로 빠르게 기능을 검증하고 싶다면 CRA/React 안이 진입 장벽이 더 낮을 수 있습니다.",
      "최종 선택은 BE 스택, 배포 환경, 팀의 경험치를 함께 고려해 사람 PM/팀이 결정해야 하며, 본 문서는 그 전 단계의 설계 초안입니다.",
    ],
  },
];

interface StackTemplateCardProps {
  template: StackTemplate;
}

const StackTemplateCard: React.FC<StackTemplateCardProps> = ({ template }) => {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-3 flex flex-col gap-2 sm:mb-4">
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          {template.label}
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">{template.summary}</p>
      </header>

      <section aria-label="적합한 상황 및 비추천 상황" className="mb-4 grid gap-4 rounded-xl bg-slate-50 p-3 sm:grid-cols-2 sm:p-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            적합한 상황
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {template.recommendedWhen.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            비추천 또는 주의
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {template.notIdealWhen.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="space-y-4 sm:space-y-5">
        {template.sections.map((section) => (
          <section
            key={section.id}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4"
          >
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              {section.title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              {section.description}
            </p>
            <div className="mt-3 rounded-lg bg-slate-900 text-[11px] leading-relaxed text-slate-50 sm:text-xs">
              <pre className="overflow-x-auto p-3 sm:p-3.5">
                <code>{section.directoryTree.join("\n")}</code>
              </pre>
            </div>
            {section.notes && section.notes.length > 0 ? (
              <div className="mt-3">
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  메모
                </h4>
                <ul className="mt-1 space-y-1 text-xs text-slate-700 sm:text-sm">
                  {section.notes.map((note) => (
                    <li key={note} className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-slate-400"
                      />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
};

const FrontendRouteStackComparisonPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50 pb-12 pt-6 sm:pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
            프론트엔드 설계 초안
          </p>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            프론트 스택별 페이지·라우트 설계 비교안
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            부트캠프 커뮤니티 웹 프로젝트를 Next.js(App Router) + Tailwind 기준과
            CRA/Vite + React Router + Tailwind 기준 두 가지 관점에서 설계했을 때의
            최소 페이지/라우트 템플릿 구조를 정리한 문서입니다. 본 내용은
            <span className="font-semibold"> 설계 초안</span>이며, 최종 스택 선택과
            상세 구조는 팀 논의를 통해 확정되어야 합니다.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-3 py-2.5 text-xs text-teal-900 sm:text-sm">
            <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-teal-800 ring-1 ring-inset ring-teal-100 sm:text-xs">
              문서 상태: 설계 초안 (팀 협의 필요)
            </span>
            <span className="text-[11px] text-teal-900/80 sm:text-xs">
              목적: 스택별 페이지/라우트 구조를 먼저 비교·시각화하여, 이후 디자인·백엔드와의
              인터페이스 논의 기반 마련
            </span>
          </div>
        </header>

        <section
          aria-label="스택별 템플릿 비교"
          className="grid gap-5 lg:grid-cols-2 lg:gap-6"
        >
          {STACK_TEMPLATES.map((template) => (
            <StackTemplateCard key={template.id} template={template} />
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            스택 선택 요약 메모
          </h2>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm">
            아래 메모는 두 설계안을 비교할 때 참고할 수 있는 관점들입니다. 실제 결정 시에는
            팀의 경험, 배포 환경, 백엔드 아키텍처, 향후 확장 계획을 함께 고려해야 합니다.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {COMPARISON_NOTES.map((noteSection) => (
              <article
                key={noteSection.title}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700 sm:text-sm">
                  {noteSection.title}
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-700 sm:text-sm">
                  {noteSection.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-4 text-[11px] text-slate-500 sm:text-xs">
            이 문서는 프론트엔드 관점에서의 라우트·페이지 구조 초안을 제안하는 수준까지이며,
            실제 API 스펙, 인증 흐름, 디자인 시스템 적용 방식 등은 별도 문서/회의에서 구체화해야
            합니다.
          </p>
        </section>
      </div>
    </main>
  );
};

export default FrontendRouteStackComparisonPage;
