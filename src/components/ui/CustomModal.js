'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function CustomModal({ isOpen, onClose, title, message, type = 'success' }) {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-surface w-full max-w-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
        >
          {/* Top colored bar */}
          <div className={`h-2 w-full ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>
          
          <div className="p-6 text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {isSuccess ? <FiCheckCircle size={32} /> : <FiAlertCircle size={32} />}
            </div>
            
            <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
            <p className="text-text-secondary text-sm mb-6">{message}</p>
            
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              ঠিক আছে
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
