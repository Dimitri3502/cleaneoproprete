export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/50 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center gap-3 font-heading text-lg font-semibold tracking-tight text-foreground">
              <img
                src="/cleaneo-logo.jpg"
                alt="Cleaneo Propreté"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Entreprise de nettoyage écoresponsable au service des professionnels et des copropriétés
              en Haute-Savoie.
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Contact</p>
            <p>Haute-Savoie 📍</p>
            <a href="mailto:contact@cleaneoproprete.com" className="block hover:text-foreground">
              contact@cleaneoproprete.com
            </a>
            <a href="tel:+33450982764" className="block hover:text-foreground">
              +33 (0)4 50 98 27 64
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cleaneo Propreté. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}
