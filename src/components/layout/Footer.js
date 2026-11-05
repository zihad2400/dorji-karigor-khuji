import Link from 'next/link';
import { FiFacebook, FiYoutube, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import CopyrightYear from './CopyrightYear';

export default function Footer() {

  const quickLinks = [
    { name: 'সকল কারিগর', href: '/artisans' },
    { name: 'সকল প্রতিষ্ঠান', href: '/companies' },
    { name: 'আমাদের সম্পর্কে', href: '/about' },
    { name: 'যোগাযোগ', href: '/contact' },
  ];

  const policyLinks = [
    { name: 'গোপনীয়তা নীতি', href: '/privacy' },
    { name: 'শর্তাবলী', href: '/terms' },
    { name: 'সাধারণ জিজ্ঞাসা (FAQ)', href: '/faq' },
  ];

  const socialLinks = [
    { icon: <FiFacebook size={20} />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <FiYoutube size={20} />, href: 'https://youtube.com', label: 'YouTube' },
    { icon: <FiInstagram size={20} />, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="bg-surface border-t border-gray-800 pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div>
            <Link href="/" className="text-2xl font-bold text-primary-light flex items-center gap-2 mb-4 hover:opacity-80 transition">
              দর্জি কারিগর খুঁজি
            </Link>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              বাংলাদেশের দক্ষ দর্জি ও কারিগর খুঁজুন সহজেই। আপনার দক্ষতার উপযুক্ত কর্মস্থল খুঁজুন, অথবা আপনার প্রতিষ্ঠানের জন্য দক্ষ কারিগর নিয়োগ করুন।
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-text-secondary text-sm">
                <FiMail className="text-primary-light" />
                <a href="mailto:support@dorjikarigor.com" className="hover:text-primary-light transition">support@dorjikarigor.com</a>
              </div>
              <div className="flex items-center gap-3 text-text-secondary text-sm">
                <FiPhone className="text-primary-light" />
                <a href="tel:+8801700000000" className="hover:text-primary-light transition">+৮৮০ ১৭০০-০০০০০০</a>
              </div>
              <div className="flex items-center gap-3 text-text-secondary text-sm">
                <FiMapPin className="text-primary-light" />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-semibold mb-5 text-lg">প্রয়োজনীয় লিঙ্ক</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary-light transition flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-light rounded-full group-hover:w-2 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h3 className="text-text-primary font-semibold mb-5 text-lg">পলিসি ও শর্তাবলী</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary-light transition flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-light rounded-full group-hover:w-2 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-text-primary font-semibold mb-5 text-lg">সোশ্যাল মিডিয়া</h3>
            <p className="text-sm text-text-secondary mb-4">আমাদের সোশ্যাল মিডিয়ায় ফলো করে আপডেট পান।</p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-background rounded-full text-text-secondary hover:text-white hover:bg-primary transition transform hover:-translate-y-1"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-text-secondary text-center md:text-left">
            &copy; <CopyrightYear /> DorjiKarigor.com. সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="text-sm text-text-secondary flex gap-4">
            <Link href="/privacy" className="hover:text-primary-light">প্রাইভেসি</Link>
            <Link href="/terms" className="hover:text-primary-light">টার্মস</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
