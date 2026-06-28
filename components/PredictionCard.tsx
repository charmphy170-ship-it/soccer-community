import Link from 'next/link';

interface PredictionCardProps {
  prediction: any;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const user = prediction.user;
  const total = (user?.wins || 0) + (user?.losses || 0);
  const winRate = total > 0 ? Math.round((user?.wins || 0) / total * 100) : 0;

  const resultColors: any = {
    pending: 'bg-slate-700 text-slate-300',
    win: 'bg-green-500/20 text-green-400',
    loss: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-slate-700">
      <div className="flex items-start justify-between mb-3">
        <Link href={`/profile/${prediction.user_id}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold">{user?.username?.[0]?.toUpperCase() || '?'}</div>
          <div>
            <div className="font-semibold text-white group-hover:text-accent transition-colors">{user?.username || 'Unknown'}</div>
            <div className="text-xs text-slate-400">{winRate}% win rate • {total} predictions</div>
          </div>
        </Link>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${resultColors[prediction.result] || resultColors.pending}`}>
          {prediction.result === 'pending' ? 'Pending' : prediction.result === 'win' ? '✓ Won' : '✗ Lost'}
        </span>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Pick:</span>
          <span className="text-sm font-bold text-accent">{prediction.pick}</span>
        </div>
      </div>

      {prediction.reasoning && <p className="text-sm text-slate-400 leading-relaxed">{prediction.reasoning}</p>}
      <div className="mt-3 text-xs text-slate-500">Posted {new Date(prediction.created_at).toLocaleDateString()}</div>
    </div>
  );
}
