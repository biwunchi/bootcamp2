import Link from 'next/link';

import type { AppRouteCategory, RouteStatus } from './routes-config';
import { SITEMAP_ROUTES } from './routes-config';

const CATEGORY_LABELS: Record<AppRouteCategory, string> = {
  community: '커뮤니티 / 피드',
  portfolio: '포트폴리오 / 작품',
  auth: '인증 / 온보딩',
  etc: '기타 / 공통',
};

const STATUS_LABELS: Record<RouteStatus, string> = {
  ready: '화면 뼈대 구현 완료',
  planned: '경로만 정의 (추가 구현 필요)',
};

const STATUS_BADGE_CLASSES: Record<RouteStatus, string> = {
  ready: 'bg-teal-50 text-teal-700 ring-teal-100',
  planned: 'bg-slate-50 text-slate-600 ring-slate-100',
};

export default function HomePage() {
  const orderedCategories: AppRouteCategory[] = [
    'community',
    'portfolio',
    'auth',
    'etc',
  ];

  return (
    <div className="space-y-8 py-4">
      <section className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
          MVP Screen & Routing
        </p>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          부트캠프 커뮤니티 MVP 화면 구성 (임시 홈 화면)
        </h1>
        <p className="text-sm leading-relaxed text-slate-600">
          이 페이지는 합의된 핵심 플로우를 기반으로 한
          <span className="font-semibold"> 화면 목록과 라우팅 설계</span>를
          코드로 정리한 임시 홈 화면입니다. 실제 디자인·기능은 팀 협의 후 각
          페이지에서 단계적으로 구현됩니다.
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
          <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">
            ✅ TypeScript + Next.js App Router
          </span>
          <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">
            ✅ Tailwind 기반 라이트 SaaS 톤 (임시)
          </span>
          <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">
            ✅ 페이지 구조/권한/상태 설계용
          </span>
        </div>
      </section>

      {orderedCategories.map((category) => {
        const routes = SITEMAP_ROUTES.filter(
          (route) => route.category === category,
        );

        if (routes.length === 0) return null;

        return (
          <section key={category} className="space-y-3">
            <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                {CATEGORY_LABELS[category]}
              </h2>
              <p className="text-xs text-slate-500">
                이 영역의 화면과 라우팅은 가정 기반 초안이며, 팀 합의 후 수정될 수
                있습니다.
              </p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2">
              {routes.map((route) => (
                <article
                  key={route.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {route.label}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${STATUS_BADGE_CLASSES[route.status]}`}
                      >
                        {STATUS_LABELS[route.status]}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600">
                      {route.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <code className="rounded bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-700 ring-1 ring-slate-200">
                        {route.path}
                      </code>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>
                          {route.requiresAuth
                            ? '로그인 후 접근 (requiresAuth)'
                            : '비로그인 열람 가능'}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    {route.status === 'ready' ? (
                      <Link
                        href={route.path}
                        className="inline-flex items-center gap-1 rounded-full bg-teal-500 px-3 py-1 font-medium text-white shadow-sm hover:bg-teal-600"
                      >
                        <span>화면으로 이동</span>
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 font-medium text-slate-500 ring-1 ring-dashed ring-slate-200">
                        <span>추후 구현 예정</span>
                        <span className="text-[10px]"></span>
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400">
                      이 카드는 설계용이며, 실제 UX는 화면 구현 단계에서 조정됩니다.
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
