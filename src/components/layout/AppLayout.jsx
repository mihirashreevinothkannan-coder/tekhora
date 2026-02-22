import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, PlusCircle, BarChart3 } from 'lucide-react';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/log', icon: PlusCircle, label: 'Add Food' },
    { path: '/analytics', icon: BarChart3, label: 'Stats' },
  ];

  return (
    <div className="min-h-screen pb-20 relative">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto max-w-md p-4 pt-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel h-16 flex items-center justify-around px-6 pb-safe">
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
