export default function ComplexityPanel({ validation, shiftStates, p, q }) {
  if (!validation.isValid || !shiftStates) {
    return (
      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
        <p className="text-sm font-black uppercase tracking-widest text-black">
          Analysis
        </p>
        <h3 className="mt-2 text-2xl font-black uppercase tracking-tighter text-black">
          Waiting for valid parameters
        </h3>
        <p className="mt-3 text-base font-bold text-black border-l-4 border-black pl-4">
          Enter valid p and q values to compute row shift, column shift, and
          mesh-vs-ring step complexity.
        </p>
      </section>
    );
  }

  const { meshDimension, rowShift, columnShift, meshSteps, ringSteps } = shiftStates;
  const maxSteps = Math.max(meshSteps, ringSteps, 1);
  const meshBarWidth = `${(meshSteps / maxSteps) * 100}%`;
  const ringBarWidth = `${(ringSteps / maxSteps) * 100}%`;
  const savings = ringSteps - meshSteps;

  return (
    <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-black">
            Analysis
          </p>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-tighter text-black">
            Mesh vs Ring
          </h3>
        </div>
        <span className="border-4 border-black bg-black px-4 py-2 text-base font-black text-white shadow-[4px_4px_0_0_#000]">
          SAVINGS: {savings}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MetricCard label="ROW SHIFT" value={rowShift} hint={`q mod sqrt(p) = ${q} mod ${meshDimension}`} />
        <MetricCard
          label="COL SHIFT"
          value={columnShift}
          hint={`floor(q / sqrt(p)) = floor(${q}/${meshDimension})`}
        />
        <MetricCard label="MESH STEPS" value={meshSteps} hint={`(${rowShift}) + (${columnShift})`} />
        <MetricCard label="RING STEPS" value={ringSteps} hint={`min(${q}, ${p - q})`} />
      </div>

      <div className="mt-8 border-4 border-black bg-gray-100 p-5 shadow-[4px_4px_0_0_#000]">
        <p className="text-lg font-black uppercase text-black border-b-4 border-black pb-2 mb-4">
          Formulas
        </p>
        <div className="space-y-3 text-base font-bold text-black uppercase">
          <p>
            Row shift = q mod sqrt(p) = {q} mod {meshDimension} = {rowShift}
          </p>
          <p>
            Column shift = floor(q / sqrt(p)) = floor({q}/{meshDimension}) = {columnShift}
          </p>
          <p>Ring steps = min(q, p-q) = min({q}, {p - q}) = {ringSteps}</p>
          <p>
            Mesh steps = (q mod sqrt(p)) + floor(q/sqrt(p)) = {rowShift} + {columnShift} = {meshSteps}
          </p>
        </div>
      </div>

      <div className="mt-8 border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
        <p className="text-lg font-black uppercase text-black border-b-4 border-black pb-2 mb-4">
          Step Comparison
        </p>

        <div className="space-y-6">
          <BarRow
            label="MESH"
            value={meshSteps}
            width={meshBarWidth}
            barClass="bg-black"
          />
          <BarRow
            label="RING"
            value={ringSteps}
            width={ringBarWidth}
            barClass="bg-gray-400"
          />
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all duration-200">
      <p className="text-sm font-black uppercase tracking-widest text-black">{label}</p>
      <p className="mt-2 text-4xl font-black text-black">{value}</p>
      <p className="mt-2 text-xs font-bold uppercase text-gray-600">{hint}</p>
    </div>
  );
}

function BarRow({ label, value, width, barClass }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-base font-black uppercase text-black">
        <span>{label}</span>
        <span>{value} STEPS</span>
      </div>
      <div className="h-6 border-4 border-black bg-gray-100 p-0">
        <div className={`h-full border-r-4 border-black ${barClass} transition-all duration-500`} style={{ width }} />
      </div>
    </div>
  );
}