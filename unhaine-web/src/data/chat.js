export const answers = [
  {
    re: /빌런|빌링|billain|청구/i,
    text: "Billain은 통신료 청구 업무의 수집·검증·발송을 웹 기반 프로세스로 연결한 프로젝트입니다. 기존 3일 이상 소요되던 작업이 웹 운영 단계에서 약 3~4시간 수준으로 단축되었습니다.",
    url: "/portfolio/billain",
    label: "Billain 사례 보기",
  },
  {
    re: /카타|키리|kata|kiri|에이전트|하네스/i,
    text: "kata는 프로젝트의 맥락, 작업 방식, 자산과 참고 지식을 기록하고 재사용하며 작업 체계를 발전시키는 프로젝트입니다.",
    url: "/portfolio/kata",
    label: "kata 보기",
  },
  {
    re: /교육|학교|학력|전공|배우|학습/i,
    text: "광운대학교 영어영문학과를 졸업했고, AI PM 이너서클과 SQL·온톨로지·에이전트 시스템 관련 학습을 이어가고 있습니다.",
    url: "/about/education",
    label: "Education 보기",
  },
  {
    re: /경력|회사|커리어|일했|경험/i,
    text: "영업 및 사업개발을 기반으로 고객 요구 파악, 업무 프로세스 개선, 내부 시스템 설계와 구현 경험을 쌓았습니다.",
    url: "/about/career",
    label: "Career 보기",
  },
  {
    re: /가치|방식|철학|협업|일하는/i,
    text: "성과 중심의 실행, 더 나은 근거를 수용하는 태도, 문제에 대한 오너십, 직접 만들어 배우는 방식을 중요하게 생각합니다.",
    url: "/about/values",
    label: "Values 보기",
  },
  {
    re: /역량|잘하|기술|스킬|능력/i,
    text: "비즈니스 문제 정의, 요구사항과 업무 흐름 설계, 소프트웨어 구현 경험을 연결하는 것이 핵심 역량입니다.",
    url: "/portfolio",
    label: "프로젝트 보기",
  },
  {
    re: /연락|이메일|깃허브|github|contact/i,
    text: "연락처와 외부 채널은 Contact 페이지에서 확인할 수 있습니다. 현재는 실제 주소와 링크를 연결하기 전의 프로토타입입니다.",
    url: "/contact",
    label: "Contact 보기",
  },
  {
    re: /프로젝트|포트폴리오|만들었/i,
    text: "현재 포트폴리오에는 업무 자동화 프로젝트 Billain과 AI 에이전트 작업 체계 프로젝트 kata가 있습니다.",
    url: "/portfolio",
    label: "프로젝트 카탈로그 보기",
  },
  {
    re: /왜.*ai|ai.*전환|인공지능|fde/i,
    text: "비즈니스 현장에서 반복적인 비효율을 해결하다 소프트웨어 구현으로 관심이 확장되었고, 지금은 AI를 활용해 더 복잡한 문제를 해결하는 방향으로 성장하고 있습니다.",
    url: "/about",
    label: "About 보기",
  },
];

export function getAnswer(question) {
  return (
    answers.find((answer) => answer.re.test(question)) || {
      text: "이 프로토타입은 정해진 질문에 반응하는 데모입니다. 경력, 교육, Billain, kata, 역량, 가치관, 연락처 등을 물어보세요. 실제 AI 모델 연결은 다음 개발 단계에서 진행합니다.",
    }
  );
}
