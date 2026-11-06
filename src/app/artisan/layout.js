'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  FiGrid, FiEdit, FiHeart, FiStar, FiShoppingCart, FiSend, FiInbox, 
  FiSettings, FiLogOut, FiUser, FiSearch, FiMenu, FiX 
} from 'react-icons/fi';

export default function ArtisanLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // মোবাইল সাইডবার স্টেট

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/artisans?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/artisans');
    }
  };

  const menuItems = [
    { name: 'ড্যাশবোর্ড', icon: <FiGrid />, path: '/artisan/dashboard' },
    { name: 'বায়োডাটা এডিট করুন', icon: <FiEdit />, path: '/artisan/edit-biodata' },
    { name: 'পছন্দের তালিকা', icon: <FiHeart />, path: '/artisan/saved' },
    { name: 'আমাকে যারা পছন্দ করেছেন', icon: <FiStar />, path: '/artisan/liked-me' },
    { name: 'কানেকশন ক্রয়সমূহ', icon: <FiShoppingCart />, path: '/artisan/connections' },
    { name: 'প্রস্তাব পাঠিয়েছি', icon: <FiSend />, path: '/artisan/sent-proposals' },
    { name: 'প্রস্তাব পেয়েছি', icon: <FiInbox />, path: '/artisan/received-proposals' },
    { name: 'সেটিংস', icon: <FiSettings />, path: '/artisan/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      
      {/* ===== মোবাইল সাইডবার ওভারলে ===== */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ===== সাইডবার ===== */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-800 flex flex-col transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary-light">দর্জি কারিগর খুঁজি</Link>
          {/* মোবাইলে ক্লোজ বাটন */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-text-secondary">
            <FiX size={24} />
          </button>
        </div>
        
        {/* Search box */}
        <div className="px-4 py-4">
          <form onSubmit={handleSearch} className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বায়োডাটা খুঁজুন" 
              className="w-full bg-background border border-gray-700 rounded-lg py-2 pl-10 pr-3 text-sm text-text-primary focus:outline-none focus:border-primary" 
            />
          </form>
        </div>

        <nav className="flex-grow py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path} 
                    onClick={() => setIsSidebarOpen(false)} // মোবাইলে ক্লিক করলে মেনু বন্ধ হবে
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                      isActive ? 'bg-primary/20 text-primary-light border-l-4 border-primary' : 'text-text-secondary hover:bg-surfaceHover hover:text-text-primary'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition">
            <FiLogOut className="text-lg" />
            লগআউট
          </button>
        </div>
      </aside>

      {/* ===== মেইন কন্টেন্ট ===== */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="bg-surface border-b border-gray-800 h-16 flex items-center justify-between px-4 sm:px-6">
          {/* মোবাইল হ্যামবার্গার বাটন */}
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-text-primary p-2">
            <FiMenu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
              <FiUser size={20} />
            </div>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
