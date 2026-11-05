'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiGrid, FiBriefcase, FiUsers, FiPlusCircle, 
  FiSettings, FiLogOut, FiUser, FiSearch, FiCheckSquare
} from 'react-icons/fi';

export default function CompanyLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const menuItems = [
    { name: 'ড্যাশবোর্ড', icon: <FiGrid />, path: '/company/dashboard' },
    { name: 'কোম্পানি প্রোফাইল', icon: <FiUser />, path: '/company/profile' },
    { name: 'নতুন জব পোস্ট করুন', icon: <FiPlusCircle />, path: '/company/jobs/create' },
    { name: 'আমার জব পোস্টসমূহ', icon: <FiBriefcase />, path: '/company/jobs' },
    { name: 'আবেদনকারী তালিকা', icon: <FiUsers />, path: '/company/applications' },
    { name: 'শর্টলিস্টেড প্রার্থী', icon: <FiCheckSquare />, path: '/company/shortlisted' },
    { name: 'কারিগর খুঁজুন', icon: <FiSearch />, path: '/artisans' },
    { name: 'কানেকশন ক্রয়কারী', icon: <FiUsers />, path: '/company/connections' },
    { name: 'সেটিংস', icon: <FiSettings />, path: '/company/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="text-xl font-bold text-primary-light">দর্জি কারিগর খুঁজি</Link>
          <p className="text-xs text-text-secondary mt-1">কোম্পানি প্যানেল</p>
        </div>
        
        <nav className="flex-grow py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                      isActive ? 'bg-primary/20 text-primary-light border-l-4 border-primary' : 'text-text-secondary hover:bg-surfaceHover hover:text-white'
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

      {/* Main Content Area */}
      <main className="flex-grow">
        <header className="bg-surface border-b border-gray-800 h-16 flex items-center justify-between px-6">
          <div className="md:hidden">
             <Link href="/" className="text-lg font-bold text-primary-light">দর্জি কারিগর</Link>
          </div>
          <div className="flex items-center gap-4 ml-auto">
             <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition hidden sm:block">
                কানেকশন কিনুন
             </button>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
              <FiBriefcase size={20} />
            </div>
          </div>
        </header>
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
