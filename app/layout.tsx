import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Battleship Game',
  description: 'A React and Next.js implementation of the classic Battleship game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100">
        {children}
      </body>
    </html>
  );
}