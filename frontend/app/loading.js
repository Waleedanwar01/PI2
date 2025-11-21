export default function Loading() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" aria-hidden="true" />
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    </main>
  );
}