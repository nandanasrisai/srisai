import { useAuth } from '../hooks/useAuth';
import { LogOut, User, ShieldCheck, School } from 'lucide-react';
import { motion } from 'motion/react';

export function Navbar() {
  const { user, profile, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <School className="text-white" size={26} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-slate-900 tracking-tight leading-none">CampusVoice</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">University of Excellence</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2 hidden md:flex">
              <span className="text-sm font-bold text-slate-800">{profile?.displayName || user.displayName}</span>
              <div className="flex items-center gap-1.5">
                {profile?.role === 'authority' ? (
                  <ShieldCheck size={12} className="text-indigo-600" />
                ) : (
                  <User size={12} className="text-slate-400" />
                )}
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  {profile?.role || 'Student'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            <div className="w-11 h-11 rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={20} className="text-slate-400" />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Landing() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-5xl text-center z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-indigo-600 border border-indigo-100 text-sm font-bold mb-10 shadow-sm"
        >
          <School size={16} />
          Empowering the Student Voice
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[1] mb-8"
        >
          Campus issues, <br />
          <span className="text-indigo-600 italic">resolved.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium"
        >
          The official platform to report hostels, academics, and facilities issues. 
          Get direct responses from authorities in real-time.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button 
            onClick={signIn}
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 bg-white rounded-full p-0.5" />
            Continue with Student Gmail
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            { label: 'Verified Access', desc: 'Secure institutional login', color: 'bg-orange-50 border-orange-100 text-orange-600' },
            { label: 'Bento Tracking', desc: 'Visual status updates', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
            { label: 'Zero Friction', desc: 'Report issues in seconds', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' }
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] border bg-white shadow-sm transition-transform hover:-translate-y-1`}>
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-4 font-bold mx-auto`}>
                {i + 1}
              </div>
              <h3 className="font-black text-slate-800 mb-2">{item.label}</h3>
              <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
