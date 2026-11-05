'use client';
import { useState, useEffect, useRef } from 'react';
import { FiBell, FiTrash2, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // প্রতি ৩০ সেকেন্ডে নতুন নোটিফিকেশন চেক হবে
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT', body: JSON.stringify({}) });
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
    setNotifications(notifications.filter(n => n._id !== id));
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notif._id })
      });
      setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
    }
    if (notif.link) {
      router.push(notif.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-background transition"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-background/50">
              <h3 className="text-sm font-bold text-text-primary">নোটিফিকেশন</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary-light hover:underline">
                  সব পড়া হয়েছে
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-text-secondary text-sm">
                  কোনো নোটিফিকেশন নেই।
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3 border-b border-gray-800 cursor-pointer hover:bg-background/50 transition flex gap-3 ${
                      !notif.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {notif.type === 'biodata_approved' && <FiCheckCircle className="text-green-500" />}
                      {notif.type === 'biodata_rejected' && <FiAlertCircle className="text-red-500" />}
                      {!['biodata_approved', 'biodata_rejected'].includes(notif.type) && <FiInfo className="text-blue-500" />}
                    </div>
                    <div className="flex-grow">
                      <p className={`text-sm ${!notif.isRead ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">{notif.message}</p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString('bn-BD')}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => deleteNotification(e, notif._id)}
                      className="flex-shrink-0 text-gray-500 hover:text-red-400 transition"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
