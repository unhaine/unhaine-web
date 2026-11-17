# Unhaine static prototype

`index.html`을 브라우저에서 열면 시작합니다. 블로그 원고를 수정한 후에는 Node.js 20 이상에서 `npm ci` (최초 한 번), `npm run build`를 실행합니다. 블로그 목록과 상세 HTML을 현재 경로에 자동 생성하므로 기존처럼 파일을 직접 열어 확인할 수 있습니다. 압축된 전체 사이트는 `dist/index.html`에서도 확인할 수 있습니다.

## 페이지
- Main: `index.html`
- About: `about.html`
  - Career: `career.html`
  - Education: `education.html`
  - Values: `values.html`
- Portfolio: `portfolio.html`
  - Billain: `billain.html`
  - kata: `kata.html`
- Blog: `blog.html` (자동 생성)
  - Billain 개발 이야기: `blog-billain.html` (자동 생성)
  - 영업에서 AI로 이어진 이야기: `blog-ai-journey.html` (자동 생성)
  - 공백의 2년: `blog-career-break.html` (자동 생성)
  - 고객과 신뢰에 대한 이야기: `blog-sales-and-trust.html` (자동 생성)
  - Billain 바이브코딩 경험: `blog-billain-vibe-coding.html` (자동 생성)
  - kata 개발 이야기: `blog-kata.html` (자동 생성)
  - 결과와 완성도에 대한 이야기: `blog-results-over-intentions.html` (자동 생성)
  - 취향과 유연함에 대한 이야기: `blog-expanding-tastes.html` (자동 생성)
- Contact: `contact.html`

모든 페이지에서 Ask Unhaine 버튼이 작동합니다. 현재 키워드 기반 데모 응답만 제공하고 실제 AI API를 호출하지 않습니다. 개인정보와 외부 URL은 임의로 생성하지 않았습니다.

스타일: `styles.css` / 동작: `script.js`

## 블로그 글 추가

1. `content/blog/이름.md`에 본문을 Markdown으로 작성합니다. 제목과 소개 문장은 다음 단계에 등록하므로 본문은 `##` 소제목부터 시작합니다.
2. `content/blog/posts.json`에 `slug`, `title`, `summary`, `date` (`YYYY-MM-DD`), `category`를 추가합니다. `slug`는 Markdown 파일명과 같아야 하며 영문 소문자·숫자·하이픈을 사용합니다.
3. `npm run build`를 실행합니다. 현재 경로의 `blog-이름.html`과 `blog.html`, 연도별 아카이브가 자동 생성됩니다. 배포용 압축본도 `dist/`에 생성됩니다. 생성된 HTML을 직접 편집하지 않습니다.

예를 들어 `slug`가 `billain`이면 원고는 `content/blog/billain.md`, 로컬 파일은 `blog-billain.html`, 운영 주소는 `/blog-billain`입니다. 글을 삭제하려면 목록과 원고를 제거한 뒤 다시 빌드합니다. 해당 글의 자동 생성 HTML도 정리됩니다.

공통 디자인은 `templates/blog-index.html`, `templates/blog-article.html`과 `styles.css`에서 관리합니다. Markdown은 저장소 작성자가 관리하는 콘텐츠이며 방문자 입력을 렌더링하는 기능은 없습니다. 글 추가만으로 운영 사이트에 반영되지는 않으며 GitHub 업로드와 배포는 별도로 진행합니다.

## 배포

검색 결과에 노출되지 않도록 빌드 시 모든 HTML에 `robots: noindex` 메타 태그를 추가하고, `dist/_headers`에 모든 경로의 `X-Robots-Tag: noindex` 응답 헤더를 설정합니다. 새 페이지에도 자동 적용됩니다. 검색엔진이 이 지침을 확인해야 하므로 `robots.txt`로 크롤링을 차단하지 않습니다. 운영 사이트에는 배포 후 적용되며, 이미 검색에 등록된 주소가 사라지기까지는 재수집 시간이 필요합니다. 주소를 아는 사람의 접근을 막는 설정은 아닙니다.

`npm ci` 후 `npm run build`를 실행하면 `dist/`에 HTML·CSS·JS 압축본과 폰트·프로젝트 이미지를 생성합니다. Cloudflare Workers Builds의 빌드 명령은 `npm run build`, 배포 명령은 `npx wrangler deploy --assets ./dist --name unhaine-web --compatibility-date 2026-11-16`입니다. 서버 실행 코드 없이 정적 파일을 제공합니다.

폰트의 compact 디렉터리는 현재 페이지와 챗 데모에서 사용하는 문자를 모은 IBM Plex Sans KR 서브셋입니다. CSS의 unicode-range로 먼저 사용하며, 그 밖의 문자는 원본 폰트가 처리합니다. 새 문구도 표시됩니다. 파일명에 콘텐츠 해시를 붙여 리소스는 1년 캐시하고, HTML은 60초 캐시합니다.

Billain의 공개용 화면은 가상 데이터로 재구성한 이미지이며, 청구서 출력 예시는 별도 샘플 서식입니다. 실제 고객 데이터나 캡처용 HTML은 배포에 포함하지 않습니다.
