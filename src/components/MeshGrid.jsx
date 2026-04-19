import { LayoutGroup, motion } from "framer-motion";
import { STEP_KEYS } from "../utils/shiftLogic";

const STAGE_LABELS = {
  [STEP_KEYS.INITIAL]: "START",
  [STEP_KEYS.STAGE_1]: "STAGE 1 ROW SHIFT",
  [STEP_KEYS.FINAL]: "STAGE 2 COLUMN SHIFT",
};

const STAGE_HINTS = {
  [STEP_KEYS.INITIAL]: "Data is stationary before movement.",
  [STEP_KEYS.STAGE_1]: "Data moves horizontally.",
  [STEP_KEYS.FINAL]: "Data moves vertically.",
};

export default function MeshGrid({ validation, shiftStates, currentStep }) {
  if (!validation.isValid || !shiftStates) {
    return (
      <div className="border-4 border-black bg-gray-100 p-5 shadow-[4px_4px_0_0_#000]">
        <p className="text-base font-black uppercase text-black">
          Enter valid inputs to render the mesh.
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
      ? "bg-gray-300 text-black border-4 border-black shadow-[2px_2px_0_0_#000]"
      : currentStep === STEP_KEYS.FINAL
        ? "bg-gray-400 text-black border-4 border-black shadow-[2px_2px_0_0_#000]"
        : "bg-black text-white border-4 border-black shadow-[2px_2px_0_0_#000]";

  return (
    <div className="border-4 border-black bg-gray-100 p-5 shadow-[8px_8px_0_0_#000]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-black">
            Mesh Grid
          </p>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-black">
            {STAGE_LABELS[currentStep]}
          </h3>
        </div>
        <span className="border-4 border-black bg-white px-4 py-2 text-base font-black text-black shadow-[4px_4px_0_0_#000]">
          {meshDimension} x {meshDimension}
        </span>
      </div>

      <p className="mb-6 text-base font-bold uppercase text-black border-l-4 border-black pl-4">
        {STAGE_HINTS[currentStep]}
      </p>

      <DirectionIndicator direction={movementDirection} meshDimension={meshDimension} />

      <div className="mx-auto w-full">
        <LayoutGroup id="mesh-data-flow">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${meshDimension}, minmax(0, 1fr))` }}
          >
            {visibleState.map((dataValue, nodeIndex) => (
              <div
                key={nodeIndex}
                className="border-4 border-black bg-white px-2 py-4 text-center shadow-[4px_4px_0_0_#000] flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000]"
              >
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                  N{nodeIndex}
                </p>

                <div className="flex justify-center w-full">
                  <motion.div
                    layoutId={`data-token-${dataValue}`}
                    transition={{ type: "spring", stiffness: 560, damping: 34 }}
                    className={`px-3 py-2 text-xl font-black ${tokenClassName}`}
                  >
                    D{dataValue}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}

function DirectionIndicator({ direction, meshDimension }) {
  if (!direction) {
    return (
      <div className="mb-6 border-4 border-black bg-white px-4 py-3 text-base font-black uppercase text-black shadow-[4px_4px_0_0_#000]">
        Direction indicator activates during stages.
      </div>
    );
  }

  const arrowCount = Math.max(3, meshDimension);

  return (
    <motion.div
      key={direction.axis}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`mb-6 border-4 border-black px-4 py-4 shadow-[4px_4px_0_0_#000] ${direction.wrapperClass}`}
    >
      <p className="text-base font-black uppercase text-black mb-2">{direction.label}</p>

      {direction.axis === "x" ? (
        <div className="flex flex-wrap items-center gap-4 text-2xl">
          {Array.from({ length: arrowCount }).map((_, index) => (
            <span key={index} className="font-black text-black">
              →
            </span>
          ))}
        </div>
      ) : (
        <div className="flex max-h-24 flex-col gap-2 overflow-hidden text-2xl">
          {Array.from({ length: arrowCount }).map((_, index) => (
            <span key={index} className="font-black text-black leading-none">
              ↓
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function getMovementDirection(currentStep) {
  if (currentStep === STEP_KEYS.STAGE_1) {
    return {
      axis: "x",
      label: "HORIZONTAL ROW SHIFT",
      wrapperClass: "bg-white",
    };
  }

  if (currentStep === STEP_KEYS.FINAL) {
    return {
      axis: "y",
      label: "VERTICAL COLUMN SHIFT",
      wrapperClass: "bg-white",
    };
  }

  return null;
}