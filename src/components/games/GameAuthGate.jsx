import { LogIn } from 'lucide-react';

export function GameAuthGate({ user, onNavigateLogin, children }) {
  if (user) return children;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
          <LogIn size={26} className="text-orange-500" />
        </div>
        <div>
          <h2 className="font-semibold text-stone-800 text-lg">Sign in to play games</h2>
          <p className="text-stone-500 text-sm mt-1">
            Create a free account to track your progress and unlock all games.
          </p>
        </div>
        <button
          onClick={onNavigateLogin}
          className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
