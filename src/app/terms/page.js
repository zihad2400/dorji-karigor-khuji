import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-surface p-8 rounded-2xl border border-gray-800">
          <h1 className="text-3xl font-bold text-text-primary mb-6 border-b border-gray-800 pb-4">শর্তাবলী</h1>
          <div className="prose prose-invert max-w-none text-text-secondary space-y-4 text-sm leading-relaxed">
            <p>দর্জি কারিগর খুঁজি ব্যবহার করে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন।</p>
            <h3 className="text-text-primary font-bold text-lg mt-6 mb-2">অ্যাকাউন্টের দায়িত্ব</h3>
            <p>আপনার অ্যাকাউন্টের পাসওয়ার্ড গোপন রাখার দায়িত্ব আপনার। আপনি প্রদত্ত তথ্যের সত্যতা নিশ্চিত করবেন।</p>
            <h3 className="text-text-primary font-bold text-lg mt-6 mb-2">নিষিদ্ধ কার্যক্রম</h3>
            <p>ভুয়া তথ্য প্রদান, অন্যকে হয়রানি করা বা প্ল্যাটফর্মের ক্ষতি করার চেষ্টা করা সম্পূর্ণ নিষিদ্ধ।</p>
            <h3 className="text-text-primary font-bold text-lg mt-6 mb-2">সেবার পরিবর্তন</h3>
            <p>আমরা যেকোনো সময় সেবার শর্তাবলী পরিবর্তন বা আপডেট করার অধিকার সংরক্ষণ করি।</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
