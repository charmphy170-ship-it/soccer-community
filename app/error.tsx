'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-24">
      <h1 className="text-4xl font-bold text-red-400 mb-4">Something went wrong</h1>
      <p className="text-slate-400 mb-8">{error.message}</p>
      <button onClick={reset} className="bg-secondary hover:bg-primary text-white font-semibold px-6 py-3 rounded-lg transition-colors">
        Try again
      </button>
    </div>
  );
}
