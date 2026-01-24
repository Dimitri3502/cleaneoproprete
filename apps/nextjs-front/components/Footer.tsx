import Link from 'next/link';
import versionInfo from '../version.json';

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/50 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2 font-heading text-base font-semibold tracking-tight text-foreground">
              <span>Dealflow OS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Finance-grade deal intake and review workspace.
            </p>
          </div>

          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Platform</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/deals" className="transition-colors hover:text-foreground">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/upload" className="transition-colors hover:text-foreground">
                  Upload
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Resources</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dealflow OS
          </div>
          <div className="text-[0.7rem] text-muted-foreground tabular-nums">
            {versionInfo.version}
          </div>
        </div>
      </div>
    </footer>
  );
}
