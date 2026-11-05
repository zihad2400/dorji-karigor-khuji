'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiLayers, FiEye, FiStar, FiHeart, FiShoppingCart, 
  FiSend, FiInbox, FiCheckCircle, FiAlertCircle, FiCopy
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { showToast } from '@/components/ui/CustomToast';
import ProfileAvatar from '@/components/ui/ProfileAvatar';

export default function ArtisanDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/artisan/dashboard');
      if (res.ok) {
        const fetchedData = await res.json();
        setData(fetchedData);
        setIsLive(fetchedData.profileStatus === 'Approved');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCopy = () => {
    if (data?.biodataId) {
      navigator.clipboard.writeText(data.biodataId);
      showToast('বায়োডাটা নম্বর কপি হয়েছে!', 'success');
    }
  };

  const handleToggle = async () => {
    if (data?.profileStatus !== 'Approved' && data?.profileStatus !== 'Hidden') {
      showToast('শুধুমাত্র অনুমোদিত বায়োডাটা লাইভ বা হাইড করা যাবে', 'info');
      return;
    }

    setIsToggling(true);
    try {
      const action = isLive ? 'hide' : 'live';
      const res = await fetch('/api/artisan/toggle-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setIsLive(!isLive);
        setData(prev => ({ ...prev, profileStatus: action === 'live' ? 'Approved' : 'Hidden' }));
        showToast(`বায়োডাটা ${action === 'live' ? 'লাইভ' : 'হাইড'} করা হয়েছে`, 'success');
      } else {
        const err = await res.json();
        showToast(err.message, 'error');
      }
    } catch (error) {
      showToast('সমস্যা হয়েছে', 'error');
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">লোড হচ্ছে...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface rounded-2xl border border-gray-800 p-6 flex flex-col items-center text-center">
            <div className="mt-2">
              <ProfileAvatar gender={data?.gender || 'male'} size="medium" />
            </div>
            
            <p className="text-text-secondary text-sm mt-4 mb-1">বায়োডাটা নং</p>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold text-text-primary">{data?.biodataId || 'তৈরি হয়নি'}</h2>
              {data?.biodataId && (
                <button onClick={handleCopy} className="text-text-secondary hover:text-primary-light transition" title="কপি করুন">
                  <FiCopy size={16} />
                </button>
              )}
            </div>
            
            <p className="text-text-secondary text-xs mb-2">বায়োডাটার অবস্থা</p>
            
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                data?.profileStatus === 'Approved' ? 'bg-green-500 text-white' :
                data?.profileStatus === 'Hidden' ? 'bg-gray-600 text-white' :
                'bg-yellow-500 text-white'
              }`}>
                {data?.profileStatus === 'Approved' ? 'লাইভ' : data?.profileStatus === 'Hidden' ? 'হাইড' : 'পেন্ডিং'}
              </span>
              
              <button 
                onClick={handleToggle}
                disabled={isToggling}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLive ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            {data?.biodataId && (
              <Link href={`/artisans/${data.biodataId}`} className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2">
                <FiEye /> আমার বায়োডাটা
              </Link>
            )}
          </div>

          <div className="bg-surface rounded-2xl border border-gray-800 p-4 text-sm space-y-3">
            <h3 className="text-text-primary font-semibold border-b border-gray-800 pb-2">ভেরিফিকেশন</h3>
            <div className="flex items-center gap-2 text-green-400"><FiCheckCircle /> মোবাইল ভেরিফাইড</div>
            <div className="flex items-center gap-2 text-green-400"><FiCheckCircle /> ইমেইল ভেরিফাইড</div>
            <div className="flex items-center gap-2 text-green-400"><FiCheckCircle /> অ্যাডমিন অনুমোদিত</div>
          </div>
        </div>

        {/* Right Column: Stats & Actions */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Connection Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-primary/20">
              <div className="absolute top-4 right-4 text-white/30"><FiShoppingCart size={40} /></div>
              <h3 className="text-white text-2xl font-bold mb-1">{data?.connections || 0} টি</h3>
              <p className="text-white/90 text-sm font-medium mb-1">কানেকশন রয়েছে</p>
              <p className="text-white/70 text-xs mb-4">যোগাযোগের তথ্য দেখতে কানেকশন প্রয়োজন।</p>
              <Link href="/artisan/connections" className="w-full block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition">
                কানেকশন কিনুন
              </Link>
            </motion.div>

            {/* Views Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface rounded-2xl border border-gray-800 p-6 relative">
              <div className="absolute top-4 right-4 text-primary/20"><FiEye size={40} /></div>
              <h3 className="text-text-primary text-2xl font-bold mb-1">{data?.views || 0} বার</h3>
              <p className="text-text-secondary text-sm mb-4">আমার বায়োডাটা দেখা হয়েছে</p>
              <div className="flex justify-between text-xs text-text-secondary border-t border-gray-800 pt-3">
                <div><span className="text-text-primary font-bold block">০</span> শেষ ৩০ দিন</div>
                <div><span className="text-text-primary font-bold block">০</span> শেষ ৭ দিন</div>
                <div><span className="text-text-primary font-bold block">০</span> আজকে</div>
              </div>
            </motion.div>

            {/* Liked By Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface rounded-2xl border border-gray-800 p-6 relative">
              <div className="absolute top-4 right-4 text-yellow-500/20"><FiStar size={40} /></div>
              <h3 className="text-text-primary text-2xl font-bold mb-1">{data?.likedBy || 0} জন</h3>
              <p className="text-text-secondary text-sm mb-1">আমাকে যারা পছন্দ করেছেন</p>
              <p className="text-xs text-text-secondary mt-4">এখনো কেউ আপনার বায়োডাটা পছন্দের তালিকায় রাখেনি।</p>
            </motion.div>
          </div>

          {/* Linkable Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/artisan/saved" className="bg-surface rounded-2xl border border-gray-800 p-4 flex items-center justify-between hover:bg-surfaceHover transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center"><FiHeart size={20} /></div>
                <div>
                  <h4 className="text-text-primary font-medium text-sm">পছন্দের তালিকা</h4>
                  <p className="text-xs text-text-secondary">পছন্দকৃত বায়োডাটা</p>
                </div>
              </div>
              <span className="text-text-primary font-bold text-lg">{data?.favorites || 0}</span>
            </Link>

            <Link href="/artisan/connections" className="bg-surface rounded-2xl border border-gray-800 p-4 flex items-center justify-between hover:bg-surfaceHover transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center"><FiShoppingCart size={20} /></div>
                <div>
                  <h4 className="text-text-primary font-medium text-sm">কানেকশন ক্রয়সমূহ</h4>
                  <p className="text-xs text-text-secondary">কানেকশন ক্রয় তথ্য</p>
                </div>
              </div>
              <span className="text-text-primary font-bold text-lg">{data?.connections || 0}</span>
            </Link>

            <Link href="/artisan/sent-proposals" className="bg-surface rounded-2xl border border-gray-800 p-4 flex items-center justify-between hover:bg-surfaceHover transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><FiSend size={20} /></div>
                <div>
                  <h4 className="text-text-primary font-medium text-sm">প্রস্তাব পাঠিয়েছি</h4>
                  <p className="text-xs text-text-secondary">যাদের তথ্য দেখেছেন</p>
                </div>
              </div>
              <span className="text-text-primary font-bold text-lg">{data?.sentProposals || 0}</span>
            </Link>
          </div>

          <Link href="/artisan/received-proposals" className="bg-surface rounded-2xl border border-gray-800 p-4 flex items-center justify-between hover:bg-surfaceHover transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"><FiInbox size={20} /></div>
              <div>
                <h4 className="text-text-primary font-medium text-sm">প্রস্তাব পেয়েছি</h4>
                <p className="text-xs text-text-secondary">যারা আপনার তথ্য দেখেছেন</p>
              </div>
            </div>
            <span className="text-text-primary font-bold text-lg">{data?.receivedProposals || 0}</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
