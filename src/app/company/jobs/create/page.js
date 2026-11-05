'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiSend } from 'react-icons/fi';
import { showToast } from '@/components/ui/CustomToast';
import BackButton from '@/components/ui/BackButton';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: '', workersRequired: 1, description: '',
    salary: '', salaryNegotiable: false, location: '',
    accommodation: false, food: false, overtime: false, deadline: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/company/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('জব পোস্ট সাবমিট হয়েছে অনুমোদনের জন্য', 'success');
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

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton href="/company/dashboard" label="ড্যাশবোর্ডে ফিরে যান" />
      
      <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800 bg-surfaceHover/30">
          <h1 className="text-2xl font-bold text-text-primary">নতুন জব পোস্ট তৈরি করুন</h1>
          <p className="text-text-secondary text-sm mt-1">সঠিক তথ্য প্রদান করলে দ্রুত অনুমোদন পাবেন।</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>জব টাইটেল *</label>
              <input name="title" value={formData.title} onChange={handleChange} type="text" className={inputClass} placeholder="যেমন: সুইং মেশিন অপারেটর" required />
            </div>
            <div>
              <label className={labelClass}>জব ক্যাটাগরি *</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputClass} required>
                <option value="">নির্বাচন করুন</option>
                <option value="দর্জি">দর্জি</option>
                <option value="মেশিন অপারেটর">মেশিন অপারেটর</option>
                <option value="কাটিং">কাটিং মাস্টার</option>
                <option value="এমব্রয়ডারি">এমব্রয়ডারি</option>
                <option value="কোয়ালিটি">কোয়ালিটি কন্ট্রোলার</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>প্রয়োজনীয় সংখ্যা *</label>
              <input name="workersRequired" value={formData.workersRequired} onChange={handleChange} type="number" min="1" className={inputClass} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>জব এর বিস্তারিত বর্ণনা *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className={inputClass} placeholder="কাজের বিবরণ, যোগ্যতা ইত্যাদি লিখুন..." required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>মাসিক বেতন (৳)</label>
              <input name="salary" value={formData.salary} onChange={handleChange} type="number" className={inputClass} placeholder="যেমন: ১৫০০০" />
            </div>
            <div>
              <label className={labelClass}>কাজের স্থান</label>
              <input name="location" value={formData.location} onChange={handleChange} type="text" className={inputClass} placeholder="যেমন: ঢাকা" />
            </div>
            <div>
              <label className={labelClass}>আবেদনের শেষ তারিখ</label>
              <input name="deadline" value={formData.deadline} onChange={handleChange} type="date" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-700 p-4 rounded-lg bg-background">
            <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
              <input type="checkbox" name="salaryNegotiable" checked={formData.salaryNegotiable} onChange={handleChange} className="w-4 h-4 rounded" />
              বেতন আলোচনা সাপেক্ষ
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
              <input type="checkbox" name="accommodation" checked={formData.accommodation} onChange={handleChange} className="w-4 h-4 rounded" />
              থাকার ব্যবস্থা
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
              <input type="checkbox" name="food" checked={formData.food} onChange={handleChange} className="w-4 h-4 rounded" />
              খাবারের ব্যবস্থা
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
              <input type="checkbox" name="overtime" checked={formData.overtime} onChange={handleChange} className="w-4 h-4 rounded" />
              ওভারটাইম
            </label>
          </div>

          <div className="flex justify-end gap-4 border-t border-gray-800 pt-6">
            <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50">
              {loading ? 'সাবমিট হচ্ছে...' : <><FiSend /> সাবমিট করুন</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
