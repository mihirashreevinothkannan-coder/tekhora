import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, PlusCircle, BarChart3, Activity } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { Flame } from 'lucide-react';
import ProfileModal from '../ProfileModal';

const AppLayout = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/log', icon: PlusCircle, label: 'Add Food' },
    { path: '/analytics', icon: BarChart3, label: 'Stats' },
  ];

  const user = useUserStore((state) => state.user);

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative flex flex-col">
      {/* Desktop Top Header Navigation */}
      <header className="hidden md:flex w-full sticky top-0 z-50 glass-panel border-b border-white/10 px-8 py-4 items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
            <div className="bg-green-500/20 p-2 rounded-xl border border-green-500/30">
                <Activity className="w-5 h-5 text-green-400" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-2">
                Tekhora <span className="text-sm font-semibold text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-md">Pro</span>
            </span>
        </div>

        <nav className="flex items-center gap-6">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button
                        key={`desktop-${item.path}`}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold text-sm ${
                            isActive ? 'bg-white/10 text-green-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <item.icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
                        {item.label}
                    </button>
                );
            })}
        </nav>
        
        <div className="flex items-center gap-3 pr-2">
            <div className="text-right hidden lg:block">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">{user?.goal || 'Warrior'}</p>
                <p className="text-sm font-bold text-white leading-tight">{user?.name || 'Guest'}</p>
            </div>
            
            <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20 mr-2">
                <Flame className="w-4 h-4 text-orange-400 fill-current" />
                <span className="font-bold text-orange-400">{user?.streak || 0}</span>
            </div>

            <div 
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center font-bold text-white shadow-lg border-2 border-slate-900 ring-2 ring-white/10 cursor-pointer hover:scale-105 transition-transform"
            >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
        </div>
      </header>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[1600px] mx-auto p-4 md:p-8 pt-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel h-16 flex items-center justify-around px-6 pb-safe border-t border-white/10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-green-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <item.icon className="h-6 w-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 w-8 h-1 bg-green-400 rounded-t-full shadow-[0_0_10px_#4ade80]"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppLayout;
