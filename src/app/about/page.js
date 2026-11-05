import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <section className="py-20 bg-surface border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">আমাদের সম্পর্কে</h1>
            <p className="text-lg text-text-secondary">দর্জি কারিগর খুঁজি - বাংলাদেশের দক্ষ কারিগর ও প্রতিষ্ঠানের মধ্যে সেতুবন্ধন</p>
          </div>
        </section>
        
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-8 rounded-2xl border border-gray-800 text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary-light rounded-full flex items-center justify-center mx-auto mb-4"><FiTarget size={32} /></div>
              <h3 className="text-xl font-bold text-text-primary mb-3">আমাদের লক্ষ্য</h3>
              <p className="text-text-secondary text-sm">বাংলাদেশের প্রতিটি দক্ষ কারিগরকে সঠিক কর্মস্থলের সাথে যুক্ত করা।</p>
            </div>
            <div className="bg-surface p-8 rounded-2xl border border-gray-800 text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary-light rounded-full flex items-center justify-center mx-auto mb-4"><FiEye size={32} /></div>
              <h3 className="text-xl font-bold text-text-primary mb-3">আমাদের ভিশন</h3>
              <p className="text-text-secondary text-sm">একটি আধুনিক প্ল্যাটফর্ম যেখানে প্রতিটি কারিগর তার যোগ্যতার মূল্য পাবে।</p>
            </div>
            <div className="bg-surface p-8 rounded-2xl border border-gray-800 text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary-light rounded-full flex items-center justify-center mx-auto mb-4"><FiHeart size={32} /></div>
              <h3 className="text-xl font-bold text-text-primary mb-3">আমাদের মূল্যবোধ</h3>
              <p className="text-text-secondary text-sm">সততা, স্বচ্ছতা এবং বিশ্বাসের সাথে কারিগর ও প্রতিষ্ঠানের মাঝে যোগাযোগ স্থাপন।</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
