import Link from "next/link";

const navLink =
  "text-sm font-medium text-slate-600 transition hover:text-slate-900";

export const TopNav = () => {
  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-slate-900"
          >
            Dealflow OS
          </Link>
          <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 sm:inline-flex">
            Demo
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/deals" className={navLink}>
            Deals
          </Link>
          <Link href="/upload" className={navLink}>
            Upload
          </Link>
        </nav>
      </div>
    </header>
  );
};
