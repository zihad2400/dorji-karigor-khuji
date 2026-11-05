'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiMail, FiLock, FiPhone, FiUserPlus, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import CustomModal from '@/components/ui/CustomModal';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState('artisan');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // মডাল স্টেট
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', type: 'success' });
  
  // ইনলাইন এরর স্টেট
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'নিবন্ধন ব্যর্থ হয়েছে');
      }

      // সাকসেস হলে মডাল দেখানো
      setModalData({
        title: 'সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!',
        message: 'আপনার অ্যাকাউন্টটি সফলভাবে তৈরি করা হয়েছে। এখন লগইন করতে পারবেন।',
        type: 'success'
      });
      setModalOpen(true);
      
    } catch (err) {
      // এরর হলে ইনলাইন দেখানো
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    router.push('/login'); // মডাল বন্ধ করলে লগইন পেজে নিয়ে যাবে
  };

  const inputClass = "w-full bg-[#0f0f13] border border-gray-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition placeholder-gray-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f13] py-12 px-4 sm:px-6 lg:px-8">
      {/* কাস্টম মডাল */}
      <CustomModal 
        isOpen={modalOpen} 
        onClose={handleModalClose} 
        title={modalData.title} 
        message={modalData.message} 
        type={modalData.type} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-6 bg-[#18181f] p-8 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-primary-light flex justify-center items-center gap-2">
             দর্জি কারিগর খুঁজি
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-white">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h2>
        </div>

        {/* ইনলাইন এরর মেসেজ */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2"
          >
            <FiAlertCircle className="flex-shrink-0" /> {errorMsg}
          </motion.div>
        )}

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">আপনি কে? (Who are you?)</label>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setRole('artisan')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                role === 'artisan' ? 'border-primary bg-primary/10 text-primary-light' : 'border-gray-700 text-text-secondary hover:border-gray-500 bg-[#0f0f13]'
              }`}
            >
              <FiUser size={24} className="mb-2" />
              <span className="font-medium text-sm">কারিগর / দর্জি</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setRole('company')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                role === 'company' ? 'border-primary bg-primary/10 text-primary-light' : 'border-gray-700 text-text-secondary hover:border-gray-500 bg-[#0f0f13]'
              }`}
            >
              <FiBriefcase size={24} className="mb-2" />
              <span className="font-medium text-sm">প্রতিষ্ঠান / কোম্পানি</span>
            </motion.button>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FiUser />
            </div>
            <input
              name="name"
              type="text"
              required
              autoComplete="off"
              className={inputClass}
              placeholder="আপনার নাম (Name)"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FiPhone />
            </div>
            <input
              name="phone"
              type="text"
              required
              autoComplete="off"
              className={inputClass}
              placeholder="মোবাইল নম্বর (Phone)"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FiMail />
            </div>
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              className={inputClass}
              placeholder="ইমেইল (Email)"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FiLock />
            </div>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              className={`${inputClass} pr-10`}
              placeholder="পাসওয়ার্ড (Password)"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-[#9b59b6] hover:bg-[#8e44ad] text-white py-3 rounded-lg font-medium transition disabled:opacity-50 mt-2 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                অপেক্ষা করুন...
              </span>
            ) : (
              <><FiUserPlus /> নিবন্ধন করুন</>
            )}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <p className="text-text-secondary text-sm">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="text-primary-light hover:underline">
              লগইন করুন
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
