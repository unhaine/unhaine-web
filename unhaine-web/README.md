# Unhaine Web

기존 Unhaine 정적 프로토타입을 React + Vite로 옮긴 독립 프로젝트입니다.
상위 프로토타입 파일에 의존하지 않으며, 저장소의 `unhaine-web/` 폴더에서 관리합니다.

## 실행

Node.js 24 LTS를 사용합니다.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

배포 결과물은 `dist/`입니다.

## 구조

- `src/pages/`: 메인, 소개, 포트폴리오, 블로그, 연락처 및 404 페이지
- `src/layouts/SiteLayout.jsx`: 공통 레이아웃
- `src/components/`: Header, Footer, Chat, 배경, 갤러리 등 공통 UI
- `src/data/`: 블로그 로딩·검증
- `worker/`: OpenAI Agents API를 호출하는 챗 전용 Cloudflare Worker
- `scripts/build-context.mjs`: 페이지·Markdown에서 AI 참고 원문 생성
- `src/styles/global.css`: 기존 디자인과 반응형 스타일
- `content/blog/`: Markdown 원고와 `posts.json`
- `public/assets/`: 프로젝트 이미지·폰트와 라이선스

## 라우팅

GitHub Pages에서 직접 접근·새로고침을 지원하기 위해 React Router의 `HashRouter`를 사용합니다.
예: `https://사용자.github.io/저장소/#/about/career`

| 페이지      | 경로                 |
| ----------- | -------------------- |
| 메인        | `/`                  |
| 소개        | `/about`             |
| 경력        | `/about/career`      |
| 교육        | `/about/education`   |
| 가치관      | `/about/values`      |
| 포트폴리오  | `/portfolio`         |
| Billain     | `/portfolio/billain` |
| kata        | `/portfolio/kata`    |
| 블로그 목록 | `/blog`              |
| 블로그 상세 | `/blog/:slug`        |
| 연락처      | `/contact`           |

알 수 없는 경로와 존재하지 않는 블로그 글은 404 화면을 표시합니다.
챗은 화면 이동 중에도 대화를 유지하며, Cloudflare Worker를 통해 OpenAI의 저장된 `Unhaine Chat` 에이전트를 호출합니다.

## AI 챗

- API: `https://unhaine-chat-api.ultrasaram.workers.dev/chat`
- Agent: `agent_6afbd55bbfdc8191833004482a12a0be` (`unhaine-web` OpenAI 프로젝트)
- `npm run dev`와 `npm run build` 전에 같은 페이지 컴포넌트와 블로그 원고에서 `public/ai-context.json`을 생성합니다. 이 파일은 공개 콘텐츠이며 Git에는 포함하지 않습니다.
- Worker는 서버에서 이 원문을 읽고 현재 페이지·질문·최근 대화를 기준으로 관련 자료를 선택합니다. 브라우저가 원문 URL, 모델, 지시사항 또는 세션 ID를 지정할 수 없습니다.
- 플랫폼 에이전트의 지시사항과 모델 설정은 다음 요청의 새 세션부터 적용됩니다. `environment: none`을 사용하므로 실행용 샌드박스를 생성하지 않습니다.
- 최근 8개 메시지를 다음 질문과 함께 전달하며, 대화는 브라우저 메모리에만 유지합니다. 요청마다 만든 OpenAI 임시 세션은 응답 후 삭제를 요청합니다. 이는 OpenAI의 서비스 차원 데이터 보관 정책까지 없애는 설정은 아닙니다.
- 질문은 최대 2,000자이며 익명 방문자의 IP 기준 분당 10회, 전체 키 기준 분당 60회의 Cloudflare rate-limit binding을 적용합니다. 이 제한은 Cloudflare 위치별 근사치이며 전 세계의 엄격한 비용 상한은 아닙니다.
- OpenAI 답변의 Markdown은 React 노드로 표시하며 HTML을 실행하지 않습니다. 링크는 `https://unhaine.com/#/...` 사이트 내부 경로만 연결합니다.

Worker 빌드:

```sh
npm run build:worker
```

`worker/config.json`은 Cloudflare REST 업로드용 메타데이터입니다. `name`은 대상 Worker 이름이며 나머지 필드를 multipart 업로드의 `metadata`로 보냅니다.
`worker/dist/index.js`를 ES module로 업로드하고 `OPENAI_API_KEY`는 해당 Worker의 Secret으로 별도 등록합니다. 재배포 시 기존 Secret 바인딩을 유지해야 합니다.
키에는 Agents 읽기·쓰기와 Responses 쓰기 권한만 부여합니다. API 키를 `.env.example`, GitHub, `VITE_*` 변수나 프런트엔드 코드에 넣지 않습니다.
프런트엔드의 API 주소만 바꾸려면 `.env.example`을 참고해 `VITE_CHAT_API_URL`을 설정하고 다시 빌드합니다.
`GET /health`는 키 등록 여부를 확인하는 준비 상태이며 실제 OpenAI 인증·잔액 검증을 대신하지 않습니다.

GitHub Actions는 화면과 참고 원문을 배포합니다. Worker 코드 변경 시 Worker도 별도로 빌드·배포해야 합니다.

## 블로그 추가

1. `content/blog/이름.md`에 본문을 작성합니다.
2. `posts.json`에 동일한 `slug`와 `title`, `summary`, `date` (`YYYY-MM-DD`), `category`를 추가합니다.
3. `npm test`와 `npm run build`로 확인합니다.

목록, 연도별 아카이브, 상세 화면은 원고를 사용해 표시됩니다.
Markdown은 저장소 작성자가 관리하는 신뢰된 콘텐츠입니다. 방문자 입력을 HTML로 렌더링하지 않습니다.

## GitHub Pages

저장소 루트의 `.github/workflows/deploy-pages.yml`이 이 폴더를 빌드하고 `unhaine-web/dist`를 배포합니다.
원래 정적 HTML 프로토타입은 저장소 루트에 보존합니다.

1. GitHub 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 설정합니다.
2. `main` 브랜치에 푸시하면 포함된 워크플로가 테스트·빌드 후 배포합니다.
3. 기본 브랜치가 다르면 저장소 루트의 `.github/workflows/deploy-pages.yml`에서 브랜치를 수정합니다.

운영 주소: https://unhaine.com/
GitHub Pages 기본 주소: https://unhaine.github.io/unhaine-web/ (운영 도메인으로 이동)
GitHub Free의 비공개 저장소는 Pages를 지원하지 않으므로, 공개 저장소 또는 Pages를 지원하는 유료 플랜이 필요합니다.

커스텀 도메인은 GitHub 저장소의 **Settings → Pages → Custom domain**에 `unhaine.com`으로 설정합니다.
Cloudflare DNS에서 루트 도메인의 A 레코드는 `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`으로,
`www`의 CNAME 레코드는 `unhaine.github.io`로 설정합니다. 해당 레코드는 DNS only이며, 기존 Worker의 커스텀 도메인 연결은 해제합니다.
GitHub 인증서 발급 후 **Enforce HTTPS**를 활성화합니다. GitHub Actions 배포이므로 `CNAME` 파일은 필요하지 않습니다.

Vite의 상대 경로 `base: './'`와 해시 라우팅으로 저장소 하위 경로에서도 에셋과 링크가 동작합니다.
검색 노출 제외를 위한 `robots: noindex` 메타 태그를 유지합니다.
GitHub Pages에서는 기존 Cloudflare의 `_headers` 설정이 적용되지 않으므로 메타 태그를 사용합니다.
