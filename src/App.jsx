import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ControlPanel from "./components/ControlPanel";
import ComplexityPanel from "./components/ComplexityPanel";
import MeshGrid from "./components/MeshGrid";
import { STEP_KEYS, getShiftStates, validateShiftParameters } from "./utils/shiftLogic";

const DEFAULT_P = 16;
const DEFAULT_Q = 5;

const STEP_COPY = {
  [STEP_KEYS.INITIAL]: "READY",
  [STEP_KEYS.STAGE_1]: "STAGE 1 DONE",
  [STEP_KEYS.FINAL]: "STAGE 2 DONE",
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

  function handlePChange(event) { setPInput(event.target.value); }
  function handleQChange(event) { setQInput(event.target.value); }
  function handleStepChange(stepKey) { setCurrentStep(stepKey); setIsPlaying(false); }

  function handleNextStep() {
    setIsPlaying(false);
    setCurrentStep((previousStep) => {
      const previousIndex = STEP_SEQUENCE.indexOf(previousStep);
      return previousIndex < 0 || previousIndex >= STEP_SEQUENCE.length - 1 ? STEP_KEYS.FINAL : STEP_SEQUENCE[previousIndex + 1];
    });
  }

  function handleReset() { setCurrentStep(STEP_KEYS.INITIAL); setIsPlaying(false); }

  function handleTogglePlay() {
    if (!validation.isValid) return;
    if (isPlaying) return setIsPlaying(false);
    if (currentStep === STEP_KEYS.FINAL) setCurrentStep(STEP_KEYS.INITIAL);
    setIsPlaying(true);
  }

  useEffect(() => {
    setCurrentStep(STEP_KEYS.INITIAL);
    setIsPlaying(false);
  }, [pInput, qInput]);

  useEffect(() => {
    if (!isPlaying || !validation.isValid) return;
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
    <main className="min-h-screen bg-[#fdfdf5] text-black font-sans p-4 sm:p-6 lg:p-8 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:32px_32px]">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-min"
        >
          {/* Header - span 9 */}
          <header className="col-span-1 md:col-span-4 lg:col-span-9 rounded-2xl border-[3px] border-black bg-yellow-400 p-6 sm:p-8 shadow-[6px_6px_0_0_#000] flex flex-col justify-center transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-4 h-4 bg-red-500 rounded-full border-2 border-black drop-shadow-[2px_2px_0_0_#000]"></span>
              <span className="w-4 h-4 bg-blue-500 rounded-full border-2 border-black drop-shadow-[2px_2px_0_0_#000]"></span>
              <p className="text-xs font-black uppercase tracking-widest text-black/80 ml-2">Data Routine</p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-black leading-none drop-shadow-[2px_2px_0_0_#fff]">
              Mesh Shift Visualization
            </h1>
          </header>

          {/* Status Box - span 3 */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 rounded-2xl border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_0_#000] flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
             <p className="text-sm font-black uppercase tracking-wider text-black/60 mb-2">Current State</p>
             <h2 className="text-3xl sm:text-4xl font-black uppercase text-red-500 drop-shadow-[2px_2px_0_0_#000]">{STEP_COPY[currentStep]}</h2>
             {validation.isValid && isPlaying && (
               <span className="mt-3 bg-blue-500 text-white font-black text-xs px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0_0_#000]">AUTO-PLAYING</span>
             )}
          </div>

          {/* Control Panel - span 3 */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-4">
            <ControlPanel
              p={pInput} q={qInput}
              onPChange={handlePChange} onQChange={handleQChange}
              validation={validation} currentStep={currentStep} onStepChange={handleStepChange}
              isPlaying={isPlaying} onTogglePlay={handleTogglePlay} onNextStep={handleNextStep} onReset={handleReset}
            />
          </div>

          {/* Mesh Grid - span 6 */}
          <div className="col-span-1 md:col-span-2 lg:col-span-6 flex flex-col gap-4 min-h-[500px]">
            <MeshGrid validation={validation} shiftStates={shiftStates} currentStep={currentStep} />
          </div>

          {/* Complexity - span 3 */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <ComplexityPanel p={p} q={q} validation={validation} shiftStates={shiftStates} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}