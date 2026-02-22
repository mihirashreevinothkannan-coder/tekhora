import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Target, Activity, Edit2 } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { useUserStore } from '../store/useUserStore';

export default function ProfileModal({ isOpen, onClose }) {
  const { user } = useUserStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md z-10"
        >
          <GlassCard className="p-6 overflow-hidden relative border-2 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center mt-4">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 p-1">
                  {user?.photoUrl ? (
                    <img 
                       src={user.photoUrl} 
                       alt="Profile" 
                       className="w-full h-full rounded-full object-cover border-4 border-slate-900"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-900">
                      <span className="text-4xl font-bold text-emerald-400 group-hover:scale-110 transition-transform">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 size={24} className="text-white drop-shadow-md" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mt-4">{user?.name || "Guest User"}</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-400/20">
                   Level {user?.level || 1}
                 </span>
                 <span className="text-slate-400 text-sm font-medium">Joined Feb 2026</span>
              </div>
            </div>

            {/* Details Section */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Personal Details</h3>
              
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <User className="text-blue-400 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium">Basic Info</p>
                  <p className="text-sm font-bold text-white mt-0.5">24 y/o • Male</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                <div className="bg-orange-500/20 p-3 rounded-xl">
                  <Target className="text-orange-400 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium">Primary Goal</p>
                  <p className="text-sm font-bold text-white mt-0.5">{user?.goal || "Maintain"}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <Activity className="text-purple-400 w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium">Body Metrics</p>
                  <div className="flex gap-4 mt-0.5">
                    <p className="text-sm font-bold text-white">180 cm</p>
                    <p className="text-sm font-bold text-white">72 kg</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10 btn-pop">
              Edit Profile
            </button>
            <button className="w-full mt-3 py-3 text-red-400 hover:text-red-300 font-bold rounded-xl transition-colors text-sm">
              Sign Out
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
