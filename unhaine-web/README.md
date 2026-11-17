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
- `src/data/`: 블로그 로딩·검증과 기존 키워드 기반 챗 데모 응답
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
챗은 화면 이동 중에도 대화를 유지하며, 실제 AI API에 연결되지 않은 기존 키워드 응답 데모입니다.

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

배포 설정 완료 후 사용할 주소: https://unhaine.github.io/unhaine-web/
GitHub Free의 비공개 저장소는 Pages를 지원하지 않으므로, 공개 저장소 또는 Pages를 지원하는 유료 플랜이 필요합니다.

Vite의 상대 경로 `base: './'`와 해시 라우팅으로 저장소 하위 경로에서도 에셋과 링크가 동작합니다.
검색 노출 제외를 위한 `robots: noindex` 메타 태그를 유지합니다.
GitHub Pages에서는 기존 Cloudflare의 `_headers` 설정이 적용되지 않으므로 메타 태그를 사용합니다.
