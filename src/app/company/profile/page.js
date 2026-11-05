'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiBriefcase } from 'react-icons/fi';
import { showToast } from '@/components/ui/CustomToast';
import BackButton from '@/components/ui/BackButton';

export default function CompanyProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    companyName: '', businessCategory: '', ownerName: '', establishedYear: '',
    description: '', numberOfEmployees: '', officeAddress: '', division: '',
    district: '', businessPhone: '', officialEmail: '', website: '', facebookPage: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/company/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFormData({ ...formData, ...data.profile });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/company/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('প্রোফাইল সাবমিট হয়েছে, অ্যাডমিন অনুমোদনের অপেক্ষায়', 'success');
        setTimeout(() => router.push('/company/dashboard'), 1500);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-background border border-gray-700 rounded-lg p-3 text-text-primary focus:border-primary focus:outline-none transition";
  const labelClass = "block text-sm text-text-secondary mb-2";

  if (fetching) return <div className="p-8 text-center text-text-secondary">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton href="/company/dashboard" label="ড্যাশবোর্ডে ফিরে যান" />
      
      <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 bg-surfaceHover/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
            <FiBriefcase size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">কোম্পানি প্রোফাইল</h1>
            <p className="text-text-secondary text-sm mt-1">আপনার প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করুন</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>কোম্পানির নাম *</label>
              <input name="companyName" value={formData.companyName || ''} onChange={handleChange} type="text" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>ব্যবসার ক্যাটাগরি</label>
              <input name="businessCategory" value={formData.businessCategory || ''} onChange={handleChange} type="text" className={inputClass} placeholder="যেমন: গার্মেন্টস" />
            </div>
            <div>
              <label className={labelClass}>মালিকের নাম *</label>
              <input name="ownerName" value={formData.ownerName || ''} onChange={handleChange} type="text" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>প্রতিষ্ঠার সাল</label>
              <input name="establishedYear" value={formData.establishedYear || ''} onChange={handleChange} type="text" className={inputClass} placeholder="যেমন: ২০১৫" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>কোম্পানির বিবরণ</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" className={inputClass} placeholder="কোম্পানি সম্পর্কে বিস্তারিত লিখুন..."></textarea>
            </div>
            <div>
              <label className={labelClass}>কর্মী সংখ্যা</label>
              <input name="numberOfEmployees" value={formData.numberOfEmployees || ''} onChange={handleChange} type="text" className={inputClass} placeholder="যেমন: ৫০ জন" />
            </div>
            <div>
              <label className={labelClass}>অফিস ঠিকানা</label>
              <input name="officeAddress" value={formData.officeAddress || ''} onChange={handleChange} type="text" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>বিভাগ</label>
              <input name="division" value={formData.division || ''} onChange={handleChange} type="text" className={inputClass} placeholder="যেমন: ঢাকা" />
            </div>
            <div>
              <label className={labelClass}>জেলা</label>
              <input name="district" value={formData.district || ''} onChange={handleChange} type="text" className={inputClass} placeholder="যেমন: ঢাকা" />
            </div>
            <div>
              <label className={labelClass}>ব্যবসার ফোন *</label>
              <input name="businessPhone" value={formData.businessPhone || ''} onChange={handleChange} type="text" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>ইমেইল</label>
              <input name="officialEmail" value={formData.officialEmail || ''} onChange={handleChange} type="email" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>ওয়েবসাইট</label>
              <input name="website" value={formData.website || ''} onChange={handleChange} type="text" className={inputClass} placeholder="https://" />
            </div>
            <div>
              <label className={labelClass}>ফেসবুক পেজ</label>
              <input name="facebookPage" value={formData.facebookPage || ''} onChange={handleChange} type="text" className={inputClass} placeholder="https://facebook.com/..." />
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-gray-800 pt-6">
            <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50">
              {loading ? 'সাবমিট হচ্ছে...' : <><FiSave /> সাবমিট করুন</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
