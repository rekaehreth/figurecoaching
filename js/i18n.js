(function () {
  const SUPPORTED_LANGS = ["hu", "en"];
  const DEFAULT_LANG = "hu";
  const STORAGE_KEY = "figureCoaching.lang";

  const dictCache = {};

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGS.includes(stored) ? stored : null;
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable — ignore */
    }
  }

  function detectBrowserLang() {
    const candidates =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || ""];

    for (const candidate of candidates) {
      const code = String(candidate).slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.includes(code)) return code;
    }
    return null;
  }

  function resolveInitialLang() {
    return getStoredLang() || detectBrowserLang() || DEFAULT_LANG;
  }

  function getByPath(dict, path) {
    return path.split(".").reduce((acc, key) => {
      return acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined;
    }, dict);
  }

  function loadDict(lang) {
    if (dictCache[lang]) return Promise.resolve(dictCache[lang]);
    return fetch(`i18n/${lang}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load i18n/${lang}.json (${res.status})`);
      return res.json().then((dict) => {
        dictCache[lang] = dict;
        return dict;
      });
    });
  }

  function applyTranslations(dict) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getByPath(dict, key);
      if (typeof value === "string") el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      spec.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((part) => part.trim());
        if (!attr || !key) return;
        const value = getByPath(dict, key);
        if (typeof value === "string") el.setAttribute(attr, value);
      });
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const value = getByPath(dict, key);
      if (typeof value === "string") el.setAttribute("aria-label", value);
    });
  }

  function updateLangSwitch(lang) {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setLang(lang) {
    const targetLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;

    return loadDict(targetLang)
      .catch((err) => {
        console.error(err);
        return targetLang === DEFAULT_LANG ? Promise.reject(err) : loadDict(DEFAULT_LANG);
      })
      .then((dict) => {
        applyTranslations(dict);
        document.documentElement.setAttribute("lang", targetLang);
        updateLangSwitch(targetLang);
        storeLang(targetLang);
      });
  }

  function initLangSwitch() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLangSwitch();
    setLang(resolveInitialLang());
  });
})();
