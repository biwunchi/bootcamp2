import type { ReactNode } from "react";

type SetupTaskStatus = "done" | "in-progress" | "todo";

interface SetupTask {
  id: string;
  title: string;
  status: SetupTaskStatus;
  description: string;
}

interface UiStatePreview {
  id: string;
  label: string;
  description: string;
  body: ReactNode;
}

// NOTE:
// - setupTasks, uiStatePreviews 는 현재 온보딩용 정적 mock 데이터입니다.
// - 실제 기능 개발 시, API/스토어(예: React Query, SWR)로 교체합니다.
const setupTasks: SetupTask[] = [
  {
    id: "stack",
    title: "FE 기술 스택 결정",
    status: "done",
    description: "Next.js App Router + TypeScript + Tailwind CSS 조합으로 결정.",
  },
  {
    id: "structure",
    title: "기본 폴더 구조 / 레이아웃",
    status: "done",
    description:
      "app/ 기반 라우팅과 공통 헤더/푸터를 제공하는 RootLayout 초안 구성.",
  },
  {
    id: "tailwind",
    title: "Tailwind CSS 기본 세팅",
    status: "in-progress",
    description:
      "tailwind.config, globals.css 정리 및 디자인 토큰 협의 필요 (현재 임시값).",
  },
  {
    id: "lint-format",
    title: "Lint / 포맷터 규칙 정리",
    status: "todo",
    description:
      "ESLint + Prettier 규칙 합의 및 VSCode 설정 공유 (팀 논의 후 진행).",
  },
];

const STATUS_CONFIG: Record<
  SetupTaskStatus,
  { label: string; className: string }
> = {
  done: {
    label: "완료",
    className: "bg-teal-50 text-teal-700 ring-teal-200",
  },
  "in-progress": {
    label: "진행 중",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  todo: {
    label: "예정",
    className: "bg-slate-50 text-slate-600 ring-slate-200",
  },
};

const uiStatePreviews: UiStatePreview[] = [
  {
    id: "loading",
    label: "Loading",
    description: "데이터 조회 전, 스켈레톤 기반 로딩 상태.",
    body: (
      <div className="space-y-2" aria-hidden>
        <div className="h-2 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-2 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-2 w-20 animate-pulse rounded bg-slate-200" />
      </div>
    ),
  },
  {
    id: "empty",
    label: "Empty",
    description: "목록이 비어 있을 때, 다음 행동을 안내합니다.",
    body: (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
        아직 게시물이 없습니다.
        <br />
        첫 번째 프로젝트나 글을 등록해 보세요.
      </div>
    ),
  },
  {
    id: "error",
    label: "Error",
    description: "네트워크/서버 오류 시 재시도 버튼 제공.",
    body: (
      <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
        데이터를 불러오지 못했습니다.
        <button
          type="button"
          className="ml-2 inline-flex items-center rounded border border-red-200 bg-white px-2 py-0.5 text-[11px] font-medium text-red-700 hover:bg-red-50"
        >
          다시 시도
        </button>
      </div>
    ),
  },
  {
    id: "auth",
    label: "Auth",
    description: "로그인이 필요한 섹션에 대한 안내.",
    body: (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700">
        이 기능은 로그인한 사용자만 사용할 수 있습니다.
        <span className="mt-1 block text-[11px] text-slate-500">
          추후 인증 방식(JWT, OAuth 등) 결정 후 실제 로그인 플로우와 연동합니다.
        </span>
      </div>
    ),
  },
];

function StatusBadge({ status }: { status: SetupTaskStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function UiStateGrid() {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      {uiStatePreviews.map((state) => (
        <article
          key={state.id}
          className="flex flex-col rounded-lg border border-slate-200 bg-white px-3 py-2"
        >
          <h3 className="text-xs font-semibold text-slate-900">
            {state.label}
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">{state.description}</p>
          <div className="mt-2 text-[11px]">{state.body}</div>
        </article>
      ))}
    </div>
  );
}

// NOTE:
// - 이 페이지는 팀원 온보딩 및 FE 상태 공유를 위한 임시 홈 화면입니다.
// - 실제 제품 홈/피드 디자인이 확정되면 해당 시안에 맞춰 대체합니다.
export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="app-card p-4 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
          FE bootstrap
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          부트캠프 커뮤니티 프론트엔드 초기 세팅
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          이 화면은 Next.js App Router + TypeScript + Tailwind CSS 기준의 초기
          스캐폴딩입니다. 팀 합류자가 현재 FE 상태와 다음 작업을 빠르게 이해할
          수 있도록 설계되었습니다.
        </p>

        <dl className="mt-4 grid gap-4 text-xs text-slate-600 sm:grid-cols-3">
          <div>
            <dt className="font-semibold text-slate-900">Framework</dt>
            <dd className="mt-1">Next.js (App Router) · Server/Client Component 혼합.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Language & UI</dt>
            <dd className="mt-1">TypeScript · React · Tailwind CSS 기반 유틸리티 클래스.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Design 상태</dt>
            <dd className="mt-1">
              라이트 SaaS 톤 임시 적용. 실제 디자인/DS는 별도 협의 후 반영 예정.
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="app-card p-4 md:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="app-section-title">FE 초기 세팅 체크리스트</h2>
              <p className="app-section-subtitle mt-1">
                GitHub 이슈/프로젝트 보드와 매핑할 예정인 기본 작업 목록입니다.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500">
              임시 데이터 · 코드 내에서만 사용
            </span>
          </div>

          <ul className="mt-4 space-y-3">
            {setupTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-900">
                    {task.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    {task.description}
                  </p>
                </div>
                <StatusBadge status={task.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="app-card p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="app-section-title">다음 제안 작업</h2>
              <p className="app-section-subtitle mt-1">
                실제 진행 여부는 PM/팀 논의 후 결정합니다.
              </p>
            </div>
          </div>

          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-600">
            <li>ESLint/Prettier 규칙 정리 및 공통 VSCode 설정 공유</li>
            <li>라우팅 구조 초안 설계 (홈, 커뮤니티 피드, 마이페이지 등)</li>
            <li>공통 레이아웃 컴포넌트 분리 (Navbar, Footer, PageShell 등)</li>
            <li>mock API/JSON 기반 리스트 화면 1개 시범 구현</li>
          </ul>
        </div>
      </section>

      <section className="app-card p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="app-section-title">데이터 상태 UI 미리보기</h2>
            <p className="app-section-subtitle mt-1">
              향후 커뮤니티 피드/게시글 목록에서 사용할 로딩 · 빈 상태 · 오류 ·
              인증 필요 UI 패턴의 초안입니다.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-500">
            mock 전용 · 실제 API 연결 시 교체 예정
          </span>
        </div>

        <UiStateGrid />
      </section>
    </div>
  );
}
