import React from 'react';
import { Atom } from 'lucide-react';

export default function StateOfMatterGame({ onExit }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c1e35] text-white gap-6">
      <Atom size={56} className="text-teal-400 opacity-60" strokeWidth={1} />
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Matter State Sandbox</h2>
        <p className="text-stone-400 mt-2 text-sm">Game canvas coming soon.</p>
      </div>
      <button
        onClick={onExit}
        className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
      >
        Back to Games
      </button>
    </div>
  );
}
