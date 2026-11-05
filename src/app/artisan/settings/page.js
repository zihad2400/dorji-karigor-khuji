'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { 
  FiUser, FiLock, FiTrash2, FiAlertTriangle, FiMail, FiPhone, FiSave
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/components/ui/CustomToast';
import BackButton from '@/components/ui/BackButton';

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('অ্যাকাউন্ট তথ্য আপডেট হয়েছে', 'success');
        await refreshUser();
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('পাসওয়ার্ড মিলছে না', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('পাসওয়ার্ড আপডেট হয়েছে', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDeleteText !== 'DELETE') {
      showToast('নিশ্চিত করতে "DELETE" লিখুন', 'error');
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showToast('অ্যাকাউন্ট ডিলিট হয়েছে', 'success');
        setTimeout(() => logout(), 1500);
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const inputClass = "w-full bg-background border border-gray-700 text-text-primary rounded-lg py-3 px-4 focus:outline-none focus:border-primary transition";
  const labelClass = "block text-sm text-text-secondary mb-2";

  return (
    <div className="bg-surface rounded-2xl border border-gray-800 p-6 min-h-[60vh]">
      <BackButton />
      <h1 className="text-2xl font-bold text-text-primary mb-6 border-b border-gray-800 pb-4">সেটিংস</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === 'account' ? 'bg-primary/20 text-primary-light font-medium' : 'text-text-secondary hover:bg-background'}`}>
            <FiUser /> অ্যাকাউন্ট তথ্য
          </button>
          <button onClick={() => setActiveTab('password')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === 'password' ? 'bg-primary/20 text-primary-light font-medium' : 'text-text-secondary hover:bg-background'}`}>
            <FiLock /> পাসওয়ার্ড পরিবর্তন
          </button>
          <button onClick={() => setActiveTab('danger')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${activeTab === 'danger' ? 'bg-red-500/10 text-red-400 font-medium' : 'text-text-secondary hover:bg-background'}`}>
            <FiTrash2 /> অ্যাকাউন্ট ডিলিট
          </button>
        </div>

        <div className="md:col-span-3 bg-background rounded-xl border border-gray-800 p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><FiUser className="text-primary-light" /> অ্যাকাউন্ট তথ্য</h2>
                <form onSubmit={handleUpdateAccount} className="space-y-4 max-w-lg">
                  <div><label className={labelClass}>পূর্ণ নাম</label><input name="name" value={formData.name} onChange={handleChange} type="text" className={inputClass} required /></div>
                  <div><label className={labelClass}>ইমেইল</label><input name="email" value={formData.email} onChange={handleChange} type="email" className={inputClass} required /></div>
                  <div><label className={labelClass}>মোবাইল নম্বর</label><input name="phone" value={formData.phone} onChange={handleChange} type="text" className={inputClass} required /></div>
                  <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2">
                    <FiSave /> {loading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'password' && (
              <motion.div key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><FiLock className="text-primary-light" /> পাসওয়ার্ড পরিবর্তন</h2>
                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
                  <div><label className={labelClass}>বর্তমান পাসওয়ার্ড</label><input name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} type="password" className={inputClass} required /></div>
                  <div><label className={labelClass}>নতুন পাসওয়ার্ড</label><input name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} type="password" className={inputClass} required /></div>
                  <div><label className={labelClass}>নতুন পাসওয়ার্ড কনফার্ম করুন</label><input name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} type="password" className={inputClass} required /></div>
                  <button type="submit" disabled={loading} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2">
                    <FiLock /> {loading ? 'আপডেট হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'danger' && (
              <motion.div key="danger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2"><FiAlertTriangle /> ডেঞ্জার জোন</h2>
                <div className="p-5 border border-red-500/30 bg-red-500/5 rounded-xl">
                  <h3 className="text-text-primary font-medium mb-2">অ্যাকাউন্ট ডিলিট করুন</h3>
                  <p className="text-text-secondary text-sm mb-4">আপনার অ্যাকাউন্ট ডিলিট করলে সমস্ত তথ্য স্থায়ীভাবে মুছে যাবে।</p>
                  <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2">
                    <FiTrash2 /> অ্যাকাউন্ট ডিলিট করুন
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-surface w-full max-w-md rounded-2xl border border-red-500/50 shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><FiAlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold text-text-primary mb-2">আপনি কি নিশ্চিত?</h3>
              <p className="text-text-secondary mb-4 text-sm">নিশ্চিত করতে <strong className="text-red-400">DELETE</strong> লিখুন।</p>
              <input type="text" value={confirmDeleteText} onChange={(e) => setConfirmDeleteText(e.target.value)} placeholder="DELETE" className="w-full bg-background border border-red-500/50 rounded-lg p-3 text-center text-text-primary focus:outline-none" />
            </div>
            <div className="p-4 border-t border-gray-800 bg-background/50 flex gap-3">
              <button onClick={() => { setIsDeleteModalOpen(false); setConfirmDeleteText(''); }} className="flex-1 bg-surfaceHover hover:bg-gray-700 text-text-primary py-2 rounded-lg">বাতিল</button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || confirmDeleteText !== 'DELETE'} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg disabled:opacity-50">
                {deleteLoading ? 'ডিলিট হচ্ছে...' : 'ডিলিট করুন'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
