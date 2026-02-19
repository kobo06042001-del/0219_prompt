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

    // ✅ Netlify Functions 엔드포인트 (claude.js 함수 호출 경로)
    API_ENDPOINT: "/.netlify/functions/claude",

    // ✅ index.html에서 APP_CONFIG.proxyUrl을 참조하는 코드가 있으므로 같이 제공
    proxyUrl: "/.netlify/functions/claude",

    // ❌ 브라우저에 키 넣지 마세요 (노출됨)
    API_KEY: "",

    // (선택) 모델/옵션을 프론트에서 같이 보내고 싶을 때 사용
    MODEL: "claude-3-5-sonnet-latest",
    MAX_TOKENS: 800,
    TEMPERATURE: 0.3,

    // ✅ 기존 UI가 "키 없으면 모달 띄우기" 같은 로직을 갖고 있으면,
    //    이 플래그로 팝업을 끄게 만들 수 있음
    DISABLE_API_KEY_MODAL: true,
  };

  // 전역으로 노출 (기존 코드 호환)
  global.CONFIG = CONFIG;
  global.APP_CONFIG = CONFIG;

  // ✅ 일부 템플릿 호환: window.API_KEY 참조 방지
  global.API_KEY = "";

  // ✅ "키가 없으면 경고/팝업"을 자동으로 띄우는 함수가 있다면,
  //    여기서 선제적으로 막아버림 (있을 때만)
  function blockKeyModal(fnName) {
    if (typeof global[fnName] === "function") {
      const original = global[fnName];
      global[fnName] = function (...args) {
        // 서버리스 모드에서는 모달/가이드를 띄우지 않음
        if (CONFIG.USE_SERVERLESS && CONFIG.DISABLE_API_KEY_MODAL) return;
        return original.apply(this, args);
      };
    }
  }

  blockKeyModal("showApiKeyModal");
  blockKeyModal("openApiKeyModal");
  blockKeyModal("renderApiKeyGuide");

  // ✅ "서버리스 모드" 힌트
  global.__SERVERLESS_MODE__ = true;
})(window);
