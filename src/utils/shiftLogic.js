const MIN_NODE_COUNT = 4;
const MAX_NODE_COUNT = 64;

const STEP_KEYS = {
  INITIAL: "initial",
  STAGE_1: "stage1",
  FINAL: "final",
};

export { STEP_KEYS };

export function isPerfectSquare(value) {
  if (!Number.isInteger(value) || value < 0) {
    return false;
  }

  const root = Math.sqrt(value);
  return Number.isInteger(root);
}

export function getMeshDimension(p) {
  if (!Number.isInteger(p)) {
    return null;
  }

  const root = Math.sqrt(p);
  return Number.isInteger(root) ? root : null;
}

export function validateShiftParameters(p, q) {
  const errors = {};
  const meshDimension = getMeshDimension(p);

  if (!Number.isInteger(p)) {
    errors.p = "p must be an integer.";
  } else if (p < MIN_NODE_COUNT || p > MAX_NODE_COUNT) {
    errors.p = `p must be between ${MIN_NODE_COUNT} and ${MAX_NODE_COUNT}.`;
  } else if (meshDimension === null) {
    errors.p = "p must be a perfect square.";
  }

  if (!Number.isInteger(q)) {
    errors.q = "q must be an integer.";
  } else if (!errors.p && (q < 1 || q > p - 1)) {
    errors.q = `q must be between 1 and ${p - 1}.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    meshDimension,
  };
}

export function getRowShiftAmount(p, q) {
  assertValidShiftParameters(p, q);

  const meshDimension = getMeshDimension(p);
  return q % meshDimension;
}

export function getColumnShiftAmount(p, q) {
  assertValidShiftParameters(p, q);

  const meshDimension = getMeshDimension(p);
  return Math.floor(q / meshDimension);
}

export function getRingStepsCount(p, q) {
  assertValidShiftParameters(p, q);

  return Math.min(q, p - q);
}

export function getMeshStepsCount(p, q) {
  assertValidShiftParameters(p, q);

  const rowShift = getRowShiftAmount(p, q);
  const columnShift = getColumnShiftAmount(p, q);

  return rowShift + columnShift;
}

export function createInitialState(p) {
  const validation = validateShiftParameters(p, 1);
  if (!validation.isValid && validation.errors.p) {
    throw new Error(validation.errors.p);
  }

  return Array.from({ length: p }, (_, nodeIndex) => nodeIndex);
}

export function getShiftStates(p, q) {
  assertValidShiftParameters(p, q);

  const meshDimension = getMeshDimension(p);
  const rowShift = getRowShiftAmount(p, q);
  const columnShift = getColumnShiftAmount(p, q);
  const initialState = createInitialState(p);

  const stage1Result = shiftRows(initialState, meshDimension, rowShift);
  const stage2Result = shiftColumns(
    stage1Result.state,
    meshDimension,
    columnShift,
  );
  const directResult = shiftRing(initialState, q);

  return {
    p,
    q,
    meshDimension,
    rowShift,
    columnShift,
    ringSteps: getRingStepsCount(p, q),
    meshSteps: getMeshStepsCount(p, q),
    stepKeys: STEP_KEYS,
    initialState,
    stage1State: stage1Result.state,
    stage2State: stage2Result.state,
    stage1Routes: stage1Result.routes,
    stage2Routes: stage2Result.routes,
    directRoutes: directResult.routes,
    directFinalState: directResult.state,
  };
}

export function getStateForStep(p, q, step = STEP_KEYS.INITIAL) {
  const states = getShiftStates(p, q);

  if (step === STEP_KEYS.STAGE_1) {
    return states.stage1State;
  }

  if (step === STEP_KEYS.FINAL) {
    return states.stage2State;
  }

  return states.initialState;
}

function assertValidShiftParameters(p, q) {
  const validation = validateShiftParameters(p, q);
  if (validation.isValid) {
    return;
  }

  const failureMessages = Object.values(validation.errors).join(" ");
  throw new Error(failureMessages);
}

function shiftRows(state, meshDimension, rowShift) {
  const shiftedState = new Array(state.length);
  const routes = [];

  for (let sourceIndex = 0; sourceIndex < state.length; sourceIndex += 1) {
    const row = Math.floor(sourceIndex / meshDimension);
    const col = sourceIndex % meshDimension;
    const destinationCol = (col + rowShift) % meshDimension;
    const destinationIndex = row * meshDimension + destinationCol;

    shiftedState[destinationIndex] = state[sourceIndex];
    routes.push(
      createRoute(
        sourceIndex,
        destinationIndex,
        state[sourceIndex],
        STEP_KEYS.STAGE_1,
      ),
    );
  }

  return { state: shiftedState, routes };
}

function shiftColumns(state, meshDimension, columnShift) {
  const shiftedState = new Array(state.length);
  const routes = [];

  for (let sourceIndex = 0; sourceIndex < state.length; sourceIndex += 1) {
    const row = Math.floor(sourceIndex / meshDimension);
    const col = sourceIndex % meshDimension;
    const destinationRow = (row + columnShift) % meshDimension;
    const destinationIndex = destinationRow * meshDimension + col;

    shiftedState[destinationIndex] = state[sourceIndex];
    routes.push(
      createRoute(
        sourceIndex,
        destinationIndex,
        state[sourceIndex],
        STEP_KEYS.FINAL,
      ),
    );
  }

  return { state: shiftedState, routes };
}

function shiftRing(state, offset) {
  const shiftedState = new Array(state.length);
  const routes = [];

  for (let sourceIndex = 0; sourceIndex < state.length; sourceIndex += 1) {
    const destinationIndex = (sourceIndex + offset) % state.length;

    shiftedState[destinationIndex] = state[sourceIndex];
    routes.push(
      createRoute(
        sourceIndex,
        destinationIndex,
        state[sourceIndex],
        "direct",
      ),
    );
  }

  return { state: shiftedState, routes };
}

function createRoute(from, to, dataValue, stage) {
  return {
    from,
    to,
    dataValue,
    stage,
  };
}