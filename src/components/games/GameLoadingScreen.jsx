export function GameLoadingScreen({ progress = 0, message = 'Loading…' }) {
  const pct = Math.min(100, Math.max(0, progress));

  return (
    <div className="fixed inset-0 bg-[#FAF7F2] flex flex-col items-center justify-center gap-6 z-50">
      <div className="w-64 flex flex-col gap-3">
        <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-400 font-medium">
          <span>{message}</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
