import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, User, Mail, Lock, CheckCircle2, ShieldCheck, Save } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your new password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const ok = await updateProfile({
        fullName,
        email,
        password: newPassword || undefined
      });

      if (ok) {
        setSuccessMessage('Profile updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 1500);
      } else {
        setErrorMessage('Failed to update profile. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden font-sans">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md">
              {fullName ? fullName.slice(0, 2).toUpperCase() : 'NA'}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-neutral-100 leading-tight">
                Account Settings
              </h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                Manage your name, email & security
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Badges */}
        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {/* Profile Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name / Username */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-500" />
              <span>Full Name / Username</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
            />
          </div>

          {/* Security Divider */}
          <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Change Password (Optional)</span>
            </p>
          </div>

          {/* New Password */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>New Password</span>
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
            />
          </div>

          {/* Confirm Password */}
          {newPassword && (
            <div className="space-y-1 text-left animate-in fade-in duration-150">
              <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
              />
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
