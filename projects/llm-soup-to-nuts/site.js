// Site-wide add-ons for LLM Soup to Nuts: a feedback button and (optional,
// privacy-friendly) analytics. Everything is driven by SITE_CONFIG below, so you
// only ever edit these few values in ONE place and every page picks them up.
//
// Wrapped in an IIFE so nothing leaks into the global scope the chapter scripts use.
(function () {
  "use strict";

  const SITE_CONFIG = {
    // --- Inline feedback form (recommended, free, no account for the reader) --
    // Paste a Web3Forms access key here to turn on an INLINE pop-up form so anyone
    // can type a few sentences and you get them by email. It is free and unlimited,
    // and the reader needs no account of any kind.
    //   1. Go to https://web3forms.com/ and enter YOUR email.
    //   2. They email you an access key. Paste it between the quotes below.
    // The access key is safe to keep in public code: it can only send mail to the
    // address you registered, so the worst case is spam to your own inbox (the
    // hidden honeypot field in the form blocks most of that).
    web3formsKey: "19985e9a-498c-439f-badc-27c3a9e0a04d",

    // --- Feedback button fallback (used only if web3formsKey is empty) -------
    // While there is no Web3Forms key, the button is a plain link instead of a
    // pop-up. A GitHub issue link works but REQUIRES the reader to have a GitHub
    // account. A Google Form URL or a "mailto:" link work without one.
    feedbackUrl: "https://github.com/talktovishal/llm-soup-to-nuts/issues/new",
    feedbackLabel: "Feedback",
    showFeedbackButton: true,

    // --- Analytics (OFF by default) -----------------------------------------
    // Privacy-first and disabled until you opt in. While these stay empty, NO
    // tracking script loads and NO network calls are made — good for an audience
    // that includes minors.
    //
    // To turn on GoatCounter (free, cookieless, no consent banner needed):
    //   1. Make a free site at https://www.goatcounter.com/
    //   2. Paste your endpoint here, e.g. "https://YOURCODE.goatcounter.com/count"
    goatcounterEndpoint: "",
    //
    // Or, to use Cloudflare Web Analytics (also cookieless), paste your beacon
    // token here instead (leave goatcounterEndpoint empty):
    cloudflareToken: ""
  };

  const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
  let lastFocusedElement = null;

  function buildFab() {
    const useForm = Boolean(SITE_CONFIG.web3formsKey);
    const el = document.createElement(useForm ? "button" : "a");
    el.className = "feedback-fab";
    el.setAttribute("aria-label", "Send feedback about this lesson");
    if (useForm) {
      el.type = "button";
      el.addEventListener("click", openFeedbackModal);
    } else {
      el.href = SITE_CONFIG.feedbackUrl;
      if (!SITE_CONFIG.feedbackUrl.startsWith("mailto:")) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    }
    const icon = document.createElement("span");
    icon.className = "feedback-fab-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "\u270E"; // pencil
    const text = document.createElement("span");
    text.className = "feedback-fab-text";
    text.textContent = SITE_CONFIG.feedbackLabel || "Feedback";
    el.append(icon, text);
    return el;
  }

  function injectFeedbackButton() {
    if (!SITE_CONFIG.showFeedbackButton) return;
    if (!SITE_CONFIG.web3formsKey && !SITE_CONFIG.feedbackUrl) return;
    if (document.querySelector(".feedback-fab")) return;
    document.body.append(buildFab());
  }

  // --- Inline pop-up form (only used when a Web3Forms key is set) ------------

  function openFeedbackModal() {
    if (document.querySelector(".feedback-modal-overlay")) return;
    lastFocusedElement = document.activeElement;

    const overlay = document.createElement("div");
    overlay.className = "feedback-modal-overlay";
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeFeedbackModal();
    });

    const dialog = document.createElement("div");
    dialog.className = "feedback-modal";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "feedbackModalTitle");

    const title = document.createElement("h2");
    title.id = "feedbackModalTitle";
    title.className = "feedback-modal-title";
    title.textContent = "Send feedback";

    const intro = document.createElement("p");
    intro.className = "feedback-modal-intro";
    intro.textContent = "What is working, what is confusing, or what you would like to see? A sentence or two is plenty.";

    const form = document.createElement("form");
    form.className = "feedback-form";
    form.noValidate = true;

    const messageField = document.createElement("textarea");
    messageField.className = "feedback-message control-input";
    messageField.required = true;
    messageField.rows = 5;
    messageField.placeholder = "Your feedback...";
    messageField.setAttribute("aria-label", "Your feedback");

    const emailField = document.createElement("input");
    emailField.type = "email";
    emailField.className = "feedback-email control-input";
    emailField.placeholder = "Your email (optional, only if you would like a reply)";
    emailField.setAttribute("aria-label", "Your email, optional");

    // Honeypot: hidden from people, often filled by bots. If set, we skip sending.
    const honeypot = document.createElement("input");
    honeypot.type = "checkbox";
    honeypot.name = "botcheck";
    honeypot.tabIndex = -1;
    honeypot.style.display = "none";
    honeypot.setAttribute("aria-hidden", "true");

    const status = document.createElement("p");
    status.className = "feedback-status";
    status.setAttribute("aria-live", "polite");

    const actions = document.createElement("div");
    actions.className = "feedback-actions";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "ghost-button";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", closeFeedbackModal);
    const send = document.createElement("button");
    send.type = "submit";
    send.className = "primary-button";
    send.textContent = "Send feedback";
    actions.append(cancel, send);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitFeedback({ form, messageField, emailField, honeypot, status, send });
    });

    form.append(messageField, emailField, honeypot, status, actions);
    dialog.append(title, intro, form);
    overlay.append(dialog);
    document.body.append(overlay);
    document.addEventListener("keydown", onModalKeydown);
    messageField.focus();
  }

  function onModalKeydown(event) {
    if (event.key === "Escape") closeFeedbackModal();
  }

  function closeFeedbackModal() {
    const overlay = document.querySelector(".feedback-modal-overlay");
    if (overlay) overlay.remove();
    document.removeEventListener("keydown", onModalKeydown);
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  async function submitFeedback(refs) {
    const { messageField, emailField, honeypot, status, send } = refs;
    const message = messageField.value.trim();
    if (!message) {
      status.className = "feedback-status is-error";
      status.textContent = "Please type a little feedback first.";
      messageField.focus();
      return;
    }
    if (honeypot.checked) {
      // Almost certainly a bot. Pretend success and stop.
      showThankYou(status, refs);
      return;
    }

    send.disabled = true;
    send.textContent = "Sending...";
    status.className = "feedback-status";
    status.textContent = "";

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: SITE_CONFIG.web3formsKey,
          subject: "LLM Soup to Nuts feedback",
          from_name: "LLM Soup to Nuts reader",
          message,
          email: emailField.value.trim() || "not provided",
          page: `${document.title} (${location.href})`
        })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        showThankYou(status, refs);
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      status.className = "feedback-status is-error";
      status.textContent = "Sorry, that did not send. Please check your connection and try again.";
      send.disabled = false;
      send.textContent = "Send feedback";
    }
  }

  function showThankYou(status, refs) {
    const { form } = refs;
    form.querySelectorAll("textarea, input, .feedback-actions").forEach((node) => node.remove());
    status.className = "feedback-status is-success";
    status.textContent = "Thank you. Your feedback was sent.";
    window.setTimeout(closeFeedbackModal, 1600);
  }

  // --- Analytics -------------------------------------------------------------

  function injectAnalytics() {
    if (SITE_CONFIG.goatcounterEndpoint) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.goatcounter = SITE_CONFIG.goatcounterEndpoint;
      script.src = "//gc.zgo.at/count.js";
      document.head.append(script);
      return;
    }
    if (SITE_CONFIG.cloudflareToken) {
      const script = document.createElement("script");
      script.defer = true;
      script.src = "https://static.cloudflareinsights.com/beacon.min.js";
      script.setAttribute("data-cf-beacon", JSON.stringify({ token: SITE_CONFIG.cloudflareToken }));
      document.head.append(script);
    }
    // If neither is set, do nothing at all. No tracking, no network calls.
  }

  // ---- Collapsible contents sidebar ------------------------------------------
  // Auto-hidden by default: hovering the left edge or the tab (or clicking the
  // tab) slides it out over the page. "Pin" docks it beside the page on wide
  // screens; the choice is remembered across chapters and visits.
  const TOC_PIN_KEY = "llmSoupTocPinned";
  const TOC_DOCK_QUERY = "(min-width: 1181px)";
  const LIST_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2.5 3.5h11M2.5 8h11M2.5 12.5h11" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  const PIN_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M5.5 2h5M6.5 2v4.2L4.5 9h7l-2-2.8V2M8 9v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function readTocPinned() {
    try {
      return window.localStorage.getItem(TOC_PIN_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function saveTocPinned(pinned) {
    try {
      window.localStorage.setItem(TOC_PIN_KEY, pinned ? "1" : "0");
    } catch (error) {
      // Private browsing can block storage; pinning still works for this page.
    }
  }

  // Apply the remembered choice as early as possible to avoid a layout jump.
  document.documentElement.classList.toggle("toc-pinned", readTocPinned());

  function setupContentsSidebar() {
    const toc = document.querySelector(".lesson-toc");
    if (!toc || toc.querySelector(".toc-pin")) return;
    const root = document.documentElement;
    const dock = window.matchMedia(TOC_DOCK_QUERY);
    let openTimer = 0;
    let closeTimer = 0;
    if (!toc.id) toc.id = "lesson-toc";

    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "toc-handle";
    handle.title = "Table of contents";
    handle.setAttribute("aria-label", "Show table of contents");
    handle.setAttribute("aria-controls", toc.id);
    handle.setAttribute("aria-expanded", "false");
    handle.innerHTML = LIST_ICON + '<span class="toc-handle-label">Contents</span>';

    const edge = document.createElement("div");
    edge.className = "toc-edge";
    edge.setAttribute("aria-hidden", "true");

    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "toc-pin";
    toc.prepend(pin);
    toc.after(handle, edge);

    const isPinned = () => root.classList.contains("toc-pinned");
    const isDocked = () => isPinned() && dock.matches;
    const isOpen = () => root.classList.contains("toc-open");

    function renderPin() {
      const pinned = isPinned();
      pin.setAttribute("aria-pressed", String(pinned));
      pin.title = pinned ? "Unpin: hide the contents until you need them" : "Pin: keep the contents open beside the page";
      pin.innerHTML = PIN_ICON + "<span>" + (pinned ? "Unpin" : "Pin") + "</span>";
    }

    function setOpen(open) {
      root.classList.toggle("toc-open", open);
      handle.setAttribute("aria-expanded", String(open));
    }

    function open() {
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
      if (!isDocked()) setOpen(true);
    }

    function close(returnFocus) {
      window.clearTimeout(openTimer);
      window.clearTimeout(closeTimer);
      if (!isOpen()) return;
      const hadFocus = toc.contains(document.activeElement);
      setOpen(false);
      if (returnFocus && hadFocus) handle.focus({ preventScroll: true });
    }

    function keyboardFocusInside() {
      try {
        return Boolean(toc.querySelector(":focus-visible"));
      } catch (error) {
        return false;
      }
    }

    function scheduleClose() {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        // Keep it open while a keyboard user is working inside it.
        if (!isDocked() && !keyboardFocusInside()) close(false);
      }, 350);
    }

    const isMouse = (event) => event.pointerType === "mouse";

    edge.addEventListener("pointerenter", (event) => {
      if (!isMouse(event)) return;
      window.clearTimeout(openTimer);
      openTimer = window.setTimeout(open, 120);
    });
    edge.addEventListener("pointerleave", () => window.clearTimeout(openTimer));
    handle.addEventListener("pointerenter", (event) => {
      if (isMouse(event)) open();
    });
    handle.addEventListener("click", (event) => {
      // Always opens: hovering may already have opened it a moment earlier.
      open();
      // Keyboard activation moves focus into the list; hovering and tapping do not.
      if (event.detail === 0) {
        const first = [pin, ...toc.querySelectorAll("a[href], summary")].find((el) => el.getClientRects().length > 0);
        if (first) first.focus({ preventScroll: true });
      }
    });
    toc.addEventListener("pointerenter", () => window.clearTimeout(closeTimer));
    toc.addEventListener("pointerleave", (event) => {
      if (isMouse(event) && isOpen()) scheduleClose();
    });
    toc.addEventListener("click", (event) => {
      if (event.target.closest("a[href]") && !isDocked()) close(false);
    });
    toc.addEventListener("focusout", (event) => {
      const next = event.relatedTarget;
      if (isOpen() && next && !toc.contains(next) && next !== handle) close(false);
    });
    document.addEventListener("pointerdown", (event) => {
      if (isOpen() && !toc.contains(event.target) && !handle.contains(event.target)) close(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) close(true);
    });
    pin.addEventListener("click", () => {
      const pinned = !isPinned();
      root.classList.toggle("toc-pinned", pinned);
      saveTocPinned(pinned);
      // Pinning docks it; unpinning leaves it open until the pointer moves away.
      setOpen(!pinned);
      renderPin();
    });
    const onDockChange = () => {
      if (isDocked()) setOpen(false);
    };
    if (dock.addEventListener) dock.addEventListener("change", onDockChange);
    else if (dock.addListener) dock.addListener(onDockChange);

    renderPin();
  }

  function init() {
    setupContentsSidebar();
    injectFeedbackButton();
    injectAnalytics();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
