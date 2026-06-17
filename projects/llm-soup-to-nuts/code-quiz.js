/*
 * code-quiz.js
 * Puts a short "think first" quiz in front of a runnable code cell. Until the
 * learner answers (or chooses to skip), the cell's code, controls, Run button,
 * and output stay hidden behind an `is-quiz-locked` class on the .code-cell.
 *
 * Answering reveals the code so it runs exactly as before. Wrong answers still
 * reveal (the quiz is non-blocking) and a skip link always reveals immediately.
 * It is ungraded and stores nothing. If this script is unavailable, no .code-quiz
 * markup gets wired, so the cells just render normally.
 *
 * Markup contract (authored in the chapter HTML, inside a .code-cell):
 *   <div class="code-quiz" data-quiz-type="predict|complete" data-explain="...">
 *     <p class="quiz-prompt">...</p>
 *     <div class="quiz-options">
 *       <button class="quiz-option" data-correct="true" data-feedback="...">A</button>
 *       <button class="quiz-option">B</button>
 *     </div>
 *     <p class="quiz-feedback" aria-live="polite" hidden></p>
 *     <button class="quiz-skip">Just show me the code</button>
 *   </div>
 */
(function () {
  "use strict";

  function revealCell(cell) {
    if (cell) cell.classList.remove("is-quiz-locked");
  }

  function setupQuiz(quiz) {
    if (quiz.dataset.quizReady === "1") return;
    quiz.dataset.quizReady = "1";

    var cell = quiz.closest ? quiz.closest(".code-cell") : null;
    if (cell) cell.classList.add("is-quiz-locked");

    var options = Array.prototype.slice.call(quiz.querySelectorAll(".quiz-option"));
    var feedback = quiz.querySelector(".quiz-feedback");
    var skip = quiz.querySelector(".quiz-skip");
    var explain = quiz.getAttribute("data-explain") || "";

    function answer(chosen) {
      if (quiz.dataset.answered === "1") return;
      quiz.dataset.answered = "1";
      quiz.classList.add("is-answered");

      var isCorrect = chosen.getAttribute("data-correct") === "true";

      options.forEach(function (opt) {
        if (opt.getAttribute("data-correct") === "true") {
          opt.classList.add("is-correct");
        }
        if (opt === chosen && !isCorrect) {
          opt.classList.add("is-incorrect");
        }
        opt.setAttribute("aria-disabled", "true");
      });
      chosen.classList.add("is-selected");

      if (feedback) {
        var perOption = chosen.getAttribute("data-feedback");
        var lead = isCorrect ? "Correct \u2014 " : "Not quite \u2014 ";
        feedback.textContent = lead + (perOption || explain);
        feedback.classList.remove("is-correct", "is-incorrect");
        feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
        feedback.hidden = false;
      }

      // Once answered, the escape hatch is moot.
      if (skip) skip.hidden = true;

      revealCell(cell);
    }

    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        answer(opt);
      });
    });

    if (skip) {
      skip.addEventListener("click", function () {
        revealCell(cell);
        quiz.hidden = true;
      });
    }
  }

  function setupAll() {
    var quizzes = document.querySelectorAll(".code-quiz");
    for (var i = 0; i < quizzes.length; i += 1) {
      setupQuiz(quizzes[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupAll);
  } else {
    setupAll();
  }
})();
