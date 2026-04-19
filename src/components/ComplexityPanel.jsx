import { motion } from "framer-motion";

export default function ComplexityPanel({ validation, shiftStates, p, q }) {
  if (!validation.isValid || !shiftStates) {
    return (
      <div className="h-full rounded-2xl border-[3px] border-black bg-gray-200 p-5 shadow-[6px_6px_0_0_#000] flex items-center justify-center">
         <p className="text-sm font-black uppercase text-black/50 text-center">Formulas will appear here</p>
      </div>
    );
  }

  const { meshDimension, rowShift, columnShift, meshSteps, ringSteps } = shiftStates;
  const savings = ringSteps - meshSteps;
  const maxSteps = Math.max(meshSteps, ringSteps, 1);
  const meshBarWidth = `${(meshSteps / maxSteps) * 100}%`;
  const ringBarWidth = `${(ringSteps / maxSteps) * 100}%`;

  return (
    <>
      {/* Box 1: Savings Highlight */}
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="rounded-2xl border-[3px] border-black bg-red-400 p-4 sm:p-5 shadow-[6px_6px_0_0_#000] flex flex-col justify-center items-center text-center transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
        <p className="text-xs font-black uppercase text-black/80 tracking-widest mb-1">Savings</p>
        <p className="text-4xl sm:text-5xl font-black text-black drop-shadow-[2px_2px_0_0_#fff]">+{savings}</p>
        <p className="text-[10px] mt-2 font-bold uppercase text-black/80 bg-white border-2 border-black rounded px-2 py-0.5 shadow-[2px_2px_0_0_#000]">steps saved</p>
      </motion.div>

      {/* Box 2: Bar Component */}
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="flex-1 rounded-2xl border-[3px] border-black bg-white p-4 sm:p-5 shadow-[6px_6px_0_0_#000] flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000]">
        <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-4 border-b-[3px] border-black pb-2">Step Count</p>
        <div className="space-y-4 my-auto">
          <BarRow label="MESH" value={meshSteps} width={meshBarWidth} barClass="bg-blue-400" />
          <BarRow label="RING" value={ringSteps} width={ringBarWidth} barClass="bg-yellow-400" />
        </div>
      </motion.div>

      {/* Box 3: Complexity Details */}
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="rounded-2xl border-[3px] border-black bg-black p-4 sm:p-5 shadow-[6px_6px_0_0_#cbd5e1] flex flex-col transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#cbd5e1]">
        <p className="text-xs font-black uppercase text-white/50 tracking-widest mb-4 border-b-2 border-white/20 pb-2">Data Breakdown</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white border-[3px] border-black p-2 rounded-xl shadow-[2px_2px_0_0_#f87171] hover:-translate-y-0.5 transition-transform"><p className="text-[10px] font-black uppercase text-black/60 mb-1">Row</p><p className="text-xl font-black">{rowShift}</p></div>
          <div className="bg-white border-[3px] border-black p-2 rounded-xl shadow-[2px_2px_0_0_#60a5fa] hover:-translate-y-0.5 transition-transform"><p className="text-[10px] font-black uppercase text-black/60 mb-1">Col</p><p className="text-xl font-black">{columnShift}</p></div>
          <div className="bg-white border-[3px] border-black p-2 rounded-xl shadow-[2px_2px_0_0_#fbbf24] hover:-translate-y-0.5 transition-transform"><p className="text-[10px] font-black uppercase text-black/60 mb-1">Mesh</p><p className="text-xl font-black">{meshSteps}</p></div>
          <div className="bg-white border-[3px] border-black p-2 rounded-xl shadow-[2px_2px_0_0_#a8a29e] hover:-translate-y-0.5 transition-transform"><p className="text-[10px] font-black uppercase text-black/60 mb-1">Ring</p><p className="text-xl font-black">{ringSteps}</p></div>
        </div>
      </motion.div>
    </>
  );
}

function BarRow({ label, value, width, barClass }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase text-black">
        <span>{label}</span>
        <span className="bg-gray-100 border-2 border-black rounded px-1">{value}</span>
      </div>
      <div className="h-6 rounded-full border-[3px] border-black bg-gray-100 overflow-hidden shadow-[2px_2px_0_0_#000] relative">
        <motion.div initial={{ width: 0 }} animate={{ width }} transition={{ type: "spring", stiffness: 50 }} className={`h-full border-r-[3px] border-black ${barClass}`} />
      </div>
    </div>
  );
}