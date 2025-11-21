export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb + Title skeleton */}
        <div className="mb-10">
          <div className="h-4 w-40 bg-gray-100 rounded mb-4 animate-pulse" />
          <div className="h-8 w-2/3 bg-gray-100 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article content skeleton */}
          <div className="lg:col-span-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
              <div className="h-48 bg-gray-100 rounded mb-6" />
              <div className="space-y-3">
                <div className="h-5 bg-gray-100 rounded w-full" />
                <div className="h-5 bg-gray-100 rounded w-5/6" />
                <div className="h-5 bg-gray-100 rounded w-4/6" />
                <div className="h-5 bg-gray-100 rounded w-3/6" />
              </div>
            </div>
          </div>

          {/* TOC / sidebar skeleton */}
          <aside className="lg:col-span-4">
            <div className="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
              <div className="h-5 w-40 bg-gray-100 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-4/6" />
                <div className="h-4 bg-gray-100 rounded w-3/6" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}