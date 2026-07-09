import React from "react";

/**
 * 메인 피드 컴포넌트 구조 메모 (v0 초안)
 *
 * ⚠️ DS 메인 피드 HTML 목업 v0 실제 파일은 이 코드가 직접 보지 못한 상태입니다.
 *    → 여기 정의된 구조/컴포넌트 분리는 "일반적인 포트폴리오 피드" 패턴을 기준으로 한 제안입니다.
 *    → DS/PM이 실제 목업과 비교해서 조정/확정한 뒤, status 값을 갱신해 주세요.
 *
 * 이 파일의 목적
 * - 메인 피드 페이지를 어떤 React 컴포넌트들로 나눌지 초안 트리를 공유
 * - 레이아웃 안(A/B)과 뷰포트별 구조 차이를 한 눈에 볼 수 있도록 정리
 * - FE/BE/DS 사이에서 공통 언어로 쓸 수 있는 "컴포넌트 이름"을 먼저 합의하기 위함
 *
 * 구현/사용 방식
 * - 이 컴포넌트는 문서용 페이지입니다. /app/(docs)/main-feed-structure/page.tsx 등으로 옮겨 사용할 수 있습니다.
 * - 실제 메인 피드 UI 구현 시, 여기 정의된 컴포넌트 이름과 역할을 참고하여 폴더/파일을 설계합니다.
 */

type DecisionStatus = "confirmed" | "assumption" | "open";

type LayoutArea = "shell" | "header" | "main" | "sidebar" | "footer" | "overlay";

type ComponentKind =
  | "route"
  | "layout"
  | "section"
  | "card"
  | "control"
  | "state"
  | "composite";

interface ComponentNode {
  id: string;
  name: string;
  kind: ComponentKind;
  layoutArea: LayoutArea;
  status: DecisionStatus;
  description: string;
  notes?: string;
  /** 하위 섹션/컴포넌트 */
  children?: ComponentNode[];
}

interface LayoutVariant {
  id: "A" | "B";
  name: string;
  summary: string;
  description: string;
  status: DecisionStatus;
  pros: string[];
  cons: string[];
}

const STATUS_LABEL: Record<DecisionStatus, string> = {
  confirmed: "결정됨 (DS/PM 확정)",
  assumption: "가정 (DS 목업 기반 추정)",
  open: "미결정 (논의 필요)",
};

const STATUS_CLASS: Record<DecisionStatus, string> = {
  confirmed:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-200",
  assumption:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-900/30 dark:text-sky-200",
  open:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-900/30 dark:text-amber-200",
};

const AREA_LABEL: Record<LayoutArea, string> = {
  shell: "Shell (페이지 전체 뼈대)",
  header: "Header", 
  main: "Main", 
  sidebar: "Sidebar", 
  footer: "Footer", 
  overlay: "Overlay / Drawer",
};

const AREA_CLASS: Record<LayoutArea, string> = {
  shell:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200",
  header:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
  main:
    "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
  sidebar:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
  footer:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200",
  overlay:
    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200",
};

const KIND_LABEL: Record<ComponentKind, string> = {
  route: "Route/Page",
  layout: "Layout",
  section: "Section",
  card: "Card",
  control: "Control/UI",
  state: "State UI",
  composite: "Composite",
};

const LAYOUT_VARIANTS: LayoutVariant[] = [
  {
    id: "A",
    name: "3-컬럼: 좌측 내비 + 메인 피드 + 우측 추천 (데스크톱 기준)",
    summary:
      "가장 익숙한 커뮤니티 레이아웃. 데스크톱에서는 3-컬럼, 모바일에서는 메인 피드 + 하단 내비 중심.",
    description:
      "좌측은 전역 내비게이션(피드, 검색, 업로드, 마이페이지 등), 중앙은 작품 피드, 우측은 추천/공지/태그 카드로 구성합니다. 모바일에서는 좌측/우측을 접고, 하단 탭 내비게이션 + 상단 필터 바만 남깁니다.",
    status: "assumption",
    pros: [
      "사용자에게 익숙한 구조 (Behance / Dribbble / 커뮤니티 패턴과 유사)",
      "우측 컬럼을 활용해 부트캠프 공지, 추천 태그 등을 노출하기 좋음",
      "메인 피드 카드 밀도를 높게 가져가도 정보 구조가 무너지지 않음",
    ],
    cons: [
      "데스크톱에서만 3-컬럼, 모바일에서는 대부분 접히므로 구현 시 반응형 고려가 필요",
      "초기 버전에서는 우측 컬럼에 넣을 데이터가 부족할 경우 허전해 보일 수 있음",
    ],
  },
  {
    id: "B",
    name: "2-컬럼: 메인 피드 + 필터/추천 통합 사이드 (데스크톱 기준)",
    summary:
      "보다 단순한 2-컬럼 구조. 필터/정렬과 추천 영역을 우측 사이드바에 통합.",
    description:
      "상단에는 탭/필터 바를 전역으로 두고, 콘텐츠는 메인 피드와 우측 사이드바(필터, 추천 카드)로 나눕니다. 모바일에서는 우측 사이드바를 상단/하단의 슬라이드 인 필터 드로어로 대체합니다.",
    status: "assumption",
    pros: [
      "구현 복잡도가 상대적으로 낮음 (전역 좌측 내비 별도 구현을 뒤로 미룰 수 있음)",
      "초기 데이터가 적더라도 2-컬럼이라 레이아웃이 덜 비어 보임",
    ],
    cons: [
      "좌측 전역 내비를 다른 페이지와 공유하기 어렵고, 나중에 리팩터링 필요할 수 있음",
      "필터/정렬 요소가 많아지면 우측 사이드바가 다소 복잡해질 수 있음",
    ],
  },
];

const MAIN_FEED_COMPONENT_TREE: ComponentNode[] = [
  {
    id: "app-shell",
    name: "AppShellLayout",
    kind: "layout",
    layoutArea: "shell",
    status: "assumption",
    description:
      "전역 레이아웃. 헤더/푸터/좌측 내비/하단 내비 등 공통 요소를 감싸고, 메인 콘텐츠 영역에 메인 피드 페이지를 렌더링합니다.",
    notes:
      "Next.js App Router 기준 app/(main)/layout.tsx 등에 위치할 수 있음. 이미 전역 레이아웃이 있다면 그 안에 메인 피드를 넣는 방향으로 조정.",
    children: [
      {
        id: "global-header",
        name: "GlobalHeader",
        kind: "section",
        layoutArea: "header",
        status: "assumption",
        description:
          "상단 헤더. 서비스 로고, 전역 검색, 업로드 CTA, 알림/프로필 메뉴 등을 포함.",
        notes:
          "목업 v0에 어떤 요소가 있는지 확인 후, 검색/업로드 버튼 위치를 확정 필요.",
      },
      {
        id: "global-sidebar-nav",
        name: "GlobalSidebarNav",
        kind: "section",
        layoutArea: "sidebar",
        status: "assumption",
        description:
          "데스크톱 기준 좌측 내비게이션. 피드, 검색, 업로드, 마이페이지, 설정 등 주요 메뉴.",
        notes:
          "레이아웃 안 A(3-컬럼)에서는 항상 노출, B(2-컬럼)에서는 후순위로 구현하거나 생략 가능.",
      },
      {
        id: "global-bottom-nav",
        name: "GlobalBottomNav",
        kind: "section",
        layoutArea: "footer",
        status: "assumption",
        description:
          "모바일 전용 하단 내비게이션. 한 손 조작을 위해 피드, 검색, 업로드, 마이페이지 등 핵심 탭 제공.",
        notes:
          "목업 v0에 모바일 시안이 있다면 탭 구성 및 아이콘 스타일을 맞춰야 함.",
      },
      {
        id: "global-footer",
        name: "GlobalFooter",
        kind: "section",
        layoutArea: "footer",
        status: "assumption",
        description:
          "전역 푸터. 저작권 정보, 간단한 링크 등을 포함 (필요 시).",
      },
    ],
  },
  {
    id: "main-feed-route",
    name: "MainFeedPage (app/(main)/feed/page.tsx 가정)",
    kind: "route",
    layoutArea: "main",
    status: "assumption",
    description:
      "메인 피드 라우트 엔트리. 데이터 패칭(서버 컴포넌트)과 레이아웃 구성을 담당.",
    notes:
      "실제 라우트 경로는 PM/BE와 협의 필요 (/feed, /, /home 등). 서버 컴포넌트로 구현하고, 카드 내 인터랙션은 클라이언트 컴포넌트 분리.",
    children: [
      {
        id: "main-feed-layout-grid",
        name: "MainFeedLayoutGrid",
        kind: "layout",
        layoutArea: "main",
        status: "assumption",
        description:
          "메인 피드 페이지 내부의 그리드 레이아웃. 데스크톱 기준 메인 피드 컬럼 + 우측 사이드바, 모바일 기준 단일 컬럼.",
        notes:
          "레이아웃 안 A/B 모두 여기서 구현 가능. CSS 그리드 또는 flex를 사용해 반응형 분기.",
        children: [
          {
            id: "main-feed-header-section",
            name: "MainFeedHeaderSection",
            kind: "section",
            layoutArea: "main",
            status: "assumption",
            description:
              "메인 피드 상단 타이틀/설명/간단한 통계를 보여주는 영역. 예: '부트캠프 디자이너 피드', 오늘 등록된 작품 수.",
          },
          {
            id: "main-feed-filter-bar",
            name: "MainFeedFilterBar",
            kind: "section",
            layoutArea: "main",
            status: "assumption",
            description:
              "탭/정렬/태그 필터를 모으는 상단 컨트롤 바. 모바일에서는 상단에 고정되거나, 일부 요소를 드로어로 이동.",
            children: [
              {
                id: "feed-scope-tabs",
                name: "FeedScopeTabs",
                kind: "control",
                layoutArea: "main",
                status: "assumption",
                description:
                  "피드 범위 탭. 예: 전체, 팔로잉, 인기, 내 부트캠프 등. DS 목업의 탭 구성에 맞춰 실제 라벨/개수를 조정.",
              },
              {
                id: "feed-sort-select",
                name: "FeedSortSelect",
                kind: "control",
                layoutArea: "main",
                status: "assumption",
                description:
                  "정렬 선택 컨트롤. 예: 최신순, 인기순, 댓글 많은 순 등. 드롭다운 또는 Segmented Control.",
              },
              {
                id: "feed-tag-filter-chips",
                name: "FeedTagFilterChips",
                kind: "control",
                layoutArea: "main",
                status: "assumption",
                description:
                  "스크롤 가능한 태그/카테고리 칩 리스트. 디자인 툴, 직무, 난이도 등으로 필터링.",
                notes:
                  "모바일에서는 수평 스크롤 칩, 데스크톱에서는 2줄까지 허용 등 세부 UX는 DS와 협의.",
              },
            ],
          },
          {
            id: "feed-content-and-sidebar",
            name: "FeedContentAndSidebar",
            kind: "layout",
            layoutArea: "main",
            status: "assumption",
            description:
              "메인 피드 카드 리스트와 우측 추천/공지 사이드 영역을 감싸는 레이아웃.",
            notes:
              "모바일에서는 사이드바를 아래쪽이나 드로어로 이동. 데스크톱에서는 2~3 컬럼.",
            children: [
              {
                id: "feed-work-list-section",
                name: "FeedWorkListSection",
                kind: "section",
                layoutArea: "main",
                status: "assumption",
                description:
                  "실제 작품 카드들이 그리드 또는 리스트 형태로 렌더링되는 메인 영역.",
                children: [
                  {
                    id: "feed-work-list",
                    name: "FeedWorkList",
                    kind: "composite",
                    layoutArea: "main",
                    status: "assumption",
                    description:
                      "작품 카드(WorkCard)의 리스트/그리드를 렌더링하는 컨테이너. 무한 스크롤 또는 페이지네이션을 포함.",
                    notes:
                      "데이터 로딩/에러/빈 상태를 포함한 상태 관리가 들어갈 예정. 서버 컴포넌트 + 클라이언트 래퍼 조합 고려.",
                    children: [
                      {
                        id: "work-card",
                        name: "WorkCard",
                        kind: "card",
                        layoutArea: "main",
                        status: "assumption",
                        description:
                          "개별 작품을 보여주는 카드 컴포넌트. 썸네일, 제목, 작성자, 태그, 좋아요/댓글 수, 저장 버튼 등을 포함.",
                        notes:
                          "메인 피드 외에 프로필, 검색 결과 등에서도 재사용될 수 있도록 최대한 범용적으로 설계.",
                        children: [
                          {
                            id: "work-card-header",
                            name: "WorkCardHeader",
                            kind: "section",
                            layoutArea: "main",
                            status: "assumption",
                            description:
                              "작성자 아바타/닉네임, 부트캠프/트랙 정보, 업로드 일시 등을 표시.",
                          },
                          {
                            id: "work-card-thumbnail",
                            name: "WorkCardThumbnail",
                            kind: "section",
                            layoutArea: "main",
                            status: "assumption",
                            description:
                              "대표 썸네일 이미지 또는 썸네일 그리드. hover 시 살짝 확대/그림자 효과 등 시각적 피드백.",
                          },
                          {
                            id: "work-card-meta",
                            name: "WorkCardMeta",
                            kind: "section",
                            layoutArea: "main",
                            status: "assumption",
                            description:
                              "작품 제목, 한 줄 설명, 사용 툴/태그 등을 표시.",
                          },
                          {
                            id: "work-card-actions",
                            name: "WorkCardActions",
                            kind: "control",
                            layoutArea: "main",
                            status: "assumption",
                            description:
                              "좋아요, 댓글 수, 저장(북마크), 공유 등의 인터랙션 버튼.",
                          },
                        ],
                      },
                      {
                        id: "feed-empty-state",
                        name: "FeedEmptyState",
                        kind: "state",
                        layoutArea: "main",
                        status: "assumption",
                        description:
                          "필터 결과가 없거나 아직 작품이 없을 때 보여주는 빈 상태 UI.",
                      },
                      {
                        id: "feed-loading-skeleton",
                        name: "FeedLoadingSkeleton",
                        kind: "state",
                        layoutArea: "main",
                        status: "assumption",
                        description:
                          "피드 최초 로딩/페이지 전환 시 보여줄 스켈레톤 카드들.",
                      },
                      {
                        id: "feed-error-state",
                        name: "FeedErrorState",
                        kind: "state",
                        layoutArea: "main",
                        status: "assumption",
                        description:
                          "네트워크 오류 또는 서버 오류 발생 시 사용자에게 안내하고 재시도 버튼을 제공.",
                      },
                    ],
                  },
                ],
              },
              {
                id: "feed-sidebar-section",
                name: "FeedSidebarSection",
                kind: "section",
                layoutArea: "sidebar",
                status: "assumption",
                description:
                  "메인 피드 우측에 위치한 추천/공지/태그 영역. 데스크톱 전용 또는 모바일에서는 아래쪽에 순차 배치.",
                children: [
                  {
                    id: "feed-cta-upload-card",
                    name: "FeedUploadCtaCard",
                    kind: "card",
                    layoutArea: "sidebar",
                    status: "assumption",
                    description:
                      "작품 업로드를 유도하는 CTA 카드. '첫 작품 올리기', '새 프로젝트 올리기' 등의 버튼 포함.",
                  },
                  {
                    id: "feed-trending-tags-card",
                    name: "FeedTrendingTagsCard",
                    kind: "card",
                    layoutArea: "sidebar",
                    status: "assumption",
                    description:
                      "최근 많이 사용된 태그/툴/주제를 보여주는 카드. 클릭 시 해당 태그로 필터링.",
                  },
                  {
                    id: "feed-recommended-creators-card",
                    name: "FeedRecommendedCreatorsCard",
                    kind: "card",
                    layoutArea: "sidebar",
                    status: "assumption",
                    description:
                      "팔로우를 추천하는 디자이너/동료 목록. 아바타, 닉네임, 간단한 태그 표시.",
                  },
                  {
                    id: "feed-bootcamp-notice-card",
                    name: "FeedBootcampNoticeCard",
                    kind: "card",
                    layoutArea: "sidebar",
                    status: "assumption",
                    description:
                      "부트캠프 공지/이벤트/모집 안내를 보여주는 카드. 관리자 전용 작성 권한이 있을 수 있음.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "feed-mobile-filter-drawer",
    name: "FeedMobileFilterDrawer",
    kind: "overlay",
    layoutArea: "overlay",
    status: "assumption",
    description:
      "모바일 전용 필터/정렬 드로어. 상단 또는 하단에서 슬라이드 인되며, 태그/정렬/범위 필터를 한 곳에서 조정.",
    notes:
      "초기 버전에서는 구현을 뒤로 미루고, 상단 필터 바만으로도 출시할 수 있음. DS 모바일 시안에 따라 우선순위 결정.",
  },
];

interface ComponentTreeNodeProps {
  node: ComponentNode;
  depth?: number;
}

const ComponentTreeNode: React.FC<ComponentTreeNodeProps> = ({ node, depth = 0 }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li className="relative pl-4">
      {depth > 0 && (
        <span
          className="absolute left-0 top-3 h-full w-px bg-slate-200 dark:bg-slate-700"
          aria-hidden="true"
        />
      )}
      <div className="mb-1 inline-flex flex-col gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-medium text-slate-900 dark:text-slate-50">{node.name}</div>
          <div className="flex flex-wrap items-center gap-1">
            <span
              className={
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-700 dark:text-slate-200 " +
                AREA_CLASS[node.layoutArea]
              }
            >
              {AREA_LABEL[node.layoutArea]}
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
              {KIND_LABEL[node.kind]}
            </span>
            <span
              className={
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
                STATUS_CLASS[node.status]
              }
            >
              {STATUS_LABEL[node.status]}
            </span>
          </div>
        </div>
        <p className="mt-1 text-[13px] leading-snug text-slate-600 dark:text-slate-300">
          {node.description}
        </p>
        {node.notes && (
          <p className="mt-1 text-[12px] leading-snug text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-200">메모: </span>
            {node.notes}
          </p>
        )}
      </div>
      {hasChildren && (
        <ul className="ml-4 flex list-none flex-col gap-2 border-l border-dashed border-slate-200 pl-2 dark:border-slate-700">
          {node.children?.map((child) => (
            <ComponentTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const MainFeedStructureMemo: React.FC = () => {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
          FE 구조 메모 · 메인 피드 v0
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          메인 피드 컴포넌트 분리 & 레이아웃 구조 메모 (초안)
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          DS가 제공한 HTML 목업 v0를 기준으로 할 예정이지만, 이 문서는 현재 목업 파일을 직접 참조하지 않고
          일반적인 포트폴리오 피드 패턴을 바탕으로 작성된 초안입니다. 실제 시안과 비교하여 컴포넌트 이름과 구조를
          조정한 뒤, 각 항목의 상태(결정됨/가정/미결정)를 업데이트해 주세요.
        </p>
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800/80 dark:bg-amber-900/20 dark:text-amber-100">
          <p className="font-semibold">주의 · DS 시안 기반 여부</p>
          <p className="mt-1">
            이 메모에 정의된 컴포넌트/레이아웃은 모두 <span className="font-semibold">가정(assumption)</span>
            으로 표기되어 있습니다. DS/PM이 실제 메인 피드 HTML 목업 v0를 공유해 주면, 구조를 맞춰보고
            필요한 컴포넌트만 남기는 작업이 한 번 필요합니다.
          </p>
        </div>
      </header>

      <section aria-labelledby="layout-variants-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2
            id="layout-variants-heading"
            className="text-base font-semibold text-slate-900 dark:text-slate-50"
          >
            1. 레이아웃 안 (제안 2안)
          </h2>
          <span className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            결정 방식: DS/PM 협의 후 1안 선택 또는 혼합
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {LAYOUT_VARIANTS.map((variant) => (
            <article
              key={variant.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
                      {variant.id}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {variant.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{variant.summary}</p>
                </div>
                <span
                  className={
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
                    STATUS_CLASS[variant.status]
                  }
                >
                  {STATUS_LABEL[variant.status]}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {variant.description}
              </p>
              <div className="grid gap-2 text-xs text-slate-600 dark:text-slate-300 md:grid-cols-2">
                <div>
                  <p className="font-semibold text-teal-700 dark:text-teal-300">장점</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4">
                    {variant.pros.map((pro) => (
                      <li key={pro}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-rose-700 dark:text-rose-300">주의점</p>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4">
                    {variant.cons.map((con) => (
                      <li key={con}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="component-tree-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2
            id="component-tree-heading"
            className="text-base font-semibold text-slate-900 dark:text-slate-50"
          >
            2. 메인 피드 컴포넌트 트리 (제안)
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            상단에서 하단으로 내려갈수록 더 구체적인 컴포넌트
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          각 카드에는 <span className="font-semibold">레이아웃 영역(Shell/Header/Main/Sidebar/Overlay)</span>,
          <span className="font-semibold">컴포넌트 종류(Route/Layout/Card 등)</span>,
          <span className="font-semibold">상태(결정됨/가정/미결정)</span>이 표시됩니다. DS HTML 목업 v0와 비교하여
          실제로 존재하는 블록만 남기고, 이름을 맞춰가는 용도로 사용해 주세요.
        </p>
        <ul className="mt-2 flex list-none flex-col gap-3">
          {MAIN_FEED_COMPONENT_TREE.map((node) => (
            <ComponentTreeNode key={node.id} node={node} depth={0} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="next-steps-heading" className="space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
        <h2
          id="next-steps-heading"
          className="text-sm font-semibold text-slate-900 dark:text-slate-50"
        >
          3. 다음 단계 제안 (사람 팀 논의용)
        </h2>
        <ol className="list-decimal space-y-1 pl-5 text-slate-600 dark:text-slate-300">
          <li>
            DS 메인 피드 HTML 목업 v0와 이 트리를 나란히 보면서, 실제로 존재하는 블록/섹션을 체크하고{' '}
            <span className="font-semibold">이름과 개수</span>를 맞춥니다.
          </li>
          <li>
            레이아웃 안 <span className="font-semibold">A/B 중 1안을 선택</span>하거나, 혼합해서 사용할 경우 어떤 뷰포트에서
            어떤 구조를 채택할지 결정합니다.
          </li>
          <li>
            결정된 컴포넌트에 대해서는 <span className="font-semibold">status를 confirmed</span>로 변경하고, 구현 우선순위에 따라
            별도의 FE 작업 티켓으로 쪼갭니다. (예: WorkCard 먼저, 그 다음 FeedWorkList 등)
          </li>
        </ol>
      </section>
    </main>
  );
};

export default MainFeedStructureMemo;
