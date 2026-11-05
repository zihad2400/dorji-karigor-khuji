'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiCheck, FiShoppingCart, FiShield } from 'react-icons/fi';
import { showToast } from '@/components/ui/CustomToast';
import { useAuth } from '@/components/providers/AuthProvider';

// প্যাকেজ ডাটা (পরবর্তীতে ডাটাবেস থেকে আসবে)
const packages = [
  {
    id: 'basic',
    name: 'বেসিক',
    connectionCount: 1,
    price: 100,
    description: '১ টি কানেকশন দিয়ে ১ টি কারিগরের যোগাযোগ তথ্য দেখতে পারবেন।',
  },
  {
    id: 'standard',
    name: 'স্ট্যান্ডার্ড',
    connectionCount: 5,
    price: 400,
    description: '৫ টি কানেকশন দিয়ে ৫ টি কারিগরের যোগাযোগ তথ্য দেখতে পারবেন।',
  },
  {
    id: 'popular',
    name: 'পপুলার',
    connectionCount: 10,
    price: 700,
    description: '১০ টি কানেকশন দিয়ে ১০ টি কারিগরের যোগাযোগ তথ্য দেখতে পারবেন।',
    badge: 'সাশ্রয়ী',
  },
];

function BuyConnectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const packageId = searchParams.get('package');
    if (packageId) {
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) setSelectedPackage(pkg);
    }
  }, [searchParams]);

  const handlePurchase = async () => {
    if (!user) {
      showToast('কিনতে প্রথমে লগইন করুন।', 'info');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    if (!selectedPackage) {
      showToast('প্যাকেজ নির্বাচন করুন', 'error');
      return;
    }

    if (!agreeTerms) {
      showToast('শর্তাবলীতে সম্মতি দিন', 'error');
      return;
    }

    setLoading(true);
    try {
      // পেমেন্ট সিমুলেশন
      console.log(`💰 Payment: ${selectedPackage.price}৳ via ${paymentMethod}`);
      
      // কানেকশন তৈরি
      const res = await fetch('/api/connection/buy-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          connectionCount: selectedPackage.connectionCount,
          amount: selectedPackage.price,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('পেমেন্ট সফল! কানেকশন অ্যাক্টিভেট হয়েছে।', 'success');
        setTimeout(() => router.push('/artisan/dashboard'), 1500);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">কানেকশন কিনুন</h1>
      <p className="text-text-secondary text-center mb-10">কারিগর বা প্রতিষ্ঠানের যোগাযোগের তথ্য দেখতে কানেকশন কিনুন</p>

      {/* প্যাকেজ সিলেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {packages.map(pkg => (
          <div 
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg)}
            className={`relative bg-surface rounded-2xl border-2 p-6 cursor-pointer transition ${
              selectedPackage?.id === pkg.id 
                ? 'border-primary shadow-lg shadow-primary/20' 
                : 'border-gray-800 hover:border-gray-600'
            }`}
          >
            {pkg.badge && (
              <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs px-2 py-1 rounded">
                ★ {pkg.badge}
              </div>
            )}
            <div className="text-center">
              <h3 className="text-lg font-bold text-text-primary mb-4">{pkg.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-4xl font-bold text-primary-light">{pkg.connectionCount}</span>
                <span className="text-text-secondary">টি কানেকশন</span>
              </div>
              <div className="bg-background rounded-lg py-2 px-4 inline-block mb-4">
                <span className="text-text-primary font-bold">মূল্য: {pkg.price} টাকা</span>
              </div>
              <p className="text-sm text-text-secondary mb-6">{pkg.description}</p>
              <button className={`w-full py-3 rounded-lg font-medium transition ${
                selectedPackage?.id === pkg.id 
                  ? 'bg-primary text-white' 
                  : 'bg-background border border-gray-700 text-text-primary'
              }`}>
                <FiShoppingCart className="inline mr-2" /> 
                {selectedPackage?.id === pkg.id ? 'নির্বাচিত' : 'এখন কিনুন'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* পেমেন্ট সেকশন */}
      {selectedPackage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* অর্ডার সামারি */}
          <div className="lg:col-span-1 bg-surface rounded-2xl border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <FiShoppingCart className="text-primary-light" /> অর্ডার সারাংশ
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">প্যাকেজের নাম</span>
                <span className="text-text-primary font-medium">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">কানেকশন সংখ্যা</span>
                <span className="text-text-primary font-medium">{selectedPackage.connectionCount} টি</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-3">
                <span className="text-text-secondary">মোট মূল্য</span>
                <span className="text-primary-light font-bold text-lg">৳ {selectedPackage.price}</span>
              </div>
            </div>
          </div>

          {/* পেমেন্ট মেথড */}
          <div className="lg:col-span-2 bg-surface rounded-2xl border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4">পেমেন্ট গেটওয়ে নির্বাচন করুন</h2>
            
            <div className="space-y-3 mb-6">
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                paymentMethod === 'bkash' ? 'border-primary bg-primary/5' : 'border-gray-700'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="bkash" 
                  checked={paymentMethod === 'bkash'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <span className="text-text-primary font-medium">bKash</span>
              </label>
              
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                paymentMethod === 'nagad' ? 'border-primary bg-primary/5' : 'border-gray-700'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="nagad" 
                  checked={paymentMethod === 'nagad'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5"
                />
                <span className="text-text-primary font-medium">Nagad / Rocket / VISA / Mastercard</span>
              </label>
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 mt-1"
              />
              <span className="text-sm text-text-secondary">
                আমি শর্তাবলী এবং রিফান্ড নীতি মেনে নিচ্ছি।
              </span>
            </label>

            <button 
              onClick={handlePurchase}
              disabled={loading || !agreeTerms}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'প্রসেস হচ্ছে...' : <><FiCheck /> এখন পরিশোধ করুন</>}
            </button>

            <p className="text-center text-xs text-text-secondary mt-3 flex items-center justify-center gap-1">
              <FiShield /> ১০০% নিরাপদ পেমেন্ট
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyConnectionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="text-center py-20 text-text-secondary">লোড হচ্ছে...</div>}>
          <BuyConnectionContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
