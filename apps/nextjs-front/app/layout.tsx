import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { TopNav } from '@/components/TopNav';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dealflow OS',
  description: 'Finance-grade deal intake and review workspace.',
};

const inter = Inter({
  variable: '--font-inter',
  display: 'swap',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
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
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans bg-background text-foreground`}
      >
        <Providers>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(75,46,131,0.16),_transparent_60%)]">
            <TopNav />
            <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
