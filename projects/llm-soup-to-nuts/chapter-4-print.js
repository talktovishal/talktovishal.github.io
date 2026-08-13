(function () {
  "use strict";

  const LIVE_URL = "https://talktovishal.github.io/projects/llm-soup-to-nuts/chapter-4.html";
  const frame = document.getElementById("printSourceFrame");
  const output = document.getElementById("printContent");
  const status = document.getElementById("printStatus");

  function setStatus(message) {
    const detail = status.querySelector("span");
    if (detail) detail.textContent = message;
    document.documentElement.dataset.printStage = message;
  }

  function waitFor(test, timeout = 45000) {
    const started = Date.now();
    return new Promise((resolve, reject) => {
      function check() {
        try {
          if (test()) return resolve();
        } catch (error) {
          // The iframe may not be ready yet.
        }
        if (Date.now() - started > timeout) return reject(new Error("Timed out while preparing the print source."));
        setTimeout(check, 100);
      }
      check();
    });
  }

  function nextPaint() {
    return Promise.resolve();
  }

  function imported(node, stripIds = true) {
    if (!node) return document.createDocumentFragment();
    const clone = document.importNode(node, true);
    if (stripIds) {
      clone.querySelectorAll?.("[id]").forEach((element) => element.removeAttribute("id"));
      clone.removeAttribute?.("id");
    }
    clone.querySelectorAll?.("[aria-live]").forEach((element) => element.removeAttribute("aria-live"));
    return clone;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function liveNote(copy = "Try the controls and motion in the live chapter:") {
    const note = element("p", "print-interactive-note");
    note.append(document.createTextNode(`${copy} `));
    const link = element("a", "", LIVE_URL);
    link.href = LIVE_URL;
    note.append(link);
    return note;
  }

  async function captureStepper(win, doc, config) {
    const transcript = element("section", "print-transcript");
    const head = element("header", "print-transcript-head");
    head.append(element("p", "eyebrow", config.eyebrow), element("h3", "", config.heading));
    head.append(liveNote("This PDF lays out every state; the live chapter lets you move backward, forward, and replay:"));
    transcript.append(head);

    const list = element("div", "print-state-list");
    for (let index = 0; index < config.count; index += 1) {
      win[config.setter](index);
      await nextPaint(win);
      const state = element("article", "print-state");
      state.append(
        element("p", "eyebrow", `Step ${index + 1} of ${config.count}`),
        element("h4", "", doc.getElementById(config.titleId).textContent.trim()),
        element("p", "print-state-copy", doc.getElementById(config.copyId).textContent.trim()),
        imported(doc.getElementById(config.panelId))
      );
      list.append(state);
    }
    transcript.append(list);
    return transcript;
  }

  async function captureWorksheet(win, doc) {
    win.resetByHandWorksheet();
    await nextPaint(win);

    const transcript = element("section", "print-transcript");
    const head = element("header", "print-transcript-head");
    head.append(
      element("p", "eyebrow", "Solved worksheet transcript"),
      element("h3", "", "Do one complete training step by hand - all 13 solutions")
    );
    head.append(liveNote("The live worksheet lets you attempt each number, ask for progressive hints, and receive immediate feedback:"));
    transcript.append(head);

    const intro = element("div", "print-worksheet-intro");
    intro.append(imported(doc.getElementById("byHandSvg")), imported(doc.getElementById("byHandMiniFacts")));
    transcript.append(intro);

    const steps = element("div", "print-worksheet-steps");
    for (let index = 0; index < 13; index += 1) {
      win.revealByHandSolution();
      await nextPaint(win);
      const card = element("article", "print-worksheet-step");
      card.append(
        element("p", "eyebrow", doc.getElementById("byHandProgress").textContent.trim()),
        element("h4", "", doc.getElementById("byHandPrompt").textContent.trim()),
        imported(doc.getElementById("byHandInstruction")),
        imported(doc.getElementById("byHandEquation")),
        imported(doc.getElementById("byHandFeedback"))
      );
      steps.append(card);
      if (index < 12) {
        win.moveByHandStep(1);
        await nextPaint(win);
      }
    }
    transcript.append(steps);
    return transcript;
  }

  function revealQuizAnswers(root) {
    root.querySelectorAll(".code-quiz").forEach((quiz) => {
      const correct = quiz.querySelector('.quiz-option[data-correct="true"]');
      if (correct) correct.classList.add("print-correct-answer");
      const answer = element("p", "print-quiz-answer");
      const label = correct ? `Answer: ${correct.textContent.trim()}. ` : "Answer shown in the live chapter. ";
      answer.textContent = label + (quiz.dataset.explain || "");
      quiz.append(answer);
    });
  }

  function openDisclosures(root) {
    root.querySelectorAll("details").forEach((details) => {
      details.open = true;
      details.setAttribute("open", "");
    });
  }

  function buildCover(sourceDoc) {
    const cover = element("section", "print-cover");
    cover.append(
      element("p", "eyebrow", "LLM Soup to Nuts - Chapter 4 - Print edition"),
      element("h1", "", sourceDoc.getElementById("page-title").textContent.trim()),
      element("p", "print-cover-deck", "Probability, vectors, forward passes, softmax, gradients, backpropagation, and a real browser-trained next-word model - with every learner-controlled transition expanded into a readable static sequence.")
    );
    cover.append(liveNote("This print edition preserves the worked states. For sliders, animation, answer checking, and training, use the live chapter:"));
    const date = element("p", "microcopy", `Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
    cover.append(date);
    return cover;
  }

  function buildToc(chapter) {
    const toc = element("nav", "print-toc");
    toc.setAttribute("aria-label", "Print edition contents");
    toc.append(element("p", "eyebrow", "Contents"), element("h2", "", "Chapter map"));
    const list = document.createElement("ol");
    chapter.querySelectorAll(":scope > section[id]").forEach((section) => {
      const heading = section.querySelector("h1, h2");
      if (!heading) return;
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.textContent = heading.textContent.trim();
      item.append(link);
      list.append(item);
    });
    toc.append(list);
    return toc;
  }

  async function build() {
    setStatus("Waiting for the frozen chapter source...");
    await waitFor(() => {
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      return doc?.readyState === "complete"
        && typeof win?.setForwardStep === "function"
        && typeof win?.trainNextWordModel === "function"
        && doc.getElementById("byHandLab");
    });

    const win = frame.contentWindow;
    const sourceDoc = frame.contentDocument;
    await sourceDoc.fonts?.ready;

    setStatus("Capturing five forward-pass states...");
    const forward = await captureStepper(win, sourceDoc, {
      eyebrow: "Five forward-pass states",
      heading: "One forward pass, laid out from lookup to logits",
      count: 5,
      setter: "setForwardStep",
      titleId: "forward-step-title",
      copyId: "forwardStepCopy",
      panelId: "forwardPanel"
    });
    setStatus("Capturing four softmax states...");
    const softmax = await captureStepper(win, sourceDoc, {
      eyebrow: "Four softmax states",
      heading: "Temperature, stabilization, exponentiation, normalization, and loss",
      count: 4,
      setter: "setSoftmaxStep",
      titleId: "softmax-step-title",
      copyId: "softmaxStepCopy",
      panelId: "softmaxStepPanel"
    });
    setStatus("Capturing four gradient-descent states...");
    const gradient = await captureStepper(win, sourceDoc, {
      eyebrow: "Four gradient-descent states",
      heading: "Measure the loss, find the gradient, plan the update, check the result",
      count: 4,
      setter: "setGradientWalkthroughStep",
      titleId: "gradient-step-title",
      copyId: "gradientStepCopy",
      panelId: "gradientStepPanel"
    });
    setStatus("Solving and capturing the 13-step worksheet...");
    const worksheet = await captureWorksheet(win, sourceDoc);

    // Prepare deterministic snapshots for panels that otherwise begin blank.
    setStatus("Preparing deterministic training snapshots...");
    sourceDoc.getElementById("backpropNudgeButton")?.click();
    win.trainNextWordModel(2);
    const originalRandom = win.Math.random;
    win.Math.random = win.mulberry32(20260812);
    sourceDoc.getElementById("nwGenerateButton")?.click();
    win.Math.random = originalRandom;
    await nextPaint(win);

    setStatus("Assembling the print edition...");
    const chapter = imported(sourceDoc.querySelector("main"), false);
    chapter.classList.add("print-chapter");
    chapter.querySelector("#forward-walkthrough")?.replaceWith(forward);
    chapter.querySelector("#softmax-walkthrough")?.replaceWith(softmax);
    chapter.querySelector("#gradient-walkthrough")?.replaceWith(gradient);
    chapter.querySelector("#byHandLab")?.replaceWith(worksheet);
    chapter.querySelectorAll("[frozen]").forEach((node) => node.removeAttribute("frozen"));
    openDisclosures(chapter);
    revealQuizAnswers(chapter);

    chapter.querySelectorAll(".trainer, .math-lab-grid, .vector-grid, .network-grid, .backprop-grid").forEach((panel) => {
      panel.insertAdjacentElement("beforebegin", liveNote());
    });

    output.replaceChildren(buildCover(sourceDoc), buildToc(chapter), chapter);
    document.title = "Chapter 4 - The Math Behind Predicting the Next Word - Print Edition";
    document.body.classList.add("is-ready");
    document.documentElement.dataset.printReady = "true";
    status.replaceChildren();
  }

  let buildStarted = false;
  function startBuild() {
    if (buildStarted) return;
    buildStarted = true;
    setStatus("Starting the state-capture pass...");
    build().catch((error) => {
      console.error(error);
      const failure = element("div", "print-failure");
      failure.append(element("h1", "", "The print edition could not be prepared."), element("pre", "", error.stack || error.message));
      output.replaceChildren(failure);
      output.style.display = "block";
      status.style.display = "none";
      document.title = "ERROR - Chapter 4 print edition";
    });
  }

  frame.addEventListener("load", startBuild, { once: true });
  queueMicrotask(startBuild);
}());
