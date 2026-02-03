export default function AdminLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ieee-red border-t-transparent" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
