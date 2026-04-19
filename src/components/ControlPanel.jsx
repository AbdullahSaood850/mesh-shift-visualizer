import { STEP_KEYS } from "../utils/shiftLogic";

const STEP_LABELS = {
  [STEP_KEYS.INITIAL]: "START",
  [STEP_KEYS.STAGE_1]: "STAGE 1",
  [STEP_KEYS.FINAL]: "FINISHED",
};

const STEP_SEQUENCE = [STEP_KEYS.INITIAL, STEP_KEYS.STAGE_1, STEP_KEYS.FINAL];

export default function ControlPanel({
  p,
  q,
  onPChange,
  onQChange,
  validation,
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  onNextStep,
  onReset,
}) {
  const isPInvalid = Boolean(validation.errors.p);
  const isQInvalid = Boolean(validation.errors.q);
  const isFinalStep = currentStep === STEP_KEYS.FINAL;

  return (
    <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
      <div className="mb-6 border-b-4 border-black pb-4">
        <p className="text-sm font-black uppercase tracking-widest text-black">
          Settings
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-tighter text-black">
          Configuration
        </h2>
        <p className="mt-2 text-base font-bold text-black border-l-4 border-black pl-4">
          Node i sends data to (i + q) mod p.
        </p>
      </div>

      <div className="space-y-6">
        <label className="block">
          <span className="mb-2 block text-xl font-black uppercase text-black">
            Nodes (p)
          </span>
          <input
            type="number"
            min={4}
            max={64}
            step={1}
            value={p}
            onChange={onPChange}
            aria-invalid={isPInvalid}
            className={`w-full bg-white border-4 px-4 py-3 text-lg font-black text-black outline-none transition-transform focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] ${
              isPInvalid
                ? "border-red-600 bg-red-50 focus:shadow-[4px_4px_0_0_#dc2626]"
                : "border-black"
            }`}
          />
          <p className="mt-2 text-sm font-bold uppercase text-black">Squares from 4 to 64.</p>
          {isPInvalid ? (
            <p className="mt-2 text-base font-black uppercase text-red-600 bg-red-100 border-4 border-red-600 p-2 inline-block shadow-[4px_4px_0_0_#dc2626]">{validation.errors.p}</p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-xl font-black uppercase text-black">
            Shift (q)
          </span>
          <input
            type="number"
            min={1}
            max={Math.max(1, p - 1)}
            step={1}
            value={q}
            onChange={onQChange}
            aria-invalid={isQInvalid}
            className={`w-full bg-white border-4 px-4 py-3 text-lg font-black text-black outline-none transition-transform focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] ${
              isQInvalid
                ? "border-red-600 bg-red-50 focus:shadow-[4px_4px_0_0_#dc2626]"
                : "border-black"
            }`}
          />
          <p className="mt-2 text-sm font-bold uppercase text-black">From 1 up to p - 1.</p>
          {isQInvalid ? (
            <p className="mt-2 text-base font-black uppercase text-red-600 bg-red-100 border-4 border-red-600 p-2 inline-block shadow-[4px_4px_0_0_#dc2626]">{validation.errors.q}</p>
          ) : null}
        </label>
      </div>

      <div className="mt-8 border-t-4 border-black pt-6">
        <p className="mb-4 text-sm font-black uppercase tracking-widest text-black">
          Stages
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEP_SEQUENCE.map((stepKey) => {
            const isActive = currentStep === stepKey;

            return (
              <button
                key={stepKey}
                type="button"
                onClick={() => onStepChange(stepKey)}
                disabled={!validation.isValid}
                className={`border-4 px-3 py-3 text-base font-black uppercase transition-all duration-200 ${
                  isActive
                    ? "border-black bg-black text-white shadow-[4px_4px_0_0_#000] translate-y-1 translate-x-1 shadow-none"
                    : "border-black bg-white text-black hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]"
                } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
              >
                {STEP_LABELS[stepKey]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 bg-gray-100 border-4 border-black p-5 shadow-[4px_4px_0_0_#000]">
        <p className="mb-4 text-sm font-black uppercase tracking-widest text-black">
          Playback
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!validation.isValid || (isFinalStep && !isPlaying)}
            className="border-4 border-black bg-black px-4 py-3 text-base font-black uppercase text-white transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isPlaying ? "PAUSE" : isFinalStep ? "REPLAY" : "PLAY"}
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={!validation.isValid || isPlaying || isFinalStep}
            className="border-4 border-black bg-white px-4 py-3 text-base font-black uppercase text-black transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            NEXT
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={!validation.isValid && currentStep === STEP_KEYS.INITIAL}
            className="border-4 border-black bg-white px-4 py-3 text-base font-black uppercase text-black transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            RESET
          </button>
        </div>
      </div>

      {validation.isValid ? (
        <p className="mt-8 border-4 border-black bg-white p-4 text-base font-black uppercase text-black shadow-[4px_4px_0_0_#000]">
          VALID INPUT. Ready.
        </p>
      ) : (
        <p className="mt-8 border-4 border-black bg-gray-200 p-4 text-base font-black uppercase text-black shadow-[4px_4px_0_0_#000]">
          INVALID INPUT.
        </p>
      )}
    </section>
  );
}
