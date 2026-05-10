import { AuthProvider, useAuth } from './hooks/useAuth';
import { Navbar, Landing } from './components/Navigation';
import { StudentDashboard } from './components/StudentDashboard';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [isAdminToggling, setIsAdminToggling] = useState(false);

  // Helper to let the user switch roles for DEMO purposes
  // In a real app, this would be restricted
  const toggleRole = async () => {
    if (!profile) return;
    setIsAdminToggling(true);
    try {
      const newRole = profile.role === 'student' ? 'authority' : 'student';
      await updateDoc(doc(db, 'users', profile.uid), { role: newRole });
      window.location.reload(); // Refresh to catch context change
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdminToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500 font-medium">Synchronizing with CampusVoice...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Landing />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pb-20">
        {profile?.role === 'authority' ? (
          <AuthorityDashboard />
        ) : (
          <StudentDashboard />
        )}
      </main>

      {/* Demo Role Switcher */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={toggleRole}
          disabled={isAdminToggling}
          className="flex items-center gap-2 bg-white/80 backdrop-blur border border-gray-200 px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
        >
          <ShieldAlert size={14} />
          {isAdminToggling ? 'Syncing...' : `Switch to ${profile?.role === 'student' ? 'Authority' : 'Student'} View`}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}
