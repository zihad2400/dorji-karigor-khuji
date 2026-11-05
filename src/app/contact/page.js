import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <section className="py-20 bg-surface border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">যোগাযোগ করুন</h1>
            <p className="text-lg text-text-secondary">যেকোনো প্রশ্ন বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন</p>
          </div>
        </section>
        
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface p-6 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
              <FiMail size={32} className="text-primary-light mb-4" />
              <h3 className="text-text-primary font-semibold mb-2">ইমেইল</h3>
              <p className="text-text-secondary text-sm">support@dorjikarigor.com</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
              <FiPhone size={32} className="text-primary-light mb-4" />
              <h3 className="text-text-primary font-semibold mb-2">ফোন</h3>
              <p className="text-text-secondary text-sm">+৮৮০ ১৭০০-০০০০০০</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-gray-800 flex flex-col items-center text-center">
              <FiMapPin size={32} className="text-primary-light mb-4" />
              <h3 className="text-text-primary font-semibold mb-2">ঠিকানা</h3>
              <p className="text-text-secondary text-sm">ঢাকা, বাংলাদেশ</p>
            </div>
          </div>
          
          <form className="bg-surface p-8 rounded-2xl border border-gray-800 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-text-primary mb-4">আমাদের মেসেজ পাঠান</h2>
            <div className="space-y-4">
              <input type="text" placeholder="আপনার নাম" className="w-full bg-background border border-gray-700 text-text-primary rounded-lg p-3 focus:border-primary focus:outline-none" />
              <input type="email" placeholder="আপনার ইমেইল" className="w-full bg-background border border-gray-700 text-text-primary rounded-lg p-3 focus:border-primary focus:outline-none" />
              <textarea rows="4" placeholder="আপনার মেসেজ" className="w-full bg-background border border-gray-700 text-text-primary rounded-lg p-3 focus:border-primary focus:outline-none"></textarea>
              <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium transition">মেসেজ পাঠান</button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
