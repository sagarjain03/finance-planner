'use client';

function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-white/5 rounded-xl ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="py-12 space-y-10">
      {/* Header */}
      <div>
        <Bone className="h-12 w-72" />
        <Bone className="h-5 w-96 mt-4" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-28" />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Bone className="lg:col-span-3 h-80" />
        <Bone className="lg:col-span-2 h-80" />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Bone className="h-72" />
        <Bone className="h-72" />
      </div>

      {/* Extra */}
      <Bone className="h-48" />
    </div>
  );
}
