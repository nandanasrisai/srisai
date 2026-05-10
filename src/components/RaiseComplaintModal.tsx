import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { ComplaintService } from '../services/complaintService';
import { X, Send, AlertCircle } from 'lucide-react';

const CATEGORIES = ["Academics", "Hostel Facilities", "Transportation", "IT Services", "General Feedback"] as const;

export function RaiseComplaintModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { profile } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Academics');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      await ComplaintService.raiseComplaint({
        studentId: profile.uid,
        studentEmail: profile.email,
        studentName: profile.displayName,
        title,
        description,
        category,
        isAnonymous,
      });
      setTitle('');
      setDescription('');
      setIsAnonymous(false);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 overflow-hidden relative border border-slate-100"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle size={24} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">New Report</h2>
        <p className="text-slate-500 text-sm font-medium mb-8">What issue are you facing today?</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
              placeholder="e.g. WiFi down in Block C"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-800 appearance-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Details</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:bg-white outline-none transition-all resize-none font-medium text-slate-700 placeholder:text-slate-300"
              placeholder="Describe the problem in detail..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">Submit Anonymously</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight">Authorities won't see your profile details</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-12 h-6 rounded-full transition-colors relative ${isAnonymous ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isAnonymous ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-slate-200 uppercase tracking-widest text-xs"
          >
            {loading ? 'Submitting...' : (
              <>
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Raise Complaint
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
