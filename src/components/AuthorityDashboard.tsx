import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Complaint, ComplaintService } from '../services/complaintService';
import { Search, Filter, CheckCircle, Clock, MoreHorizontal, MessageSquare, AlertCircle, LayoutGrid } from 'lucide-react';

export function AuthorityDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const unsubscribe = ComplaintService.subscribeToAllComplaints(setComplaints);
    return () => unsubscribe();
  }, []);

  const filtered = complaints.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                         c.studentName.toLowerCase().includes(search.toLowerCase()) ||
                         c.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = async (id: string, status: Complaint['status']) => {
    await ComplaintService.updateComplaintStatus(id, status, comment);
    setUpdatingId(null);
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Authority Console</h1>
        <p className="text-slate-500 mt-1 uppercase text-[10px] font-black tracking-widest">Official Resolution Feed • Live Updates</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by student, title, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-indigo-600 outline-none transition-all shadow-sm font-medium"
          />
        </div>
        <div className="flex gap-2 p-1 bg-slate-200/50 rounded-[2.2rem]">
          {['all', 'pending', 'in-progress', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-5 py-3 rounded-[2rem] text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((c) => (
            <motion.div
              layout
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`bg-white rounded-[2.5rem] border ${updatingId === c.id ? 'border-indigo-500 ring-8 ring-indigo-50' : 'border-slate-100'} shadow-sm overflow-hidden transition-all`}
            >
              <div className="p-8">
                <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl shadow-inner uppercase overflow-hidden">
                      {c.isAnonymous ? (
                        <div className="bg-slate-800 w-full h-full flex items-center justify-center text-white">
                          <AlertCircle size={20} />
                        </div>
                      ) : (
                        c.studentName?.charAt(0) || 'S'
                      )}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-800 leading-none mb-1">
                        {c.isAnonymous ? 'Anonymous Student' : c.studentName}
                      </p>
                      <p className="text-xs font-bold text-slate-400 tracking-tight">
                        {c.isAnonymous ? 'Identity Hidden' : c.studentEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                      {c.category}
                    </span>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border uppercase ${
                      c.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      c.status === 'in-progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {c.status}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{c.title}</h3>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8">
                  <p className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {c.description}
                  </p>
                </div>

                {c.authorityComment && updatingId !== c.id && (
                  <div className="mb-8 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex gap-4">
                    <div className="w-1.5 h-12 bg-indigo-500 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Official Response</p>
                      <p className="text-sm text-slate-800 font-bold italic tracking-tight leading-snug">"{c.authorityComment}"</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-8 pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    REPORTED: {c.createdAt?.toDate ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(c.createdAt.toDate()) : 'Recently'}
                  </span>
                  
                  {updatingId === c.id ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full space-y-6 pt-2"
                    >
                      <textarea
                        autoFocus
                        placeholder="Add an official response or internal note..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-6 py-4 border border-indigo-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-50 outline-none text-sm min-h-[120px] font-medium"
                      />
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleUpdateStatus(c.id, 'in-progress')}
                          className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                          Mark: In Progress
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(c.id, 'resolved')}
                          className="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                          Mark: Resolved
                        </button>
                        <button 
                          onClick={() => setUpdatingId(null)}
                          className="px-6 py-4 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => {
                        setUpdatingId(c.id);
                        setComment(c.authorityComment || '');
                      }}
                      className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 font-black text-[10px] uppercase tracking-[0.2em] group transition-all"
                    >
                      Process Complaint
                      <div className="p-2 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg transition-colors">
                        <AlertCircle size={16} />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <LayoutGrid className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No reports found in this view</p>
          </div>
        )}
      </div>
    </div>
  );
}
