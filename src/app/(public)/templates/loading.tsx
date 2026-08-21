export default function TemplatesLoading() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
    >
      {/* ── Hero Skeleton ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-2" style={{ borderColor: 'var(--ink)' }}>
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
          <div className="max-w-3xl animate-pulse">
            <div className="h-4 w-32 mb-4 bg-gray-200" style={{ backgroundColor: 'var(--line)' }} />
            <div className="h-16 w-3/4 mb-6 bg-gray-200" style={{ backgroundColor: 'var(--line)' }} />
            <div className="h-20 w-full mb-10 bg-gray-200" style={{ backgroundColor: 'var(--line)' }} />
            <div className="h-12 w-48 bg-gray-200" style={{ backgroundColor: 'var(--line)' }} />
          </div>
        </div>
      </section>

      {/* ── Grid Skeleton ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-4 mb-10 animate-pulse">
          <div className="h-10 w-32 bg-gray-200" style={{ backgroundColor: 'var(--line)' }} />
          <div className="h-10 w-32 bg-gray-200" style={{ backgroundColor: 'var(--line)' }} />
          <div className="h-10 w-32 bg-gray-200" style={{ backgroundColor: 'var(--line)' }} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] border-2 animate-pulse"
              style={{ borderColor: 'var(--line)', backgroundColor: 'var(--line)' }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
