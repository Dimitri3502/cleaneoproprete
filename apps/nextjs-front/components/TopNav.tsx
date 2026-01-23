import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "./auth-button";
import { ThemeSwitcher } from "./theme-switcher";

const navLink =
  "text-sm font-medium text-foreground/70 transition hover:text-foreground";

export const TopNav = async () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
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
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/deals" className={navLink}>
              Deals
            </Link>
            <Link href="/upload" className={navLink}>
              Upload
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
