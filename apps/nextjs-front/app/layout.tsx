import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { TopNav } from '@/components/TopNav';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cleaneo Propreté | Entreprise de nettoyage en Haute-Savoie',
  description:
    'Entreprise de nettoyage écoresponsable en Haute-Savoie. Bureaux, copropriétés, vitrerie et fin de chantier.',
};

const manrope = Manrope({
  variable: '--font-manrope',
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${manrope.variable} ${cormorant.variable} font-sans bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(11,91,106,0.18),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(24,163,166,0.16),_transparent_55%)]">
          <TopNav />
          <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
