import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-surface p-8 rounded-2xl border border-gray-800">
          <h1 className="text-3xl font-bold text-text-primary mb-6 border-b border-gray-800 pb-4">গোপনীয়তা নীতি</h1>
          <div className="prose prose-invert max-w-none text-text-secondary space-y-4 text-sm leading-relaxed">
            <p>দর্জি কারিগর খুঁজি আপনার গোপনীয়তাকে অত্যন্ত গুরুত্ব দেয়। আমরা আপনার ব্যক্তিগত তথ্য সংগ্রহ করি এবং সেগুলো সুরক্ষিত রাখতে সর্বোচ্চ ব্যবস্থা গ্রহণ করি।</p>
            <h3 className="text-text-primary font-bold text-lg mt-6 mb-2">আমরা কী কী তথ্য সংগ্রহ করি</h3>
            <p>নাম, ইমেইল, মোবাইল নম্বর, ঠিকানা এবং পেশাগত তথ্য যা আপনি বায়োডাটা তৈরির সময় দিয়ে থাকেন।</p>
            <h3 className="text-text-primary font-bold text-lg mt-6 mb-2">তথ্যের ব্যবহার</h3>
            <p>আপনার তথ্য শুধুমাত্র কারিগর ও প্রতিষ্ঠানের মধ্যে যোগাযোগ স্থাপন এবং প্ল্যাটফর্মের সেবা উন্নয়নের জন্য ব্যবহার করা হয়।</p>
            <h3 className="text-text-primary font-bold text-lg mt-6 mb-2">তৃতীয় পক্ষের সাথে শেয়ার</h3>
            <p>আপনার সম্মতি ছাড়া আমরা কোনো তৃতীয় পক্ষের সাথে আপনার ব্যক্তিগত তথ্য শেয়ার করি না। তবে কানেকশন কেনার পর সংশ্লিষ্ট পক্ষ আপনার তথ্য দেখতে পাবে।</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
