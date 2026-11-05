import { Inter, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const hindSiliguri = Hind_Siliguri({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali'], 
  variable: '--font-hind-siliguri' 
});

export const metadata = {
  title: 'দর্জি কারিগর খুঁজি | Dorji Karigor Khuji',
  description: 'বাংলাদেশের দক্ষ দর্জি ও কারিগর খুঁজুন সহজেই।',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${hindSiliguri.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Toaster position="top-center" />
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
