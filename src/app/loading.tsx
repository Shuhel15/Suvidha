export default function Loading() {
  return (
    <div
      className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-16 sm:px-6 lg:gap-28 lg:px-8 lg:py-24"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading Suvidha</span>

      <section className="flex flex-col items-center gap-8 text-center">
        <div className="h-6 w-36 animate-pulse rounded-full bg-[#EDE0BE] shadow-inner shadow-black/5" />
        <div className="flex w-full max-w-4xl flex-col items-center gap-4">
          <div className="h-12 w-full max-w-2xl animate-pulse rounded-2xl bg-[#EDE0BE] sm:h-16" />
          <div className="h-12 w-4/5 max-w-xl animate-pulse rounded-2xl bg-[#EDE0BE] sm:h-16" />
        </div>
        <div className="h-5 w-full max-w-xl animate-pulse rounded-full bg-[#EDE0BE]/80" />
        <div className="flex w-full max-w-2xl flex-col gap-3 rounded-3xl bg-white/40 p-3 shadow-inner shadow-black/5 sm:flex-row">
          <div className="h-14 flex-1 animate-pulse rounded-2xl bg-[#EDE0BE]" />
          <div className="h-14 w-full animate-pulse rounded-2xl bg-[#B11226]/20 sm:w-32" />
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div className="h-9 w-56 animate-pulse rounded-xl bg-[#EDE0BE]" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#EDE0BE]/80" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="flex h-36 animate-pulse flex-col items-center justify-center gap-4 rounded-3xl bg-white/45 shadow-inner shadow-black/5"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#EDE0BE]" />
              <div className="h-4 w-20 rounded-full bg-[#EDE0BE]" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="flex min-h-56 animate-pulse flex-col justify-between rounded-3xl bg-white/45 p-6 shadow-inner shadow-black/5"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-2xl bg-[#EDE0BE]" />
              <div className="h-4 w-16 rounded-full bg-[#EDE0BE]/80" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-6 w-3/4 rounded-lg bg-[#EDE0BE]" />
              <div className="h-4 w-full rounded-full bg-[#EDE0BE]/80" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
