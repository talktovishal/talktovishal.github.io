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

  function stepperNote(section, count) {
    if (!section) return;
    const note = liveNote(`This shows the opening state only. Step through all ${count} states, backward and forward, in the live chapter:`);
    const panel = section.querySelector(".forward-panel, .softmax-step-panel, .gradient-step-panel");
    (panel || section).insertAdjacentElement("beforebegin", note);
  }

  async function captureWorksheet(win, doc) {
    win.resetByHandWorksheet();
    await nextPaint(win);

    const transcript = element("section", "print-transcript");
    const head = element("header", "print-transcript-head");
    head.append(
      element("p", "eyebrow", "Work it by hand"),
      element("h3", "", "Do one complete training step yourself - all 13 prompts")
    );
    head.append(liveNote("Solutions are in the answer key at the end of this PDF. The live worksheet checks each number and offers progressive hints:"));
    transcript.append(head);

    const intro = element("div", "print-worksheet-intro");
    intro.append(imported(doc.getElementById("byHandSvg")), imported(doc.getElementById("byHandMiniFacts")));
    transcript.append(intro);

    const answers = [];
    const steps = element("div", "print-worksheet-steps");
    for (let index = 0; index < 13; index += 1) {
      const card = element("article", "print-worksheet-step");
      card.append(
        element("p", "eyebrow", doc.getElementById("byHandProgress").textContent.trim()),
        element("h4", "", doc.getElementById("byHandPrompt").textContent.trim()),
        imported(doc.getElementById("byHandInstruction")),
        imported(doc.getElementById("byHandEquation")),
        element("p", "print-answer-line", "Your answer:")
      );
      steps.append(card);

      win.revealByHandSolution();
      await nextPaint(win);
      const solution = imported(doc.getElementById("byHandFeedback"));
      solution.innerHTML = solution.innerHTML.replace(/^\s*Solution revealed\.\s*/i, "");
      answers.push({ label: `Step ${index + 1}.`, solution });

      if (index < 12) {
        win.moveByHandStep(1);
        await nextPaint(win);
      }
    }
    transcript.append(steps);
    return { transcript, answers };
  }

  function collectQuizAnswers(root) {
    const answers = [];
    root.querySelectorAll(".code-quiz").forEach((quiz, index) => {
      const number = index + 1;
      const correct = quiz.querySelector('.quiz-option[data-correct="true"]');
      answers.push({
        number,
        answer: correct ? correct.textContent.trim() : "See the live chapter.",
        explain: quiz.dataset.explain || ""
      });
      quiz.append(element("p", "print-quiz-ref", `Quick check ${number} - answer in the key at the end.`));
    });
    return answers;
  }

  function buildAnswerKey(worksheetAnswers, quizAnswers) {
    const key = element("section", "print-answer-key");
    key.append(
      element("p", "eyebrow", "Answer key"),
      element("h2", "", "Worksheet solutions and quick-check answers"),
      element("p", "print-answer-intro", "Work each problem on paper first, then check it here. The live chapter marks your answer immediately and offers progressive hints before showing any solution.")
    );

    if (worksheetAnswers.length) {
      const block = element("div", "print-answer-block");
      block.append(element("h3", "", "By-hand worksheet"));
      const list = element("ol", "print-answer-list");
      worksheetAnswers.forEach((entry) => {
        const item = document.createElement("li");
        item.append(element("strong", "", `${entry.label} `), entry.solution);
        list.append(item);
      });
      block.append(list);
      key.append(block);
    }

    if (quizAnswers.length) {
      const block = element("div", "print-answer-block");
      block.append(element("h3", "", "Quick checks"));
      const list = element("ol", "print-answer-list");
      quizAnswers.forEach((entry) => {
        const item = document.createElement("li");
        item.append(element("strong", "", entry.answer));
        if (entry.explain) item.append(document.createTextNode(` ${entry.explain}`));
        list.append(item);
      });
      block.append(list);
      key.append(block);
    }

    return key;
  }

  function buildCover(sourceDoc) {
    const cover = element("section", "print-cover");
    cover.append(
      element("p", "eyebrow", "LLM Soup to Nuts - Chapter 4 - Print edition"),
      element("h1", "", sourceDoc.getElementById("page-title").textContent.trim()),
      element("p", "print-cover-deck", "Probability, vectors, forward passes, softmax, gradients, backpropagation, and a real browser-trained next-word model - a compact companion you can read and work through on paper.")
    );
    cover.append(liveNote("This is the short form. For the step-by-step walkthroughs, sliders, animation, answer checking, and training, use the live chapter:"));
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

    setStatus("Setting each walkthrough to its opening state...");
    win.setForwardStep(0);
    win.setSoftmaxStep(0);
    win.setGradientWalkthroughStep(0);
    await nextPaint(win);

    setStatus("Collecting the 13 worksheet prompts...");
    const { transcript: worksheet, answers: worksheetAnswers } = await captureWorksheet(win, sourceDoc);

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
    stepperNote(chapter.querySelector("#forward-walkthrough"), 5);
    stepperNote(chapter.querySelector("#softmax-walkthrough"), 4);
    stepperNote(chapter.querySelector("#gradient-walkthrough"), 4);
    chapter.querySelector("#byHandLab")?.replaceWith(worksheet);
    chapter.querySelectorAll("[frozen]").forEach((node) => node.removeAttribute("frozen"));
    const quizAnswers = collectQuizAnswers(chapter);

    chapter.querySelectorAll(".trainer, .math-lab-grid, .vector-grid, .network-grid, .backprop-grid").forEach((panel) => {
      panel.insertAdjacentElement("beforebegin", liveNote());
    });

    output.replaceChildren(buildCover(sourceDoc), buildToc(chapter), chapter, buildAnswerKey(worksheetAnswers, quizAnswers));
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
