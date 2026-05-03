import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Sidebar } from '@/components/shared/Sidebar';
import { UserDataProvider } from '@/providers/UserDataProvider';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Finance Planner',
  description: 'Plan your salary and savings goals smartly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#0B0F17] flex">
        <Providers>
          <UserDataProvider>
            <div className="flex w-full h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto relative">
                {children}
              </main>
            </div>
          </UserDataProvider>
        </Providers>
      </body>
    </html>
  );
}
