import Link from "next/link";
import Image from "next/image";

const navLink =
  "text-sm font-medium text-foreground/70 transition hover:text-foreground";

export const TopNav = () => {
  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight text-foreground"
          >
            <Image
              src="/logo-captech.jpg"
              alt="Captech Santé Logo"
              width={24}
              height={24}
              className="rounded-sm"
            />
            <span>Dealflow OS</span>
          </Link>
          <span className="hidden rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground sm:inline-flex">
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
