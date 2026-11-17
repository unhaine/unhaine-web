const links={index:'index.html',about:'about.html',career:'career.html',education:'education.html',values:'values.html',portfolio:'portfolio.html',billain:'billain.html',kata:'kata.html',contact:'contact.html'};
const btn=document.getElementById('chat-launch'), panel=document.getElementById('chat-panel'), chatBody=document.getElementById('chat-body');
function toggleChat(force){panel.classList.toggle('open',force===undefined?!panel.classList.contains('open'):force);const isOpen=panel.classList.contains('open');document.body.classList.toggle('chat-open',isOpen);btn.setAttribute('aria-expanded',String(isOpen));if(isOpen)document.getElementById('chat-input').focus();else btn.focus()}
btn?.addEventListener('click',()=>toggleChat());document.getElementById('chat-close')?.addEventListener('click',()=>toggleChat(false));document.getElementById('menu-toggle').addEventListener('click',()=>document.getElementById('main-nav').classList.toggle('open'));
const answers=[{re:/빌런|빌링|billain|청구/i,text:'Billain은 통신료 청구 업무의 수집·검증·발송을 웹 기반 프로세스로 연결한 프로젝트입니다. 기존 3일 이상 소요되던 작업이 웹 운영 단계에서 약 3~4시간 수준으로 단축되었습니다.',url:'billain.html',label:'Billain 사례 보기'},{re:/카타|키리|kata|kiri|에이전트|하네스/i,text:'kata는 프로젝트의 맥락, 작업 방식, 자산과 참고 지식을 기록하고 재사용하며 작업 체계를 발전시키는 프로젝트입니다.',url:'kata.html',label:'kata 보기'},{re:/교육|학교|학력|전공|배우|학습/i,text:'광운대학교 영어영문학과를 졸업했고, AI PM 이너서클과 SQL·온톨로지·에이전트 시스템 관련 학습을 이어가고 있습니다.',url:'education.html',label:'Education 보기'},{re:/경력|회사|커리어|일했|경험/i,text:'영업 및 사업개발을 기반으로 고객 요구 파악, 업무 프로세스 개선, 내부 시스템 설계와 구현 경험을 쌓았습니다.',url:'career.html',label:'Career 보기'},{re:/가치|방식|철학|협업|일하는/i,text:'성과 중심의 실행, 더 나은 근거를 수용하는 태도, 문제에 대한 오너십, 직접 만들어 배우는 방식을 중요하게 생각합니다.',url:'values.html',label:'Values 보기'},{re:/역량|잘하|기술|스킬|능력/i,text:'비즈니스 문제 정의, 요구사항과 업무 흐름 설계, 소프트웨어 구현 경험을 연결하는 것이 핵심 역량입니다.',url:'portfolio.html',label:'프로젝트 보기'},{re:/연락|이메일|깃허브|github|contact/i,text:'연락처와 외부 채널은 Contact 페이지에서 확인할 수 있습니다. 현재는 실제 주소와 링크를 연결하기 전의 프로토타입입니다.',url:'contact.html',label:'Contact 보기'},{re:/프로젝트|포트폴리오|만들었/i,text:'현재 포트폴리오에는 업무 자동화 프로젝트 Billain과 AI 에이전트 작업 체계 프로젝트 kata가 있습니다.',url:'portfolio.html',label:'프로젝트 카탈로그 보기'},{re:/왜.*ai|ai.*전환|인공지능|fde/i,text:'비즈니스 현장에서 반복적인 비효율을 해결하다 소프트웨어 구현으로 관심이 확장되었고, 지금은 AI를 활용해 더 복잡한 문제를 해결하는 방향으로 성장하고 있습니다.',url:'about.html',label:'About 보기'}];
function addBubble(kind,text,url,label){const el=document.createElement('div');el.className='bubble '+kind;el.textContent=text;if(url){const a=document.createElement('a');a.href=url;a.textContent='\n'+label+' ↗';a.style.cssText='display:block;color:var(--accent);margin-top:8px;font-weight:700';el.appendChild(a)}chatBody.appendChild(el);chatBody.scrollTop=chatBody.scrollHeight}
function respond(q){q=q.trim();if(!q)return;addBubble('user',q);const a=answers.find(a=>a.re.test(q));if(a)addBubble('bot',a.text,a.url,a.label);else addBubble('bot','이 프로토타입은 정해진 질문에 반응하는 데모입니다. 경력, 교육, Billain, kata, 역량, 가치관, 연락처 등을 물어보세요. 실제 AI 모델 연결은 다음 개발 단계에서 진행합니다.');}
document.getElementById('chat-form')?.addEventListener('submit',e=>{e.preventDefault();const inp=document.getElementById('chat-input');respond(inp.value);inp.value=''});document.querySelectorAll('[data-question]').forEach(x=>x.addEventListener('click',()=>{toggleChat(true);respond(x.dataset.question)}));

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel?.classList.contains('open'))toggleChat(false)});

const chatInput = document.getElementById('chat-input');
const chatForm = document.getElementById('chat-form');
function syncComposer(){
  if(!chatInput || !chatForm) return;
  chatInput.style.height='auto';
  chatInput.style.height=Math.min(chatInput.scrollHeight,160)+'px';
  chatForm.querySelector('button[type="submit"]').disabled=!chatInput.value.trim();
}
chatInput?.addEventListener('input',syncComposer);
chatInput?.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){
    e.preventDefault();
    if(chatInput.value.trim()) chatForm.requestSubmit();
  }
});
chatForm?.addEventListener('submit',syncComposer);
syncComposer();

// Capture scroll events from the page, detail content, chat, and textarea.
const scrollbarTimers = new WeakMap();
document.addEventListener('scroll', event => {
  const scroller = event.target === document
    ? document.scrollingElement
    : event.target;
  if (!(scroller instanceof Element)) return;
  clearTimeout(scrollbarTimers.get(scroller));
  scroller.classList.add('is-scrolling');
  scrollbarTimers.set(scroller, setTimeout(() => {
    scroller.classList.remove('is-scrolling');
    scrollbarTimers.delete(scroller);
  }, 1000));
}, { capture: true, passive: true });

// Show a downward cue only while more page content remains below.
const scrollCue = document.createElement('div');
scrollCue.className = 'scroll-cue';
scrollCue.hidden = true;
scrollCue.setAttribute('aria-hidden', 'true');
scrollCue.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
document.body.appendChild(scrollCue);

let scrollCueFrame = 0;
function updateScrollCue() {
  scrollCueFrame = 0;
  const detail = document.querySelector('.detail-content');
  const scroller = detail && detail.scrollHeight > detail.clientHeight + 2
    && /auto|scroll/.test(getComputedStyle(detail).overflowY)
    ? detail : document.scrollingElement;
  const hasMore = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop > 8;
  scrollCue.hidden = !hasMore;
  if (!hasMore) return;

  const main = document.querySelector('.site-main');
  const bounds = (scroller === detail ? detail : main).getBoundingClientRect();
  const footer = document.querySelector('.site-footer').getBoundingClientRect();
  const gapBottom = Math.min(footer.top, document.documentElement.clientHeight);
  const cueTop = scroller === detail
    ? bounds.bottom + Math.max(0, (gapBottom - bounds.bottom - scrollCue.offsetHeight) / 2)
    : gapBottom - scrollCue.offsetHeight - 4;
  scrollCue.style.left = (bounds.left + bounds.width / 2) + 'px';
  scrollCue.style.top = cueTop + 'px';
}
function scheduleScrollCue() {
  if (!scrollCueFrame) scrollCueFrame = requestAnimationFrame(updateScrollCue);
}
document.addEventListener('scroll', scheduleScrollCue, { capture: true, passive: true });
window.addEventListener('resize', scheduleScrollCue);
document.addEventListener('load', scheduleScrollCue, true);
const scrollCueObserver = new ResizeObserver(scheduleScrollCue);
document.querySelectorAll('.site-main, .site-footer, .detail-content, .detail-content > *')
  .forEach(element => scrollCueObserver.observe(element));
document.fonts.ready.then(scheduleScrollCue);
scheduleScrollCue();

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const slides = [...gallery.querySelectorAll('[data-src]')];
  const image = gallery.querySelector('.gallery-image');
  const title = gallery.querySelector('.gallery-title');
  const count = gallery.querySelector('.gallery-count');
  const description = gallery.querySelector('.gallery-description');
  const dialog = gallery.querySelector('.gallery-dialog');
  const enlarged = dialog.querySelector('img');
  const dialogControls = gallery.querySelector('.gallery-controls').cloneNode(true);
  dialogControls.querySelectorAll('[data-src]').forEach(button => {
    button.removeAttribute('data-src');
    button.removeAttribute('data-title');
    button.removeAttribute('data-description');
  });
  dialog.appendChild(dialogControls);
  const controls = [...gallery.querySelectorAll('.gallery-controls')];
  let current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    image.src = slide.dataset.src;
    image.alt = '가상 데이터로 구성한 Billain ' + slide.dataset.title + ' 화면';
    title.textContent = slide.dataset.title;
    description.textContent = slide.dataset.description;
    count.textContent = (current + 1) + ' / ' + slides.length;
    controls.forEach(control => {
      control.querySelectorAll('.gallery-dots button').forEach((button, i) => {
        button.setAttribute('aria-pressed', String(i === current));
      });
    });
    if (dialog.open) showEnlarged();
  }

  function showEnlarged() {
    enlarged.src = image.src;
    enlarged.alt = image.alt;
    dialog.querySelector('.gallery-dialog-caption').textContent =
      title.textContent + ' — ' + description.textContent;
  }

  controls.forEach(control => {
    control.querySelectorAll('.gallery-dots button').forEach((button, index) => {
      button.addEventListener('click', () => showSlide(index));
    });
    control.querySelector('.gallery-prev').addEventListener('click', () => showSlide(current - 1));
    control.querySelector('.gallery-next').addEventListener('click', () => showSlide(current + 1));
  });
  gallery.querySelector('.gallery-open').addEventListener('click', () => {
    showEnlarged();
    dialog.showModal();
  });
  gallery.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
});

document.querySelectorAll('[data-image-preview]').forEach(preview => {
  const image = preview.querySelector('.gallery-open img');
  const dialog = preview.querySelector('.gallery-dialog');
  const enlarged = dialog.querySelector('img');

  preview.querySelector('.gallery-open').addEventListener('click', () => {
    enlarged.src = image.src;
    enlarged.alt = image.alt;
    dialog.showModal();
  });
  preview.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
});

// Contact address copying, including directly opened local previews.
document.querySelectorAll('.contact-address[data-copy]').forEach(button => {
  let resetTimer;
  button.addEventListener('click', async () => {
    const status = document.querySelector('.contact-copy-status');
    let copied = false;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      copied = true;
    } catch {
      const field = document.createElement('textarea');
      const previousFocus = document.activeElement;
      field.value = button.dataset.copy;
      field.readOnly = true;
      field.style.cssText = 'position:fixed;top:0;left:-9999px';
      document.body.appendChild(field);
      field.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      } finally {
        field.remove();
        previousFocus?.focus();
      }
    }
    clearTimeout(resetTimer);
    button.classList.toggle('is-copied', copied);
    status.textContent = copied
      ? ''
      : '복사하지 못했습니다. 주소를 직접 선택해 복사해 주세요.';
    if (copied) {
      resetTimer = setTimeout(() => {
        button.classList.remove('is-copied');
        status.textContent = '';
      }, 2500);
    }
  });
});
