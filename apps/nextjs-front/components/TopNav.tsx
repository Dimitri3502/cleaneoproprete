import Link from 'next/link';
import Image from 'next/image';

const navLink = 'text-sm font-medium text-foreground/70 transition hover:text-foreground';

export const TopNav = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-heading text-lg font-semibold tracking-tight text-foreground"
          >
            <span className="relative h-10 w-32">
              <Image
                src="/cleaneo-logo.jpg"
                alt="Cleaneo Propreté"
                fill
                sizes="128px"
                className="object-contain"
                priority
              />
            </span>
            <span className="sr-only">Cleaneo Propreté</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#prestations" className={navLink}>
              Prestations
            </Link>
            <Link href="#engagement" className={navLink}>
              Engagement
            </Link>
            <Link href="#contact" className={navLink}>
              Contact
            </Link>
          </nav>
        </div>
        <div className="hidden flex-col items-end text-xs text-foreground/70 md:flex">
          <a href="mailto:contact@cleaneoproprete.com" className="font-medium text-foreground">
            contact@cleaneoproprete.com
          </a>
          <a href="tel:+33450982764" className="transition hover:text-foreground">
            +33 (0)4 50 98 27 64
          </a>
        </div>
      </div>
    </header>
  );
};
