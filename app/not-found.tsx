export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
      <p className="text-xl text-slate-400 mb-8">Page not found</p>
      <a href="/feed" className="bg-secondary hover:bg-primary text-white font-semibold px-6 py-3 rounded-lg transition-colors">
        Go to Feed
      </a>
    </div>
  );
}
