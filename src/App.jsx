import { useEffect, useMemo, useState } from "react";
import ControlPanel from "./components/ControlPanel";
import ComplexityPanel from "./components/ComplexityPanel";
import MeshGrid from "./components/MeshGrid";
import { STEP_KEYS, getShiftStates, validateShiftParameters } from "./utils/shiftLogic";

const DEFAULT_P = 16;
const DEFAULT_Q = 5;

const STEP_COPY = {
  [STEP_KEYS.INITIAL]: "START",
  [STEP_KEYS.STAGE_1]: "STAGE 1 ROW SHIFT",
  [STEP_KEYS.FINAL]: "STAGE 2 COLUMN SHIFT",
};

const STEP_SEQUENCE = [STEP_KEYS.INITIAL, STEP_KEYS.STAGE_1, STEP_KEYS.FINAL];

export default function App() {
  const [pInput, setPInput] = useState(String(DEFAULT_P));
  const [qInput, setQInput] = useState(String(DEFAULT_Q));
  const [currentStep, setCurrentStep] = useState(STEP_KEYS.INITIAL);
  const [isPlaying, setIsPlaying] = useState(false);

  const p = Number.parseInt(pInput, 10);
  const q = Number.parseInt(qInput, 10);

  const validation = useMemo(() => validateShiftParameters(p, q), [p, q]);
  const shiftStates = useMemo(() => {
    if (!validation.isValid) {
      return null;
    }

    return getShiftStates(p, q);
  }, [p, q, validation.isValid]);

  function handlePChange(event) {
    setPInput(event.target.value);
  }

  function handleQChange(event) {
    setQInput(event.target.value);
  }

  function handleStepChange(stepKey) {
    setCurrentStep(stepKey);
    setIsPlaying(false);
  }

  function handleNextStep() {
    setIsPlaying(false);
    setCurrentStep((previousStep) => {
      const previousIndex = STEP_SEQUENCE.indexOf(previousStep);
      if (previousIndex < 0 || previousIndex >= STEP_SEQUENCE.length - 1) {
        return STEP_KEYS.FINAL;
      }

      return STEP_SEQUENCE[previousIndex + 1];
    });
  }

  function handleReset() {
    setCurrentStep(STEP_KEYS.INITIAL);
    setIsPlaying(false);
  }

  function handleTogglePlay() {
    if (!validation.isValid) {
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (currentStep === STEP_KEYS.FINAL) {
      setCurrentStep(STEP_KEYS.INITIAL);
    }

    setIsPlaying(true);
  }

  useEffect(() => {
    setCurrentStep(STEP_KEYS.INITIAL);
    setIsPlaying(false);
  }, [pInput, qInput]);

  useEffect(() => {
    if (!isPlaying || !validation.isValid) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentStep((previousStep) => {
        const previousIndex = STEP_SEQUENCE.indexOf(previousStep);

        if (previousIndex >= STEP_SEQUENCE.length - 1) {
          setIsPlaying(false);
          return STEP_KEYS.FINAL;
        }

        return STEP_SEQUENCE[previousIndex + 1];
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isPlaying, validation.isValid]);

  return (
    <main className="min-h-screen bg-white bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] px-4 py-12 text-black sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000] lg:p-12">
          <p className="text-sm font-black uppercase tracking-widest text-black border-b-4 border-black pb-4 mb-4">
            Data Routine
          </p>
          <h1 className="max-w-4xl text-5xl font-black uppercase leading-none tracking-tighter text-black lg:text-7xl">
            Mesh Circular Shift
          </h1>
          <p className="mt-8 max-w-2xl text-xl font-bold text-black border-l-4 border-black pl-6">
            Stage 1: Row shift of q mod sqrt(p).
            <br />
            Stage 2: Column shift of floor(q / sqrt(p)).
          </p>
        </header>

        <section className="grid gap-12 lg:grid-cols-[400px_1fr]">
          <ControlPanel
            p={pInput}
            q={qInput}
            onPChange={handlePChange}
            onQChange={handleQChange}
            validation={validation}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onNextStep={handleNextStep}
            onReset={handleReset}
          />

          <div className="space-y-12">
            <article className="border-4 border-black bg-gray-100 p-8 shadow-[8px_8px_0_0_#000] lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-6 border-b-4 border-black pb-6">
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-black">
                    State
                  </p>
                  <h2 className="mt-2 text-4xl font-black uppercase tracking-tighter text-black">
                    {STEP_COPY[currentStep]}
                  </h2>
                </div>
                {validation.isValid ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="border-4 border-black bg-white px-5 py-2 text-base font-black uppercase text-black shadow-[4px_4px_0_0_#000]">
                      p={p} | q={q}
                    </span>
                    {isPlaying ? (
                      <span className="border-4 border-black bg-black px-5 py-2 text-base font-black uppercase text-white shadow-[4px_4px_0_0_#000]">
                        AUTO-PLAY
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <span className="border-4 border-black bg-red-100 px-5 py-2 text-base font-black uppercase text-red-700 shadow-[4px_4px_0_0_#b91c1c]">
                    WAITING
                  </span>
                )}
              </div>

              <div className="mt-10">
                <MeshGrid
                  validation={validation}
                  shiftStates={shiftStates}
                  currentStep={currentStep}
                />
              </div>
            </article>

            <ComplexityPanel
              p={p}
              q={q}
              validation={validation}
              shiftStates={shiftStates}
            />
          </div>
        </section>
      </div>
    </main>
  );
}