'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { FiUser, FiLock, FiTrash2, FiAlertTriangle, FiSave } from 'react-icons/fi';
import { showToast } from '@/components/ui/CustomToast';
import BackButton from '@/components/ui/BackButton';
import { useRouter } from 'next/navigation';

export default function CompanySettingsPage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showToast('আপডেট হয়েছে', 'success');
        await refreshUser();
      } else {
        const data = await res.json();
        showToast(data.message, 'error');
      }
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
      if (res.ok) {
        showToast('অ্যাকাউন্ট ডিলিট হয়েছে', 'success');
        setTimeout(() => logout(), 1500);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const inputClass = "w-full bg-background border border-gray-700 text-text-primary rounded-lg py-3 px-4 focus:outline-none focus:border-primary";

  return (
    <div>
      <BackButton href="/company/dashboard" label="ড্যাশবোর্ডে ফিরে যান" />
      <h1 className="text-2xl font-bold text-text-primary mb-6">সেটিংস</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeTab === 'account' ? 'bg-primary/20 text-primary-light' : 'text-text-secondary'}`}>
            <FiUser /> অ্যাকাউন্ট
          </button>
          <button onClick={() => setActiveTab('danger')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${activeTab === 'danger' ? 'bg-red-500/10 text-red-400' : 'text-text-secondary'}`}>
            <FiTrash2 /> ডিলিট
          </button>
        </div>

        <div className="md:col-span-3 bg-background rounded-xl border border-gray-800 p-6">
          {activeTab === 'account' && (
            <form onSubmit={handleUpdateAccount} className="space-y-4 max-w-lg">
              <div><label className="block text-sm text-text-secondary mb-2">নাম</label><input name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
              <div><label className="block text-sm text-text-secondary mb-2">ইমেইল</label><input name="email" value={formData.email} onChange={handleChange} type="email" className={inputClass} /></div>
              <div><label className="block text-sm text-text-secondary mb-2">ফোন</label><input name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
              <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2">
                <FiSave /> {loading ? 'আপডেট হচ্ছে...' : 'আপডেট'}
              </button>
            </form>
          )}

          {activeTab === 'danger' && (
            <div className="p-5 border border-red-500/30 bg-red-500/5 rounded-xl">
              <h3 className="text-red-400 font-medium mb-2 flex items-center gap-2"><FiAlertTriangle /> অ্যাকাউন্ট ডিলিট</h3>
              <p className="text-text-secondary text-sm mb-4">এই কাজটি ফিরিয়ে আনা সম্ভব নয়।</p>
              <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-500 text-white px-6 py-2 rounded-lg">
                ডিলিট করুন
              </button>
            </div>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-surface p-6 rounded-2xl max-w-md w-full">
            <h3 className="text-xl font-bold text-text-primary mb-2">নিশ্চিত করুন</h3>
            <p className="text-sm text-text-secondary mb-3">"DELETE" লিখুন:</p>
            <input type="text" value={confirmDeleteText} onChange={(e) => setConfirmDeleteText(e.target.value)} className={inputClass} />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-surfaceHover py-2 rounded-lg">বাতিল</button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || confirmDeleteText !== 'DELETE'} className="flex-1 bg-red-500 text-white py-2 rounded-lg disabled:opacity-50">
                {deleteLoading ? 'ডিলিট হচ্ছে...' : 'ডিলিট'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
