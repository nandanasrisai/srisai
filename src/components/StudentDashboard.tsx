import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { Complaint, ComplaintService } from '../services/complaintService';
import { Plus, LayoutGrid, Clock, CheckCircle2, MoreHorizontal, MessageSquare, AlertCircle } from 'lucide-react';
import { RaiseComplaintModal } from './RaiseComplaintModal';

const StatusBadge = ({ status }: { status: Complaint['status'] }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    "in-progress": "bg-blue-50 text-blue-600 border-blue-100",
    resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  
  const icons = {
    pending: <Clock size={14} />,
    "in-progress": <MoreHorizontal size={14} />,
    resolved: <CheckCircle2 size={14} />,
  };

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export function StudentDashboard() {
  const { profile } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const unsubscribe = ComplaintService.subscribeToStudentComplaints(profile.uid, setComplaints);
    return () => unsubscribe();
  }, [profile]);

  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const activeCount = complaints.filter(c => c.status !== 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Campus Connect</h1>
        <p className="text-slate-500">Empowering student voices at University of Excellence</p>
      </header>

      {/* Bento Grid Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Main Action Card */}
        <div className="md:col-span-2 bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Encountering a problem?</h2>
            <p className="text-indigo-100 opacity-90 mb-6 max-w-[280px]">Report academics, hostel, or transport issues directly to administrators.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Raise New Complaint
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-110 transition-transform">
            <LayoutGrid size={180} strokeWidth={1} />
          </div>
        </div>

        {/* Resolved Stats */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Resolved</span>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle2 size={18} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <span className="text-4xl font-bold text-slate-800">{resolvedCount.toString().padStart(2, '0')}</span>
            <p className="text-slate-500 text-sm mt-1">Issues solved this term</p>
          </div>
        </div>

        {/* Active Stats */}
        <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-emerald-600 font-semibold uppercase tracking-wider text-xs">Your Reports</span>
            <div className="p-2 bg-emerald-200 text-emerald-700 rounded-lg">
              <Clock size={18} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <span className="text-4xl font-bold text-emerald-800">{activeCount.toString().padStart(2, '0')}</span>
            <p className="text-emerald-600 text-sm mt-1">Currently being tracked</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Recent Tracking</h3>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Feed Update: Live</span>
      </div>

      {complaints.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
            <LayoutGrid className="text-slate-300" size={32} />
          </div>
          <p className="text-slate-500 font-medium text-lg">No complaints raised yet.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {complaints.map((c) => (
              <motion.div
                layout
                key={c.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-2">
                      <StatusBadge status={c.status} />
                      {c.isAnonymous && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-1">
                          <AlertCircle size={10} />
                          Anonymous
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      {c.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{c.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">{c.description}</p>
                </div>
                
                {c.authorityComment && (
                  <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3 items-start">
                    <MessageSquare size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter mb-1">Official Response</p>
                      <p className="text-xs text-slate-700 italic">"{c.authorityComment}"</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {c.createdAt?.toDate ? new Intl.DateTimeFormat('en-GB').format(c.createdAt.toDate()) : 'Recently'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <RaiseComplaintModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
