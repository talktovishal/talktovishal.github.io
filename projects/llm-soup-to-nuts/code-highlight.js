/*
 * code-highlight.js
 * Adds syntax highlighting to the runnable code cells without changing how they
 * work. Each editable <textarea class="code-input"> is layered on top of a
 * highlighted <pre> that mirrors its text. The textarea keeps its real value
 * (run logic still reads .value), but its own text is made transparent so the
 * colored layer shows through. If highlight.js is unavailable, the textareas are
 * left exactly as they are, so the page still works offline.
 */
(function () {
  "use strict";

  function highlightOne(textarea) {
    if (textarea.dataset.hlReady === "1") return;
    if (textarea.tagName !== "TEXTAREA") return;

    var wrap = document.createElement("div");
    wrap.className = "code-input-wrap";

    var pre = document.createElement("pre");
    pre.className = "code-input-highlight";
    pre.setAttribute("aria-hidden", "true");

    var code = document.createElement("code");
    code.className = "hljs language-javascript";
    pre.appendChild(code);

    // Place the wrapper where the textarea is, then nest both inside it.
    textarea.parentNode.insertBefore(wrap, textarea);
    wrap.appendChild(pre);
    wrap.appendChild(textarea);

    textarea.classList.add("code-input-overlay");
    textarea.setAttribute("wrap", "off");
    textarea.setAttribute("spellcheck", "false");

    function render() {
      var text = textarea.value;
      var hljs = window.hljs;
      if (hljs && typeof hljs.highlight === "function") {
        try {
          code.innerHTML = hljs.highlight(text, { language: "javascript" }).value;
        } catch (error) {
          code.textContent = text;
        }
      } else {
        code.textContent = text;
      }
    }

    function syncScroll() {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    }

    textarea.addEventListener("input", function () {
      render();
      syncScroll();
    });
    textarea.addEventListener("scroll", syncScroll);
    window.addEventListener("resize", syncScroll);

    textarea.dataset.hlReady = "1";
    render();
    syncScroll();
  }

  function highlightAll() {
    var textareas = document.querySelectorAll(".code-input");
    for (var i = 0; i < textareas.length; i += 1) {
      highlightOne(textareas[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", highlightAll);
  } else {
    highlightAll();
  }
})();
