import { LayoutGroup, motion, AnimatePresence } from "framer-motion";
import { STEP_KEYS } from "../utils/shiftLogic";

const STAGE_HINTS = {
  [STEP_KEYS.INITIAL]: "Data is stationary before movement.",
  [STEP_KEYS.STAGE_1]: "Data moves horizontally.",
  [STEP_KEYS.FINAL]: "Data moves vertically.",
};

export default function MeshGrid({ validation, shiftStates, currentStep }) {
  if (!validation.isValid || !shiftStates) {
    return (
      <div className="h-full rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0_0_#000] flex items-center justify-center">
        <p className="text-sm font-black uppercase text-black/60 bg-gray-100 border-[3px] border-black px-6 py-4 shadow-[4px_4px_0_0_#000] transform -rotate-1">
          Awaiting Valid Input
        </p>
      </div>
    );
  }

  const { meshDimension, initialState, stage1State, stage2State } = shiftStates;

  const stateByStep = {
    [STEP_KEYS.INITIAL]: initialState,
    [STEP_KEYS.STAGE_1]: stage1State,
    [STEP_KEYS.FINAL]: stage2State,
  };

  const visibleState = stateByStep[currentStep] ?? initialState;
  const movementDirection = getMovementDirection(currentStep);

  const tokenClassName =
    currentStep === STEP_KEYS.STAGE_1
      ? "bg-blue-400 text-black border-[3px] border-black shadow-[2px_2px_0_0_#000]"
      : currentStep === STEP_KEYS.FINAL
      ? "bg-red-400 text-black border-[3px] border-black shadow-[2px_2px_0_0_#000]"
      : "bg-yellow-400 text-black border-[3px] border-black shadow-[2px_2px_0_0_#000]";

  return (
    <div className="h-full rounded-2xl border-[3px] border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0_0_#000] flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-black pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-black/60">Mesh Grid</p>
          <h3 className="mt-1 text-xl sm:text-2xl font-black uppercase tracking-tighter text-black">{STAGE_HINTS[currentStep]}</h3>
        </div>
        <span className="rounded-xl flex items-center justify-center border-[3px] border-black bg-black text-white px-4 py-2 text-sm font-black tracking-widest shadow-[4px_4px_0_0_#f87171] transform rotate-1">
          {meshDimension} × {meshDimension}
        </span>
      </div>

      <DirectionIndicator direction={movementDirection} />

      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <LayoutGroup id="mesh-flow">
          <div className="grid gap-2 sm:gap-3 w-full max-w-full" style={{ gridTemplateColumns: `repeat(${meshDimension}, minmax(0, 1fr))` }}>
            {visibleState.map((dataValue, nodeIndex) => (
              <motion.div
                key={nodeIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: nodeIndex * 0.02 }}
                className="aspect-square rounded-xl border-[3px] border-black bg-gray-50 flex flex-col items-center justify-center shadow-[2px_2px_0_0_#000] relative overflow-hidden"
              >
                <p className="absolute top-1 left-1.5 text-[9px] font-black uppercase tracking-widest text-black/40">
                  N{nodeIndex}
                </p>
                <div className="flex items-center justify-center mt-2">
                  <motion.div
                    layoutId={`data-value-${dataValue}`}
                    transition={{ type: "spring", stiffness: 450, damping: 25, mass: 1 }}
                    className={`px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-base font-black ${tokenClassName} z-10 flex items-center justify-center`}
                  >
                    D{dataValue}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}

function DirectionIndicator({ direction }) {
  if (!direction) {
    return (
      <div className="mb-4 rounded-xl border-[3px] border-black bg-gray-100 px-4 py-3 text-xs sm:text-sm font-black uppercase text-black/50 border-dashed">
        Direction activates during stages.
      </div>
    );
  }
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={direction.axis}
        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className={`mb-4 rounded-xl border-[3px] border-black px-4 py-3 shadow-[4px_4px_0_0_#000] ${direction.wrapperClass} flex items-center justify-between gap-3`}
      >
        <p className="text-xs sm:text-sm font-black uppercase text-black">{direction.label}</p>
        <span className="text-sm font-black uppercase drop-shadow-[2px_2px_0_0_#fff]">{direction.arrow}</span>
      </motion.div>
    </AnimatePresence>
  );
}

function getMovementDirection(currentStep) {
  if (currentStep === STEP_KEYS.STAGE_1) return { axis: "x", label: "ROW SHIFT", arrow: "HORIZONTAL →", wrapperClass: "bg-blue-400" };
  if (currentStep === STEP_KEYS.FINAL) return { axis: "y", label: "COLUMN SHIFT", arrow: "VERTICAL ↓", wrapperClass: "bg-red-400" };
  return null;
}