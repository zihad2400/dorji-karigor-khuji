import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function FAQPage() {
  const faqs = [
    { q: 'কীভাবে অ্যাকাউন্ট তৈরি করব?', a: 'উপরের ডানদিকের "লগইন" বাটনে ক্লিক করে "অ্যাকাউন্ট তৈরি করুন" অপশন থেকে কারিগর বা প্রতিষ্ঠান হিসেবে রেজিস্ট্রেশন করতে পারবেন।' },
    { q: 'কানেকশন কী এবং কেন কিনতে হবে?', a: 'কানেকশন হলো একটি পেমেন্ট সিস্টেম যা দিয়ে আপনি অন্য পক্ষের যোগাযোগের তথ্য (মোবাইল নম্বর) আনলক করতে পারবেন।' },
    { q: 'বায়োডাটা কত দিনে অনুমোদিত হয়?', a: 'সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে অ্যাডমিন আপনার বায়োডাটা যাচাই করে অনুমোদন দিয়ে থাকেন।' },
    { q: 'পাসওয়ার্ড ভুলে গেলে কী করব?', a: 'লগইন পেজে "পাসওয়ার্ড ভুলে গেছেন" অপশন ব্যবহার করে রিসেট করতে পারবেন।' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">সাধারণ জিজ্ঞাসা</h1>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-surface p-6 rounded-xl border border-gray-800">
                <h3 className="text-lg font-semibold text-text-primary mb-2">{faq.q}</h3>
                <p className="text-text-secondary text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
