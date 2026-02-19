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
    //    (functions/claude.js 라면 아래 그대로)
    API_ENDPOINT: "/.netlify/functions/claude",

    // ❌ 브라우저에 키 넣지 마세요 (노출됨)
    API_KEY: "",

    // (선택) 모델/옵션을 프론트에서 같이 보내고 싶을 때 사용
    // Function이 이 값을 무시해도 문제 없음
    MODEL: "claude-3-5-sonnet-latest",
    MAX_TOKENS: 800,
    TEMPERATURE: 0.3,

    // ✅ 기존 UI가 "키 없으면 모달 띄우기" 같은 로직을 갖고 있으면,
    //    이 플래그로 팝업을 끄게 만들 수 있음
    DISABLE_API_KEY_MODAL: true,
  };

  // 전역으로 노출 (기존 코드가 window.CONFIG 또는 window.APP_CONFIG를 참조할 수 있어서 둘 다 세팅)
  global.CONFIG = CONFIG;
  global.APP_CONFIG = CONFIG;

  // ✅ 어떤 코드가 window.API_KEY 같은 변수를 직접 참조하는 경우가 있어
  //    (구형 템플릿 호환) — 서버리스 모드에서는 빈 값 유지
  global.API_KEY = "";

  // ✅ "키가 없으면 경고/팝업"을 자동으로 띄우는 함수가 있다면,
  //    여기서 선제적으로 막아버림 (있을 때만)
  //    - showApiKeyModal()
  //    - openApiKeyModal()
  //    - renderApiKeyGuide()
  //    같은 함수명을 쓰는 템플릿이 많음
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

  // ✅ 일부 템플릿은 config 로드 시점에 바로 체크함:
  //    if (!CONFIG.API_KEY) alert(...)
  //    이런 경우를 우회하려고 "서버리스 모드에서는 키가 필요없다" 힌트를 전역에 남김
  global.__SERVERLESS_MODE__ = true;
})(window);
