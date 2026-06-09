import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorParam = searchParams.get('error');

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (errorParam === 'auth_failed') {
      toast.error('Google Authentication failed. Please try again.');
    } else if (errorParam === 'unauthorized') {
      toast.error('Access Denied: Your Google account is not authorized for this panel.');
    }
  }, [errorParam]);

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-gradient-premium p-3 rounded-2xl text-white shadow-xl shadow-orange-500/25 mb-4">
            <UtensilsCrossed size={32} />
          </div>
          <h1 className="font-extrabold text-3xl text-white tracking-tight">BiteQR Portal</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Restaurant Administration Panel</p>
        </div>

        {/* Login Card */}
        <div className="glassmorphism p-8 rounded-3xl border border-slate-900 bg-slate-900/40 shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-lg font-bold text-white mb-1">Secure Admin Access</h2>
            <p className="text-xs text-slate-400">Authenticate with your authorized Google account to manage your restaurant.</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-slate-900 hover:bg-slate-50 font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-3.5 flex gap-2.5 items-center">
            <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
            <span className="text-[10px] text-emerald-400/90 font-bold tracking-wide leading-relaxed uppercase">
              Secured — Only authorized admin email can access this panel
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Not an admin?{' '}
          <a href="/" className="text-orange-400 hover:text-orange-300 font-bold transition-all">
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
