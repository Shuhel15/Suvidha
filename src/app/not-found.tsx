import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="flex w-full max-w-2xl flex-col items-center text-center">
        <div className="relative mb-8">
          <span className="absolute -left-5 -top-3 h-3 w-3 rounded-full bg-[#B11226]/20" />
          <span className="absolute -bottom-1 -right-5 h-2 w-2 rounded-full bg-[#B11226]/30" />
          <p className="font-black text-8xl leading-none tracking-tight text-[#B11226] sm:text-9xl">
            404
          </p>
        </div>

        <span className="eye mb-5">Page not found</span>
        <h1 className="h2-text max-w-xl">
          Looks like this service took a wrong turn.
        </h1>
        <p className="p-text mt-5 max-w-lg">
          The page you are looking for may have moved, expired, or never
          existed. Let&apos;s get you back to a useful place.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn bg-[#B11226] text-white hover:bg-[#8f0e1e]"
          >
            Back to home
          </Link>
          <Link
            href="/services"
            className="btn border border-[#B11226]/30 bg-[#EDE0BE] text-[#B11226] hover:bg-[#e4d3a8]"
          >
            Explore services
          </Link>
        </div>
      </section>
    </main>
  );
}
