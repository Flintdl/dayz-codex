"use client";

import { useMemo, useState } from "react";
import { QUIZ } from "@/data/quiz";

/**
 * Quiz interativo. Estado local apenas — não persiste resultado.
 * Foco: aprendizado + reforço da explicação após resposta.
 */

const DIFFICULTY_TONE = {
  fresh: { color: "var(--c-olive-bright)", label: "FRESH SPAWN" },
  intermediate: { color: "var(--c-brass)", label: "INTERMEDIATE" },
  veteran: { color: "var(--c-blood-bright)", label: "VETERAN" },
};

export function QuizApp() {
  const questions = useMemo(() => {
    return [...QUIZ].sort(() => Math.random() - 0.5);
  }, []);

  const [idx, setIdx] = useState(0);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const q = questions[idx];
  const tone = DIFFICULTY_TONE[q.difficulty];

  function choose(i: number) {
    if (chosenIdx !== null) return;
    setChosenIdx(i);
    setScore((s) => ({
      correct: s.correct + (q.options[i].correct ? 1 : 0),
      total: s.total + 1,
    }));
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setChosenIdx(null);
    } else {
      // reinicia
      setIdx(0);
      setChosenIdx(null);
      setScore({ correct: 0, total: 0 });
    }
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[var(--c-ash)] tracking-widest">
          QUESTÃO {idx + 1} / {questions.length}
        </span>
        <span style={{ color: tone.color }}>{tone.label}</span>
        <span className="text-[var(--c-bone)]">
          ACERTOS: {score.correct} / {score.total}
        </span>
      </div>

      <article className="panel">
        <div className="panel-header">
          <span className="panel-header__title">Cenário</span>
        </div>
        <div className="panel-body space-y-4">
          <p className="text-[var(--c-bone-dim)] leading-relaxed border-l-2 border-[var(--c-border-strong)] pl-4">
            {q.scenario}
          </p>
          <p className="text-[var(--c-bone)] font-medium">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isChosen = chosenIdx === i;
              const isCorrect = opt.correct;
              const reveal = chosenIdx !== null;
              const stateBg = !reveal
                ? "border-[var(--c-border)] hover:border-[var(--c-olive)]"
                : isCorrect
                ? "border-[var(--c-olive-bright)] bg-[var(--c-olive)]/15"
                : isChosen
                ? "border-[var(--c-blood-bright)] bg-[var(--c-blood)]/10"
                : "border-[var(--c-border)] opacity-60";
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={reveal}
                  className={`w-full text-left p-3 border transition-all ${stateBg} disabled:cursor-default`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="font-stencil text-sm shrink-0 w-6 text-center"
                      style={{
                        color: reveal
                          ? isCorrect
                            ? "var(--c-olive-bright)"
                            : isChosen
                            ? "var(--c-blood-bright)"
                            : "var(--c-ash)"
                          : "var(--c-bone-dim)",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm text-[var(--c-bone)]">{opt.label}</div>
                      {reveal && (
                        <p className="text-xs text-[var(--c-bone-dim)] mt-2 leading-relaxed">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                    {reveal && isCorrect && (
                      <span className="text-xs font-mono text-[var(--c-olive-bright)] tracking-widest">
                        ✓ CORRETO
                      </span>
                    )}
                    {reveal && !isCorrect && isChosen && (
                      <span className="text-xs font-mono text-[var(--c-blood-bright)] tracking-widest">
                        ✗ ERRADO
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {chosenIdx !== null && (
            <button onClick={next} className="btn">
              <i className="fi-rr-arrow-right" />
              {idx + 1 < questions.length ? "PRÓXIMA" : "REINICIAR"}
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
