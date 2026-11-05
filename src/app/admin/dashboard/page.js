'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { 
  FiUsers, FiBriefcase, FiClock, FiActivity, FiLogOut, 
  FiCheck, FiX, FiRefreshCw, FiSearch, FiCheckCircle, FiSlash, 
  FiAlertCircle, FiTrash2, FiUserX, FiEye, FiFileText
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@/components/ui/CustomToast';
import NotificationBell from '@/components/ui/NotificationBell';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [companyProfiles, setCompanyProfiles] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // মডাল স্টেট
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // ডিলিট মডাল
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, profilesRes, usersRes, companiesRes, jobsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/profiles?status=Pending Approval'),
        fetch('/api/admin/users'),
        fetch('/api/admin/companies?status=Pending Approval'),
        fetch('/api/admin/jobs?status=Pending Approval')
      ]);

      setStats(await statsRes.json());
      
      const profileData = await profilesRes.json();
      setProfiles(profileData.profiles || []);
      
      const userData = await usersRes.json();
      setUsers(userData.users || []);
      
      const companiesResData = await companiesRes.json();
      setCompanyProfiles(companiesResData.companies || []);
      
      const jobsResData = await jobsRes.json();
      setPendingJobs(jobsResData.jobs || []);
      
    } catch (error) {
      console.error(error);
      showToast('ডাটা লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === বায়োডাটা অ্যাপ্রুভ/রিজেক্ট ===
  const openProfileModal = (profile) => {
    setSelectedProfile(profile);
    setAdminFeedback('');
    setIsModalOpen(true);
  };

  const handleProfileStatusChange = async (newStatus) => {
    if (newStatus === 'Rejected' && !adminFeedback.trim()) {
      showToast('রিজেক্ট করার জন্য কারণ লিখুন।', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profileId: selectedProfile._id, 
          status: newStatus,
          adminFeedback: adminFeedback 
        }),
      });

      if (res.ok) {
        setProfiles(profiles.filter(p => p._id !== selectedProfile._id));
        setIsModalOpen(false);
        showToast(`বায়োডাটা ${newStatus === 'Approved' ? 'অনুমোদিত' : 'রিজেক্টেড'} হয়েছে`, 'success');
        fetchData();
      } else {
        showToast('আপডেট ব্যর্থ হয়েছে', 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // === কোম্পানি অ্যাপ্রুভ/রিজেক্ট ===
  const handleCompanyApprove = async (companyId, status) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, status }),
      });

      if (res.ok) {
        setCompanyProfiles(companyProfiles.filter(c => c._id !== companyId));
        showToast(`কোম্পানি ${status === 'Approved' ? 'অনুমোদিত' : 'রিজেক্টেড'} হয়েছে`, 'success');
        fetchData();
      } else {
        showToast('আপডেট ব্যর্থ হয়েছে', 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // === জব অ্যাপ্রুভ/রিজেক্ট ===
  const handleCompanyDelete = async (companyId) => {
    if (!confirm('আপনি কি এই কোম্পানি ডিলিট করতে চান?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/companies/${companyId}`, { method: 'DELETE' });
      if (res.ok) {
        setCompanyProfiles(companyProfiles.filter(c => c._id !== companyId));
        showToast('কোম্পানি ডিলিট হয়েছে', 'success');
        fetchData();
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJobApprove = async (jobId, status) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, status }),
      });

      if (res.ok) {
        setPendingJobs(pendingJobs.filter(j => j._id !== jobId));
        showToast(`জব ${status === 'Published' ? 'প্রকাশিত' : 'রিজেক্টেড'} হয়েছে`, 'success');
        fetchData();
      } else {
        showToast('আপডেট ব্যর্থ হয়েছে', 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // === ইউজার ডিলিট ===
  const openDeleteModal = (userToDelete) => {
    setUserToDelete(userToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userToDelete._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userToDelete._id));
        setIsDeleteModalOpen(false);
        showToast('ইউজার সফলভাবে ডিলিট হয়েছে', 'success');
        fetchData();
      } else {
        showToast('ডিলিট ব্যর্থ হয়েছে', 'error');
      }
    } catch (error) {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // === রিইউজেবল কার্ড কম্পোনেন্ট (তিনটি ট্যাবের জন্য) ===
  const ApprovalCard = ({ title, subtitle, description, onApprove, onReject, onView, type }) => (
    <div className="bg-surface p-5 rounded-2xl border border-gray-700 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold">
          {title?.charAt(0)}
        </div>
        <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">PENDING</span>
      </div>
      <h3 className="text-white font-bold text-lg truncate">{title}</h3>
      <p className="text-xs text-primary-light mb-2 truncate">{subtitle}</p>
      {description && <p className="text-xs text-text-secondary mb-1 truncate">{description}</p>}
      
      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-800">
        {onView && (
          <button onClick={onView} className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary-light text-xs py-2 rounded-lg border border-primary/30 transition flex items-center justify-center gap-1">
            <FiEye size={14} /> বিস্তারিত
          </button>
        )}
        <button onClick={onApprove} disabled={actionLoading} className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs py-2 rounded-lg border border-green-500/30 transition disabled:opacity-50 flex items-center justify-center gap-1">
          <FiCheck size={14} /> অ্যাপ্রুভ
        </button>
        <button onClick={onReject} disabled={actionLoading} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs py-2 rounded-lg border border-red-500/30 transition disabled:opacity-50 flex items-center justify-center gap-1">
          <FiSlash size={14} /> রিজেক্ট
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      <header className="bg-surface border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            অ্যাডমিন কন্ট্রোল প্যানেল
            <span className="text-xs bg-primary/20 text-primary-light px-2 py-1 rounded">Super Admin</span>
          </h1>
          <div className="flex gap-3">
            <NotificationBell />
            <button onClick={fetchData} className="p-2 text-text-secondary hover:text-white bg-background rounded-lg border border-gray-700">
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={logout} className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition">
              <FiLogOut /> লগআউট
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface p-5 rounded-2xl border border-gray-800">
            <p className="text-text-secondary text-xs mb-1">মোট কারিগর</p>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold text-white">{stats?.totalArtisans || 0}</h3>
              <FiUsers className="text-blue-400 text-xl mb-1" />
            </div>
          </div>
          <div className="bg-surface p-5 rounded-2xl border border-gray-800">
            <p className="text-text-secondary text-xs mb-1">মোট প্রতিষ্ঠান</p>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold text-white">{stats?.totalCompanies || 0}</h3>
              <FiBriefcase className="text-green-400 text-xl mb-1" />
            </div>
          </div>
          <div className="bg-surface p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
            <p className="text-text-secondary text-xs mb-1">পেন্ডিং বায়োডাটা</p>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold text-yellow-400">{stats?.pendingArtisanProfiles || 0}</h3>
              <FiClock className="text-yellow-400 text-xl mb-1" />
            </div>
          </div>
          <div className="bg-surface p-5 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
            <p className="text-text-secondary text-xs mb-1">পেন্ডিং কোম্পানি</p>
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-bold text-orange-400">{stats?.pendingCompanyProfiles || 0}</h3>
              <FiBriefcase className="text-orange-400 text-xl mb-1" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 overflow-x-auto">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-primary-light border-b-2 border-primary' : 'text-text-secondary'}`}>ওভারভিউ</button>
          <button onClick={() => setActiveTab('approvals')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'approvals' ? 'text-primary-light border-b-2 border-primary' : 'text-text-secondary'}`}>
            বায়োডাটা অনুমোদন {profiles.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full">{profiles.length}</span>}
          </button>
          <button onClick={() => setActiveTab('companies')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'companies' ? 'text-primary-light border-b-2 border-primary' : 'text-text-secondary'}`}>
            কোম্পানি অনুমোদন {companyProfiles.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full">{companyProfiles.length}</span>}
          </button>
          <button onClick={() => setActiveTab('jobs')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'jobs' ? 'text-primary-light border-b-2 border-primary' : 'text-text-secondary'}`}>
            জব অনুমোদন {pendingJobs.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full">{pendingJobs.length}</span>}
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'users' ? 'text-primary-light border-b-2 border-primary' : 'text-text-secondary'}`}>ইউজার ম্যানেজমেন্ট</button>
        </div>

        <AnimatePresence mode="wait">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-surface p-6 rounded-2xl border border-gray-800">
              <h2 className="text-lg font-bold text-white mb-4">সিস্টেম অ্যাক্টিভিটি</h2>
              <div className="flex items-center gap-4 p-3 bg-background rounded-xl border border-gray-800">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm text-text-secondary flex-grow">সিস্টেম স্বাভাবিকভাবে চলছে।</p>
                <span className="text-xs text-gray-500">এখন</span>
              </div>
            </motion.div>
          )}

          {/* Biodata Approvals */}
          {activeTab === 'approvals' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {loading ? (
                <div className="text-center py-12 text-text-secondary">লোড হচ্ছে...</div>
              ) : profiles.length === 0 ? (
                <div className="bg-surface p-12 rounded-2xl border border-gray-800 text-center">
                  <FiCheckCircle className="mx-auto text-4xl text-green-500/50 mb-3" />
                  <p className="text-text-secondary">কোনো পেন্ডিং বায়োডাটা নেই।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profiles.map((profile) => (
                    <ApprovalCard 
                      key={profile._id}
                      title={profile.fullName}
                      subtitle={profile.biodataId}
                      description={profile.user?.email}
                      onView={() => openProfileModal(profile)}
                      onApprove={() => openProfileModal(profile)}
                      onReject={() => openProfileModal(profile)}
                      type="biodata"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Company Approvals */}
          {activeTab === 'companies' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {loading ? (
                <div className="text-center py-12 text-text-secondary">লোড হচ্ছে...</div>
              ) : companyProfiles.length === 0 ? (
                <div className="bg-surface p-12 rounded-2xl border border-gray-800 text-center">
                  <FiCheckCircle className="mx-auto text-4xl text-green-500/50 mb-3" />
                  <p className="text-text-secondary">কোনো পেন্ডিং কোম্পানি নেই।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyProfiles.map((company) => (
                    <ApprovalCard 
                      key={company._id}
                      title={company.companyName}
                      subtitle={company.businessCategory}
                      description={company.user?.email}
                      onApprove={() => handleCompanyApprove(company._id, 'Approved')}
                      onReject={() => handleCompanyApprove(company._id, 'Rejected')}
                      type="company"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Job Approvals */}
          {activeTab === 'jobs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {loading ? (
                <div className="text-center py-12 text-text-secondary">লোড হচ্ছে...</div>
              ) : pendingJobs.length === 0 ? (
                <div className="bg-surface p-12 rounded-2xl border border-gray-800 text-center">
                  <FiCheckCircle className="mx-auto text-4xl text-green-500/50 mb-3" />
                  <p className="text-text-secondary">কোনো পেন্ডিং জব নেই।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingJobs.map((job) => (
                    <ApprovalCard 
                      key={job._id}
                      title={job.title}
                      subtitle={job.category}
                      description={job.company?.name}
                      onApprove={() => handleJobApprove(job._id, 'Published')}
                      onReject={() => handleJobApprove(job._id, 'Rejected')}
                      type="job"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex gap-4 bg-background/50">
                <div className="relative flex-grow max-w-md">
                  <FiSearch className="absolute left-3 top-3 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-text-secondary">
                    <tr>
                      <th className="px-6 py-3">নাম</th>
                      <th className="px-6 py-3">ইমেইল</th>
                      <th className="px-6 py-3">রোল</th>
                      <th className="px-6 py-3">স্ট্যাটাস</th>
                      <th className="px-6 py-3 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-b border-gray-800 hover:bg-background/50">
                        <td className="px-6 py-4 text-white">{u.name}</td>
                        <td className="px-6 py-4 text-text-secondary">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${u.role === 'artisan' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          {u.isSuspended ? <span className="text-red-400">Suspended</span> : <span className="text-green-400">Active</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {u.role !== 'admin' && u.role !== 'superadmin' && (
                            <button onClick={() => openDeleteModal(u)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition">
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* বায়োডাটা রিভিউ মডাল */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface w-full max-w-3xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-background/50">
              <h3 className="text-lg font-bold text-white">বায়োডাটা পর্যালোচনা</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-white"><FiX size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-background p-4 rounded-xl border border-gray-800">
                <h4 className="text-primary-light font-semibold mb-3 border-b border-gray-700 pb-2">মূল তথ্য</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-text-secondary block mb-1">নাম</span> <span className="text-white">{selectedProfile.fullName}</span></div>
                  <div><span className="text-text-secondary block mb-1">আইডি</span> <span className="text-primary-light">{selectedProfile.biodataId}</span></div>
                  <div><span className="text-text-secondary block mb-1">ইমেইল</span> <span className="text-white">{selectedProfile.user?.email}</span></div>
                  <div><span className="text-text-secondary block mb-1">মোবাইল</span> <span className="text-white">{selectedProfile.mobileNumber}</span></div>
                </div>
              </div>
              <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2"><FiAlertCircle /> রিজেক্ট করার কারণ</h4>
                <textarea 
                  rows="3" 
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none" 
                  placeholder="কারণ লিখুন..."
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 bg-background/50 flex gap-3">
              <button onClick={() => handleProfileStatusChange('Approved')} disabled={actionLoading} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50">
                <FiCheck /> অ্যাপ্রুভ
              </button>
              <button onClick={() => handleProfileStatusChange('Rejected')} disabled={actionLoading || !adminFeedback.trim()} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <FiSlash /> রিজেক্ট
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ডিলিট মডাল */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <FiUserX size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ইউজার ডিলিট করুন</h3>
              <p className="text-text-secondary mb-4">
                আপনি কি নিশ্চিত যে <strong className="text-white">{userToDelete.name}</strong> কে ডিলিট করতে চান?
              </p>
            </div>
            <div className="p-4 border-t border-gray-800 bg-background/50 flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-surfaceHover hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition">বাতিল</button>
              <button onClick={handleDeleteUser} disabled={actionLoading} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition disabled:opacity-50">
                {actionLoading ? 'ডিলিট হচ্ছে...' : 'ডিলিট করুন'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
