import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JobHub - Find Your Dream Job',
  description: 'A job portal for connecting employers and job seekers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="min-h-screen pt-16">
            <AuthProvider>
              {children}
            </AuthProvider>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}