# Supabase Auth 설정 가이드 (초안)

> 이 문서는 부트캠프 커뮤니티 웹 서비스의 인증 구성을 위한 BE 관점의 초안입니다. 실제 설정/배포 전에 팀(PM/FE/BE) 합의가 필요합니다.

---

## 0. 목표 & 범위

- 1단계: 이메일/비밀번호 기반 로그인 구현
- 2단계: 추후 구글/깃허브 소셜 로그인 추가할 수 있는 구조로 설계
- Supabase Auth + RLS 기반 인증/인가 사용
- 프론트엔드(웹)가 Supabase Auth를 직접 호출하는 구조를 기본안으로 제안

### 용어/역할

- **익명 사용자(anonymous)**: 로그인하지 않은 모든 사용자
- **일반 사용자(authenticated)**: Supabase Auth를 통해 로그인된 사용자
- **관리자(admin)**: 별도 플래그가 있는 인증 사용자 (예: `profiles.role = 'admin'`)

---

## 1. Supabase Dashboard 기본 설정

### 1-1. 프로젝트 & 키 확인

1. Supabase 프로젝트 생성 (이미 있다면 생략)
2. **Project Settings → API**
   - Project URL 확인 (예: `https://xxxx.supabase.co`)
   - `anon` public key 확인 (프론트에서 사용)
   - `service_role` key는 **서버 전용**, 절대 프론트에 노출 금지

### 1-2. Auth → Configuration

Auth 메뉴에서:

1. **General**
   - **Allow new users to sign up**  
     - 초안 제안: 개발/테스트 단계에서는 ON  
     - 운영 시에는 "초대 기반"으로 바꿀지 팀 합의 필요
   - **Require email confirmation** (이메일 인증 필요 여부)
     - 초안 제안: ON (이메일 확인된 사용자만 로그인 허용)
2. **Redirect URLs / Site URL**
   - `Site URL`에 프론트엔드 도메인 입력  
     예: 개발: `http://localhost:3000`, 운영: `https://app.bootcamp-community.com`
   - `Redirect URLs`에 이메일 확인/비밀번호 재설정 등에서 사용할 URL 추가  
     예:
     - `http://localhost:3000/auth/callback`
     - `https://app.bootcamp-community.com/auth/callback`

> FE와 합의해서 실제 경로(`/auth/callback` 등)를 확정해야 합니다. (미결정 항목)

### 1-3. Auth → Providers → Email

1. Email provider **ON**
2. 옵션 (UI 버전에 따라 이름이 약간 다를 수 있음)
   - `Enable email confirmations` / `Confirm email` → 위에서 설정한 이메일 인증 정책과 일치하도록
   - `Enable password signup` **ON**
3. Templates 탭에서
   - Magic Link / Confirm Email / Reset Password 메일 제목·본문 확인
   - 브랜드 톤에 맞게 필요 시 수정 (초기엔 기본값 사용 가능)

### 1-4. 이메일 발송(SMTP) 설정

- **개발 단계**
  - Supabase 기본 이메일 발송 사용 (별도 SMTP 없이 테스트 가능)
- **운영 단계**
  - Project Settings → Auth → SMTP settings 에 상용 이메일 서비스(SendGrid, Mailgun 등) 연결
  - 실제 SMTP 호스트/유저/패스워드는 환경변수로 관리 (예: `SMTP_HOST`, `SMTP_USER` 등)  
  - 이 문서에서는 실제 값은 기입하지 않습니다.

---

## 2. 프론트엔드에서 Supabase 클라이언트 초기화 (예시)

> 예시는 Next.js 기준이며, 다른 React SPA도 거의 동일합니다.

`.env.local` (프론트)

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_PUBLIC_KEY"
```

`supabaseClient.ts`

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 프론트 전용 클라이언트
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

주의사항:

- `service_role` 키는 절대 브라우저 번들에 포함되면 안 됩니다.
- 환경변수는 빌드 시스템에 따라 별도 설정 필요 (Vercel, Netlify 등).

---

## 3. 이메일/비밀번호 Auth 플로우

### 3-1. 회원가입 (Sign up)

프론트에서 Supabase Auth 직접 호출을 기본안으로 합니다.

```ts
import { supabase } from './supabaseClient';

type SignUpPayload = {
  email: string;
  password: string;
  displayName?: string;
};

export async function signUp({ email, password, displayName }: SignUpPayload) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName ?? null, // user_metadata
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;

  // email 확인 요구 여부에 따라 data.session 존재 여부가 달라집니다.
  return data;
}
```

초기 UX 제안(팀 합의 필요):

- **이메일 인증을 요구하는 경우**:
  - "가입이 완료되었습니다. 이메일로 전송된 링크를 통해 계정을 활성화하세요." 메시지 노출
- **이메일 인증을 요구하지 않는 경우**:
  - `data.session` 을 즉시 사용해 로그인 상태로 전환

### 3-2. 로그인 (Sign in with password)

```ts
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data; // access_token, refresh_token, user 포함
}
```

### 3-3. 로그아웃

```ts
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

### 3-4. 비밀번호 재설정 (Reset password)

1. 사용자가 "비밀번호를 잊으셨나요?" 클릭
2. 이메일 입력 후 아래 API 호출:

```ts
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  });

  if (error) throw error;
  return data;
}
```

3. 사용자가 이메일의 링크 클릭 → 프론트의 `/auth/callback` 페이지에서
   - `supabase.auth.updateUser({ password: '새 비밀번호' })` 호출하여 비밀번호 변경

> `/auth/callback` 페이지 구체 UX/로직은 FE와 별도 설계 필요.

---

## 4. DB 스키마 & RLS (profiles 테이블 초안)

> Supabase는 `auth.users` 테이블을 내부에서 관리합니다.  
> 앱 도메인 정보(닉네임, 역할, 부트캠프 기수 등)는 별도 `public.profiles` 테이블에 저장하는 것을 권장합니다.

### 4-1. profiles 테이블 migration DRAFT (아직 적용 X)

```sql
-- DRAFT: 아직 실제 DB에 적용하지 않은 초안입니다.
-- 팀 리뷰 및 승인 후 migration 파일로 분리하여 적용해야 합니다.

create table if not exists public.profiles (
  id uuid primary key
    references auth.users (id) on delete cascade,

  display_name text,
  avatar_url text,
  role text default 'user', -- 'user' | 'admin' 등

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.profiles is 'App-specific user profiles linked to auth.users';

-- updated_at 자동 갱신 트리거 (선택)
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_current_timestamp_updated_at();
```

### 4-2. RLS 정책 DRAFT

```sql
-- RLS 활성화
alter table public.profiles enable row level security;

-- 모든 사용자는 다른 사람의 프로필을 조회할 수 있음 (커뮤니티 특성)
create policy "Profiles are readable by everyone"
on public.profiles
for select
using ( true );

-- 로그인한 사용자는 자신의 프로필만 생성 가능
create policy "Users can insert their own profile"
on public.profiles
for insert
with check ( auth.uid() = id );

-- 로그인한 사용자는 자신의 프로필만 수정 가능
create policy "Users can update own profile"
on public.profiles
for update
using ( auth.uid() = id )
with check ( auth.uid() = id );

-- delete 정책은 미정 (일반 사용자의 self-delete 허용 여부 결정 필요)
```

> 위 SQL은 **초안**입니다. 실제 migration 적용 전에는:
> - `role` 필드 정의 (admin 여부, instructor 등) 확정
> - 프로필 공개 범위(전체 공개 vs 부분 익명화) 논의 필요

### 4-3. Auth 관련 Permission Matrix (초안)

| 리소스 / 액션                          | 익명 | 인증 사용자 | 관리자 |
|----------------------------------------|------|------------|--------|
| Supabase Auth: signUp, signIn         | O    | O          | O      |
| `public.profiles`: SELECT (읽기)      | O    | O          | O      |
| `public.profiles`: INSERT (생성)      | X    | 자기 것만  | O      |
| `public.profiles`: UPDATE (수정)      | X    | 자기 것만  | O      |
| `public.profiles`: DELETE             | X    | 미정       | O      |
| 도메인 데이터(게시글 등): SELECT      | O/제한 공개 (미정) | O | O |
| 도메인 데이터(게시글 등): INSERT/UPDATE| X    | 자기 것만  | O      |

> 게시글/댓글 등 다른 테이블의 권한은 별도 스키마 설계 시 확정.

---

## 5. 소셜 로그인(구글/깃허브) 연동 시 고려사항

### 5-1. Provider 설정 단계

1. Supabase Dashboard → Auth → Providers
2. Google / GitHub 각각 **ON**
3. 각 Provider 설정 화면에서 Supabase가 안내하는 Redirect URL 확인
4. Google Cloud Console / GitHub Developer Settings 에서
   - OAuth 앱 생성
   - Authorization callback URL 을 Supabase에서 제시하는 URL로 설정
   - Client ID / Client Secret 을 Supabase Provider 설정에 입력

> 실제 Client ID/Secret 값은 `.env`가 아닌 Supabase Dashboard에만 입력됩니다.

### 5-2. FE 플로우 (예시)

```ts
// Google 로그인
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});

// GitHub 로그인
await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

`/auth/callback` 페이지에서:

- `supabase.auth.getSession()` 으로 세션 확인
- 기존 이메일/비밀번호 로그인과 동일하게 전역 상태에 세션 저장

### 5-3. 계정/아이덴티티 전략

소셜 로그인 추가 시 **가장 중요한 결정**은 "같은 이메일로 여러 로그인 방식을 사용했을 때 계정을 하나로 볼 것인지" 입니다.

Supabase 관련 포인트:

- Supabase는 내부적으로 `auth.users` 와 `auth.identities` 를 관리
- 설정에 따라:
  - 같은 이메일일 때 자동으로 동일 사용자로 취급
  - 혹은 별도 계정으로 분리
- 초안 제안:
  - **"이메일 기준 단일 계정" 전략**을 사용
  - 필요 시 `supabase.auth.linkIdentity()` 등을 활용해 수동 링크 (추후 고급 설정)

팀에서 합의할 내용:

- 이메일/비밀번호로 가입한 사용자가 나중에 같은 이메일로 Google 로그인을 시도하면:
  - a) 같은 계정으로 연결 (권장)  
  - b) "이미 같은 이메일로 가입한 계정이 있습니다" 안내 후 로그인 유도

### 5-4. profiles 테이블과의 연계

- `profiles.id` = `auth.users.id` 이므로, 로그인 방식과 상관없이 항상 동일 구조 사용
- 소셜 로그인 사용자는 초기 로그인 시 `profiles` 레코드가 없을 수 있음
  - **전략 1:** 로그인 후 첫 진입 시 "온보딩" 페이지에서 프로필 생성
  - **전략 2:** DB 트리거로 자동 생성 (추후 필요 시 migration에 추가)

예시 온보딩 플로우 (전략 1):

1. 각 페이지에서 `profiles` 조회
2. 없다면 `/onboarding/profile`으로 리다이렉트
3. 해당 페이지에서 닉네임/프로필 정보 입력 후 `profiles` INSERT

---

## 6. 백엔드/API 서버에서 Supabase Auth 사용 (초안)

추후 Node 기반 API 서버를 도입할 경우를 위한 가이드입니다.

### 6-1. 요청 헤더 규약 (API Contract 중 Auth 부분)

- 인증이 필요한 모든 API 요청 헤더에 포함:

```http
Authorization: Bearer <supabase_access_token>
```

- API 서버는 이 토큰을 Supabase에 검증 요청:

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 서버 전용 클라이언트 (service_role 사용)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user; // auth.users 레코드
}
```

- 이후 DB 쿼리는 가능한 한 Supabase REST/RPC + RLS를 쓰고, 직접 DB 연결 시에도 `auth.uid()` 컨텍스트를 유지하는 방식을 사용 (세부 구현은 별도 설계).

---

## 7. Destructive-risk / 보안 주의사항

1. **service_role 키 노출 금지**
   - 브라우저 번들, 공개 리포지토리, 클라이언트 환경변수 등에 절대 사용 금지
2. **RLS 미설정 테이블 금지**
   - 사용자 데이터가 저장되는 모든 public 스키마 테이블에는 RLS를 반드시 활성화
   - 임시 테스트용 테이블도 운영 DB에서는 RLS 없이 두지 않기
3. **너무 느슨한 정책 주의**
   - 예: `using (true)` 만 있는 UPDATE/DELETE 정책 → 모든 사용자 수정/삭제 가능
   - 최소한 `auth.uid() = owner_id` 조건을 사용하는지 확인
4. **Redirect URL 오설정**
   - 소셜 로그인/비밀번호 재설정 Redirect URL 을 외부 도메인으로 잘못 설정 시 토큰 유출 위험
5. **이메일 인증 비활성화 시 스팸/어뷰징**
   - 누구나 아무 이메일로 계정 생성 가능 → 스팸 계정 다수 생성 가능
   - 운영 단계에서는 이메일 인증 ON 권장

---

## 8. 미결정 / 팀 합의 필요 항목

1. 이메일 인증 필수 여부
   - 옵션: 필수 / 선택 / 사용 안 함
2. 신규 회원가입 개방 범위
   - 누구나 가입 / 초대 코드 기반 / 관리자 승인제
3. 프로필 공개 범위
   - 전체 공개 / 닉네임만 공개 / 로그인 사용자에게만 전체 공개 등
4. 일반 사용자의 계정 삭제 권한
   - 본인 `profiles` 및 도메인 데이터 삭제 허용 여부
5. 소셜 로그인 계정 연결 정책
   - 같은 이메일이면 자동 연결 vs 명시적 링크 vs 차단
6. 온보딩 방식
   - 회원가입 시 바로 닉네임 등 프로필 수집
   - 로그인 후 첫 진입 시 온보딩 페이지로 유도
7. 관리자 역할 정의
   - role 컬럼 명세 (`user`, `admin`, `mentor`, `staff` 등)
   - 관리자 권한 범위(게시글 숨기기, 사용자 차단 등)

---

이 문서는 **Supabase Auth 설정 가이드 초안**이며,  
실제 migration 적용 및 운영 환경 설정 전에 반드시 팀 리뷰와 승인이 필요합니다.

- 작업 역할: BE (백엔드)
- 사용 모델/도구: OpenAI GPT 기반 BE 봇 (로컬 실행/테스트 없음, 문서 초안 수준)
