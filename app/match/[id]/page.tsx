import { Suspense } from 'react';
import MatchContent from './MatchContent';

export default function MatchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    }>
      <MatchContent />
    </Suspense>
  );
}
