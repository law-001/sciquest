import { useState } from "react";
import { ArrowLeft, Pause, Play, RotateCcw, Camera } from "lucide-react";

export function GameShell({
  title,
  levelName,
  onExit,
  onPause,
  onResume,
  onReset,
  onScreenshot,
  children,
}) {
  const [paused, setPaused] = useState(false);

  function handlePause() {
    setPaused(true);
    onPause?.();
  }

  function handleResume() {
    setPaused(false);
    onResume?.();
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF7F2]">
      {/* Top bar */}
      <div className="h-15 shrink-0 flex items-center justify-between px-4 bg-white border-b border-stone-200 z-10">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors min-h-11 px-2"
        >
          <ArrowLeft size={16} />
          Exit
        </button>

        <div className="text-center">
          <p className="font-semibold text-stone-800 text-sm leading-tight">
            {title}
          </p>
          {levelName && <p className="text-xs text-stone-500">{levelName}</p>}
        </div>

        <div className="flex items-center gap-1">
          <IconBtn onClick={handlePause} label="Pause">
            <Pause size={16} />
          </IconBtn>
          <IconBtn onClick={onReset} label="Reset">
            <RotateCcw size={16} />
          </IconBtn>
          <IconBtn onClick={onScreenshot} label="Screenshot">
            <Camera size={16} />
          </IconBtn>
        </div>
      </div>

      {/* Game area */}
      <div className="relative flex-1 overflow-hidden">
        {children}

        {paused && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl">
              <p className="text-2xl font-bold text-stone-800">Paused</p>
              <button
                onClick={handleResume}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
              >
                <Play size={15} fill="white" />
                Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
    >
      {children}
    </button>
  );
}
