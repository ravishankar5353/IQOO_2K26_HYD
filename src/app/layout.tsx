import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'TRUSTCART AI — AI Shopping & Financial Decision Copilot',
  description:
    'Think Before You Spend. TrustCart AI is the intelligent consumer decision layer between product discovery and checkout for the iQOO Hackathon (FinTech + Commerce track).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
