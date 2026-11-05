'use client';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const CustomToast = ({ t, message, type }) => {
  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-[#18181f] shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border ${
        isSuccess ? 'border-green-500/50' : isError ? 'border-red-500/50' : 'border-blue-500/50'
      }`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {isSuccess && <FiCheckCircle className="h-6 w-6 text-green-500" />}
            {isError && <FiAlertCircle className="h-6 w-6 text-red-500" />}
            {!isSuccess && !isError && <FiInfo className="h-6 w-6 text-blue-500" />}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-700">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white focus:outline-none transition"
        >
          <FiX size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export const showToast = (message, type = 'success') => {
  toast.custom((t) => (
    <CustomToast t={t} message={message} type={type} />
  ));
};
