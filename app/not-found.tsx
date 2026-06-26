import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="text-6xl mb-4">✈️</div>
      <h1 className="text-white text-3xl font-bold mb-2">Lost in Transit</h1>
      <p className="text-slate-400 mb-6">This boarding pass doesn&apos;t seem to exist.</p>
      <Link
        href="/"
        className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
      >
        Return to Gate
      </Link>
    </div>
  );
}
