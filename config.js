/* =========================================================
   config.js (Serverless-only, Netlify Functions)
   - 브라우저에 API 키 절대 저장하지 않음
   - Netlify Environment Variable(ANTHROPIC_API_KEY)은
     Netlify Function에서만 읽음
   ========================================================= */
(function (global) {
  "use strict";

  const CONFIG = {
    // ✅ 서버리스(권장): 브라우저는 키 없이 Function만 호출
    USE_SERVERLESS: true,

    // ✅ Netlify Functions 엔드포인트
    API_ENDPOINT: "/.netlify/functions/claude",
    proxyUrl: "/.netlify/functions/claude",

    // ❌ 브라우저에 키 넣지 마세요
    API_KEY: "",

    MODEL: "claude-3-5-sonnet-latest",
    MAX_TOKENS: 800,
    TEMPERATURE: 0.3,

    // ✅ 서버리스일 땐 “키 입력 모달” 로직 자체를 끔
    DISABLE_API_KEY_MODAL: true,
  };

  // 기존 코드 호환: CONFIG / APP_CONFIG 둘 다 제공
  global.CONFIG = CONFIG;
  global.APP_CONFIG = CONFIG;

  // ✅ 핵심: index.html이 ANTHROPIC_CONFIG.apiKey만 보는 구조라면
  // 서버리스 모드일 때 "가짜 키"를 넣어 체크를 통과시킴
  global.ANTHROPIC_CONFIG = {
    apiKey: CONFIG.USE_SERVERLESS ? "__SERVERLESS__" : ""
  };

  // 구형 템플릿 호환
  global.API_KEY = "";

  // 서버리스 모드 힌트
  global.__SERVERLESS_MODE__ = !!CONFIG.USE_SERVERLESS;
})(window);
