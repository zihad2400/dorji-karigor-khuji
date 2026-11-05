'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import NotificationBell from '@/components/ui/NotificationBell';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiGlobe, FiSun, FiMoon, FiLogIn, FiUser, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = language === 'BN' ? [
    { name: 'হোম', href: '/' },
    { name: 'কারিগর খুঁজুন', href: '/artisans' },
    { name: 'কাজ খুঁজুন', href: '/jobs' },
    { name: 'প্রতিষ্ঠান', href: '/companies' },
    { name: 'আমাদের সম্পর্কে', href: '/about' },
  ] : [
    { name: 'Home', href: '/' },
    { name: 'Find Artisans', href: '/artisans' },
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Companies', href: '/companies' },
    { name: 'About Us', href: '/about' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'company') return '/company/dashboard';
    if (user.role === 'admin' || user.role === 'superadmin') return '/admin/dashboard';
    return '/artisan/dashboard';
  };

  return (
    <nav className="bg-surface border-b border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-light flex items-center gap-2">
              <span className="text-text-primary">{language === 'BN' ? 'দর্জি কারিগর' : 'Dorji Karigor'}</span> 
              {language === 'BN' ? 'খুঁজি' : 'Khuji'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-primary-light' : 'text-text-secondary hover:text-text-primary hover:bg-background'
                  }`}
                >
                  {link.name}
                  {/* Active Indicator (Animated Underline) */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button onClick={toggleTheme} className="text-text-secondary hover:text-primary-light p-2 rounded-full hover:bg-background transition">
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <button onClick={toggleLanguage} className="text-text-secondary hover:text-text-primary flex items-center gap-1 p-2 rounded-full hover:bg-background transition border border-gray-700 px-3">
              <FiGlobe size={18} />
              <span className="text-sm font-bold">{language}</span>
            </button>

            {user ? (
              <>
                <NotificationBell />
                
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1 rounded-full border-2 border-primary hover:border-primary-light transition">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary-light">
                      <FiUser size={18} />
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-700 bg-background/50">
                        <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                        <p className="text-xs text-text-secondary truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link href={getDashboardLink()} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary transition">
                          <FiGrid size={16} /> {language === 'BN' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                        </Link>
                        <Link href={user.role === 'artisan' ? '/artisan/settings' : user.role === 'company' ? '/company/settings' : '/admin/settings'} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary transition">
                          <FiSettings size={16} /> {language === 'BN' ? 'সেটিংস' : 'Settings'}
                        </Link>
                      </div>
                      <div className="border-t border-gray-700 py-2">
                        <button onClick={logout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition">
                          <FiLogOut size={16} /> {language === 'BN' ? 'লগআউট' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login" className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-md font-medium transition flex items-center gap-2">
                <FiLogIn size={18} />
                {language === 'BN' ? 'লগইন' : 'Login'}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
             <button onClick={toggleLanguage} className="text-text-secondary p-2 font-bold text-sm border border-gray-700 rounded">{language}</button>
             <button onClick={toggleTheme} className="text-text-secondary p-2">
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            {user && <NotificationBell />}
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-primary p-2">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`block px-3 py-2 rounded-md transition ${
                    isActive 
                      ? 'bg-primary/20 text-primary-light font-bold border-l-4 border-primary' 
                      : 'text-text-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {user ? (
              <>
                <Link href={getDashboardLink()} className="block px-3 py-2 text-text-secondary">ড্যাশবোর্ড</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-red-400">লগআউট</button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 mt-4 text-center bg-primary text-white rounded-md">
                {language === 'BN' ? 'লগইন' : 'Login'}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
