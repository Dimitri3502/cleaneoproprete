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
