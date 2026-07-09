# CI/CD & 인프라 체크리스트 (초안)

> 스택 가정: **Vercel (웹 호스팅) + Supabase (DB/Auth/스토리지)**
>
> 이 문서는 Bootcamp Community 웹 앱의 **배포 파이프라인 초안**과
> **환경변수 / 보안 체크리스트**를 정리한 OPS 관점 문서입니다.
> 실제 인프라 연결(Vercel 프로젝트 생성, Supabase 프로젝트 생성, 도메인 연결 등)은
> 팀/사람의 승인 이후에 진행해야 합니다.

---

## 0. 가정 / 미결정 사항

- 가정
  - 프런트엔드: Node.js 기반 SPA/SSR 프레임워크(Next.js, Vite 등) 중 하나 사용
  - 코드 품질 스크립트: `npm run lint`, `npm run typecheck`, `npm run build` 존재 (없다면 추가 필요)
  - 호스팅: GitHub 저장소 ↔ Vercel Git 연동으로 자동 빌드/배포
  - 백엔드/DB: Supabase (PostgreSQL + Auth + Storage)
- 미결정 (사람 팀이 결정 필요)
  - 정확한 프런트엔드 프레임워크 및 빌드 명령어
  - 모니터링/로깅 도구(Sentry, Posthog, Logflare 등) 사용 여부
  - 업로드 파일 최대 용량/형식 정책
  - Production 배포 승인자(역할/이름)

---

## 1. 환경 구성 (Environments)

- **local (개발자 로컬)**
  - 목적: 기능 개발, UI/UX 실험
  - 실행: `npm run dev` 등
  - 환경변수: `.env.local` 또는 `.env` (Git에 커밋 금지)

- **preview (Vercel Preview)**
  - 목적: PR / 피처 브랜치 검증, 디자이너/PM 리뷰
  - 트리거: `feature/*` 브랜치에서 PR 생성 또는 push
  - 제공자: Vercel이 브랜치/PR 단위 Preview URL 자동 생성

- **production (Vercel Production)**
  - 목적: 실제 사용자 트래픽 처리
  - 트리거: `main` 브랜치에 머지 → Vercel이 Production 빌드/배포
  - 보호: GitHub main 브랜치 보호 + 리뷰 & CI 성공 필수

현재 상태(초안 기준):
- GitHub Actions CI 정의: `ci.yml` 파일로 **품질 게이트(타입/빌드)** 설정 초안 작성 완료
- 실제 Vercel/Supabase 프로젝트 생성 및 Production 배포: **사람 승인 후 설정 필요 (미실행 상태)**

---

## 2. 배포 파이프라인 (초안 흐름)

1. **개발자 로컬에서 작업**
   - 새 브랜치 생성: `feature/…`, `fix/…` 등
   - 로컬에서 `npm run lint`, `npm run build` 로 기본 검증

2. **GitHub에 브랜치 푸시 & PR 생성**
   - 대상 브랜치: `main`
   - GitHub Actions (`ci.yml`)이 자동 실행
     - `npm run lint --if-present`
     - `npm run typecheck --if-present`
     - `npm test --if-present`
     - `npm run build`
   - Vercel Git 연동이 설정된 경우, 해당 브랜치/PR에 대한 **Preview 배포** 자동 생성

3. **리뷰 & 승인 (Preview 단계)**
   - FE/BE/디자이너/PM이 Vercel Preview URL에서 기능/UI 확인
   - 코드 리뷰에서 최소 1인 이상 승인
   - main 브랜치 보호 규칙에 `Web CI (lint, typecheck, build)` 워크플로우 **필수 통과** 설정

4. **main 머지 → Production 배포**
   - 조건: 리뷰 승인 + CI 성공
   - main에 머지되면:
     - GitHub Actions: 동일한 품질 체크 한 번 더 수행
     - Vercel: main 기준으로 Production 빌드 & 배포
   - 이 단계가 사실상 **Production 배포 승인 게이트** 역할 수행

5. **배포 후 모니터링 & 롤백 (필요시)**
   - Health check 엔드포인트 확인 (아래 5번 참고)
   - 문제 발생 시 Vercel에서 이전 배포로 롤백 (아래 6번 참고)

---

## 3. 환경변수 매트릭스 (Vercel + Supabase)

> 실제 값은 `.env.local` / Vercel 프로젝트 설정 / Supabase 대시보드에만 저장하고,
> Git 저장소에는 **절대** 커밋하지 않습니다. 이 저장소에는 `.env.example` (샘플)만 포함합니다.

### 3.1 주요 키 목록

| Key                             | 설명                                          | 공개/비공개    | Local (.env) | Vercel Preview | Vercel Production | 비고 |
|---------------------------------|----------------------------------------------|----------------|--------------|----------------|-------------------|------|
| `NEXT_PUBLIC_APP_ENV`          | 앱 실행 환경 표기(`local`/`preview`/`prod`)  | 공개 (클라이언트) | ✅           | ✅             | ✅                | UI용 표시 |
| `NEXT_PUBLIC_SITE_URL`         | 웹 앱 기본 URL                               | 공개           | ✅           | ✅             | ✅                | 링크 생성 등에 사용 |
| `NEXT_PUBLIC_SUPABASE_URL`     | Supabase 프로젝트 URL                        | 공개           | ✅           | ✅             | ✅                | Supabase 대시보드 > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase 익명(anon) 키                        | 공개(토큰이지만 브라우저용) | ✅ | ✅             | ✅                | 브라우저에서 사용, 권한은 RLS로 제한 |
| `SUPABASE_SERVICE_ROLE_KEY`    | Supabase 서비스 롤 키 (최고 권한)            | **비공개(서버 전용)** | ✅ (로컬 서버) | ✅             | ✅                | 절대 `NEXT_PUBLIC_` 사용 금지 |
| `SUPABASE_DB_PASSWORD`         | DB 접속 비밀번호 (필요 시)                   | 비공개         | ✅           | ✅             | ✅                | 가능하면 서버 관리/마이그레이션 용도만 |
| `NEXT_PUBLIC_MAX_UPLOAD_MB`    | 업로드 허용 최대 용량(MB)                    | 공개           | ✅           | ✅             | ✅                | 클라이언트 검증용 |
| `SENTRY_DSN` (예시)            | 에러 모니터링 도구 DSN                       | 비공개         | 옵션        | 옵션          | 옵션             | 도구 채택 시 추가 |

### 3.2 관리 위치

- **Git 저장소**
  - 포함: `.env.example` (이 리포지토리 내 예시 파일)
  - 포함 금지: `.env`, `.env.local`, 실제 값이 들어간 모든 환경 파일

- **로컬 개발자 환경**
  - 파일: `.env.local` 또는 `.env`
  - 팀 합류 시: `.env.example`를 복사 후 개인 환경에서 값 채우기

- **Vercel 프로젝트 설정**
  - Project Settings → Environment Variables
  - Environment 종류별로 값 지정
    - `Development`: 로컬 `vercel dev` 사용 시
    - `Preview`: PR/브랜치 Preview용
    - `Production`: main 배포용
  - **서비스 롤 키(`SUPABASE_SERVICE_ROLE_KEY`)는 Preview/Production의 서버 런타임에서만 사용**
    - API Route, Edge Function 등 서버 코드에서만 접근하도록 사용

- **Supabase 설정**
  - Project Settings → API에서 `Anon key`, `Service role key` 확인
  - **Service role key는 재발급/폐기 가능**하므로, 노출 시 반드시 키 회전 필요

---

## 4. 보안 체크리스트

### 4.1 환경변수 / 시크릿 관리

- [ ] `.env`, `.env.local` 등 실제 값이 들어간 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 리포지토리에 **반드시** `.env.example`만 커밋되어 있는지 확인
- [ ] `NEXT_PUBLIC_` 접두사를 가진 키에는 **민감 정보(비밀번호, 서비스 롤 키, 토큰 등)**를 절대 넣지 않기
- [ ] Supabase Service role key, DB password 등은 오직
      - 로컬 개발자의 `.env.local` (개인 환경)
      - Vercel 프로젝트 Environment Variables (Preview/Production)
      에만 저장
- [ ] GitHub Actions에서 시크릿이 필요한 경우, `Repository settings → Secrets and variables → Actions`에만 저장하고,
      로그에 출력하지 않도록 스크립트 작성 (예: `echo "$SUPABASE_SERVICE_ROLE_KEY"` 금지)

### 4.2 권한 및 접근 제어 (Supabase)

- [ ] Supabase 테이블은 기본적으로 **RLS(Row Level Security) 활성화** 상태 유지
- [ ] 서비스 롤 키를 사용하는 서버 코드에서는
      - 데이터 삭제/대량 수정/관리자 기능에만 사용
      - 클라이언트에서 직접 호출 가능한 API에 노출되지 않도록 주의
- [ ] 클라이언트(브라우저)는 **항상 anon key**만 사용하도록 설정
- [ ] 관리자/운영 기능이 필요하다면, 별도의 관리자 UI 또는 관리자용 API 엔드포인트로 분리하고,
      인증/인가 정책(예: Supabase Auth의 role, app_metadata 등)으로 보호

### 4.3 Production 배포 승인 규칙

- [ ] GitHub main 브랜치에 **직접 푸시 금지** 설정 (보호 브랜치)
- [ ] main 브랜치에 머지하려면 **최소 1인 이상의 코드 리뷰 승인** 필수
- [ ] main 브랜치 병합 조건에 `Web CI (lint, typecheck, build)` 워크플로우 성공을 필수 체크로 설정
- [ ] DB 마이그레이션, RLS 정책 변경, 외부 리소스 생성은
      - 별도 PR / 이슈로 제안
      - 사람 승인 후 적용

### 4.4 로깅 / 개인정보 보호

- [ ] 로그에 **Access Token, Refresh Token, 비밀번호, 서비스 롤 키 등 민감 정보**를 남기지 않기
- [ ] 에러 추적 도구(Sentry 등)를 도입하는 경우, PII(개인식별정보) 마스킹/비수집 정책 설정
- [ ] 사용자 데이터 삭제/정정 요청 시 대응 방법을 문서화 (간단한 수준으로라도)

---

## 5. Health Check & 모니터링 계획

### 5.1 Health Check 엔드포인트 설계 (예시)

- 경로 예시: `GET /api/health`
- 동작 예시
  - 200 OK + `{ "status": "ok", "version": "<git-commit-sha>" }`
  - 최소한 애플리케이션 서버가 살아 있고, Supabase와 기본 통신이 되는지 간단히 확인 가능
- 구현 위치
  - Next.js의 경우: `src/app/api/health/route.ts` 또는 `pages/api/health.ts`

### 5.2 배포 후 Health Check 플로우 (수동 → 자동 전환 계획)

1. **Preview 배포 후 (PR 기준)**
   - Vercel Preview URL에 `/api/health`를 붙여 브라우저 또는 `curl`로 확인
2. **Production 배포 후 (main 머지)**
   - 실제 도메인(또는 Production URL)에 `/api/health`로 확인
3. **향후 자동화(선택)**
   - 별도 GitHub Actions 워크플로우 or 외부 모니터링 서비스(예: UptimeRobot, Better Stack 등 무료 플랜)를 사용해 주기적으로 `/api/health` 체크
   - 실패 시 Slack/Discord 등으로 알림 (도구/채널은 팀에서 결정)

---

## 6. 롤백 플랜 (초안)

### 6.1 Vercel 롤백

- 상황 예시: 새로운 릴리스 후 치명적인 버그 확인
- 롤백 방식 (둘 중 하나)
  1. **이전 배포 Promote**
     - Vercel Dashboard → Project → Deployments
     - 문제가 없던 마지막 Production 배포 선택
     - “Promote to Production” 버튼으로 빠른 롤백
  2. **Git Revert + 재배포**
     - 문제가 된 커밋을 되돌리는 `git revert` 커밋 생성
     - main에 머지 → 새로운 배포가 자동 생성

### 6.2 Supabase (DB) 변경 롤백

- DB 스키마 변경, 대량 데이터 수정 등은 특히 주의
- 원칙
  - 파괴적인 변경(컬럼 삭제, 테이블 삭제 등)은 **백업 또는 롤백 SQL**을 함께 준비
  - 가능하면 마이그레이션 툴(Supabase CLI, prisma 등)을 사용해 버전 관리
- 롤백 절차 (개략)
  1. 변경 전: 대상 테이블 백업 또는 Export
  2. 변경 적용: 마이그레이션 SQL 실행
  3. 문제 발생 시: 백업 데이터/롤백 스크립트로 되돌리기
- 이 문서에서는 DB 구체 스키마가 없으므로, 실제 쿼리는 BE/DB 담당자가 작성해야 합니다.

---

## 7. Secret Scan / 시크릿 누출 예방 노트

### 7.1 권장 툴 (선택 사항)

- **GitHub Secret Scanning** (퍼블릭 리포지토리인 경우 기본 제공)
- **gitleaks**, **trufflehog** 등 오픈소스 도구
  - 로컬에서 `gitleaks detect` 등을 실행해 Git 히스토리 내 시크릿 존재 여부 확인 가능

### 7.2 실무 플로우 (간단 버전)

- [ ] 시크릿 값(예: Supabase 키)을 코드에 직접 하드코딩하지 않고, 항상 환경변수에서 읽도록 구현
- [ ] PR 전
  - `git diff`에서 `supabase`, `apikey`, `token`, `password` 등의 문자열이 포함된 변경이 있는지 수동 확인
- [ ] 만약 시크릿을 실수로 커밋했다면
  1. 즉시 해당 키를 발급한 서비스(Supabase, Vercel 등)에서 **키 폐기/회전**
  2. 새 키로 환경변수 업데이트
  3. 필요 시 Git 히스토리 재작성(`git filter-repo` 등) 고려 (학습용 프로젝트에서는 키 회전만으로도 충분한 경우가 많음)

---

## 8. 인수인계 / 사람 합류 노트 (OPS 관점)

- 이 문서와 함께 확인해야 할 파일
  - `ci.yml`: GitHub Actions CI 파이프라인 (lint/typecheck/build)
  - `.env.example`: 환경변수 예시 (실제 값 없음)
- 새 팀원이 합류했을 때의 기본 절차
  1. 리포지토리 클론
  2. `.env.example`을 복사하여 `.env.local` 생성 후, 팀에서 공유받은 실제 값 채우기
  3. `npm install` 후 `npm run dev`로 로컬 개발 환경 확인
  4. PR 올리기 전 `npm run lint`, `npm run build` 확인
- 디자인 관련 방향성(분위기, 레이아웃, 색감 등)은 **디자인/프런트엔드 팀이 협의해 결정**하며,
  이 문서는 배포/인프라/보안 범위까지만 다룹니다.

---

_상태 요약_
- CI 구성: 초안 워크플로우 (`ci.yml`) 작성 완료, 실제 리포지토리에 배치 후 테스트 필요
- 인프라: Vercel/Supabase 프로젝트 생성 및 연결, 도메인 설정 등은 **아직 미적용** 상태로 간주 (사람 승인 필요)
- 이 문서는 OPS 기준의 **초안**이며, 실제 운영 경험에 따라 팀이 수정/보완할 수 있습니다.
