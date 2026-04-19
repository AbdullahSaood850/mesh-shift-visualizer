import { STEP_KEYS } from "../utils/shiftLogic";

const STEP_LABELS = {
  [STEP_KEYS.INITIAL]: "START",
  [STEP_KEYS.STAGE_1]: "STAGE 1",
  [STEP_KEYS.FINAL]: "FINISH",
};

const STEP_SEQUENCE = [STEP_KEYS.INITIAL, STEP_KEYS.STAGE_1, STEP_KEYS.FINAL];

export default function ControlPanel({ p, q, onPChange, onQChange, validation, currentStep, onStepChange, isPlaying, onTogglePlay, onNextStep, onReset }) {
  const isPInvalid = Boolean(validation.errors.p);
  const isQInvalid = Boolean(validation.errors.q);
  const isFinalStep = currentStep === STEP_KEYS.FINAL;

  return (
    <>
      <div className="rounded-2xl border-[3px] border-black bg-blue-400 p-5 sm:p-6 shadow-[6px_6px_0_0_#000] flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
        <p className="text-xs font-black uppercase text-black/80 mb-4 border-b-2 border-black/20 pb-2 tracking-widest">
          Nodes & Shift
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-black uppercase text-black">Nodes (p)</span>
            <input
              type="number" min={4} max={64} step={1} value={p} onChange={onPChange}
              aria-invalid={isPInvalid}
              className={`w-full rounded-xl bg-white border-[3px] px-3 py-2 text-base font-black text-black outline-none transition-transform focus:-translate-y-0.5 focus:shadow-[4px_4px_0_0_#000] ${isPInvalid ? "border-red-600 bg-red-50 text-red-600 focus:shadow-[4px_4px_0_0_#dc2626]" : "border-black shadow-[2px_2px_0_0_#000]"}`}
            />
            {isPInvalid && <p className="mt-2 text-xs font-black uppercase text-white bg-red-600 border-2 border-black p-1.5 shadow-[2px_2px_0_0_#000] inline-block">{validation.errors.p}</p>}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-black uppercase text-black">Shift (q)</span>
            <input
              type="number" min={1} max={Math.max(1, p - 1)} step={1} value={q} onChange={onQChange}
              aria-invalid={isQInvalid}
              className={`w-full rounded-xl bg-white border-[3px] px-3 py-2 text-base font-black text-black outline-none transition-transform focus:-translate-y-0.5 focus:shadow-[4px_4px_0_0_#000] ${isQInvalid ? "border-red-600 bg-red-50 text-red-600 focus:shadow-[4px_4px_0_0_#dc2626]" : "border-black shadow-[2px_2px_0_0_#000]"}`}
            />
            {isQInvalid && <p className="mt-2 text-xs font-black uppercase text-white bg-red-600 border-2 border-black p-1.5 shadow-[2px_2px_0_0_#000] inline-block">{validation.errors.q}</p>}
          </label>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border-[3px] border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0_0_#000] flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
        <p className="text-xs font-black uppercase text-black/60 mb-4 border-b-2 border-black/10 pb-2 tracking-widest">
          Playback
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {STEP_SEQUENCE.map((stepKey) => {
            const isActive = currentStep === stepKey;
            return (
              <button
                key={stepKey} type="button" onClick={() => onStepChange(stepKey)} disabled={!validation.isValid}
                className={`rounded-lg border-[3px] border-black px-1 py-2 text-[10px] sm:text-xs font-black uppercase transition-all duration-200 ${isActive ? "bg-yellow-400 text-black shadow-none translate-y-0.5 translate-x-0.5" : "bg-gray-100 text-black hover:-translate-y-0.5 shadow-[2px_2px_0_0_#000]"} disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[2px_2px_0_0_#000]`}
              >
                {STEP_LABELS[stepKey]}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <button
            type="button" onClick={onTogglePlay} disabled={!validation.isValid || (isFinalStep && !isPlaying)}
            className="w-full rounded-xl border-[3px] border-black bg-red-500 px-4 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#000]"
          >
            {isPlaying ? "PAUSE" : isFinalStep ? "REPLAY" : "PLAY"}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button" onClick={onNextStep} disabled={!validation.isValid || isPlaying || isFinalStep}
              className="rounded-xl border-[3px] border-black bg-white px-3 py-2 text-xs font-black uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:bg-gray-50 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              NEXT
            </button>
            <button
              type="button" onClick={onReset} disabled={!validation.isValid && currentStep === STEP_KEYS.INITIAL}
              className="rounded-xl border-[3px] border-black bg-white px-3 py-2 text-xs font-black uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:bg-gray-50 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
