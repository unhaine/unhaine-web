# Unhaine static prototype

`index.html`을 브라우저에서 열면 시작합니다. 별도 서버나 빌드가 필요 없습니다.

## 페이지
- Main: `index.html`
- About: `about.html`
  - Career: `career.html`
  - Education: `education.html`
  - Capabilities: `capabilities.html`
  - Values: `values.html`
- Portfolio: `portfolio.html`
  - Billain: `billain.html`
  - KATA/KIRI: `kata.html`
- Blog: `blog.html`
  - 임시 글 상세: `blog-small-experiments.html`
- Contact: `contact.html`

모든 페이지에서 Ask Unhaine 버튼이 작동합니다. 현재 키워드 기반 데모 응답만 제공하고 실제 AI API를 호출하지 않습니다. 개인정보와 외부 URL은 임의로 생성하지 않았습니다.

스타일: `styles.css` / 동작: `script.js`

## 배포

`npm ci` 후 `npm run build`를 실행하면 `dist/`에 HTML·CSS·JS 압축본과 실제 참조하는 폰트만 생성합니다. Cloudflare Workers Builds의 빌드 명령은 `npm run build`, 배포 명령은 `npx wrangler deploy --assets ./dist --name unhaine-web --compatibility-date 2026-11-16`입니다. 서버 실행 코드 없이 정적 파일을 제공합니다.

폰트의 compact 디렉터리는 현재 페이지와 챗 데모에서 사용하는 문자를 모은 IBM Plex Sans KR 서브셋입니다. CSS의 unicode-range로 먼저 사용하며, 그 밖의 문자는 원본 폰트가 처리합니다. 새 문구도 표시됩니다. 파일명에 콘텐츠 해시를 붙여 리소스는 1년 캐시하고, HTML은 60초 캐시합니다.
