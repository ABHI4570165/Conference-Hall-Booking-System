// src/components/Toast.js
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ICONS = {
  success: <CheckCircle size={18} className="text-emerald-400" />,
  error: <XCircle size={18} className="text-red-400" />,
  warning: <AlertTriangle size={18} className="text-amber-400" />,
  info: <Info size={18} className="text-blue-400" />,
};

const COLORS = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

const Toast = ({ toast }) => {
  const { removeToast } = useToast();
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-xl animate-slide-in-right ${COLORS[toast.type]} max-w-sm`}>
      <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
      <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
      <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => <Toast key={t.id} toast={t} />)}
    </div>
  );
};

export default ToastContainer;
