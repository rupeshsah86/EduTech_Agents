import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userActivityService, type UserActivity } from '../../services/userActivity';
import { 
  X, 
  User, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  Flame, 
  Calendar, 
  Search, 
  BookOpen, 
  Trash2, 
  Sparkles, 
  Clock, 
  Award,
  Sliders,
  History
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');

  const [activity, setActivity] = useState<UserActivity>(userActivityService.getActivity());

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [academicGoal, setAcademicGoal] = useState('');
  const [targetSubject, setTargetSubject] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreset, setAvatarPreset] = useState('purple');

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
    const currentActivity = userActivityService.getActivity();
    setActivity(currentActivity);
    setAcademicGoal(currentActivity.academicGoal || 'Computer Science & Engineering');
    setTargetSubject(currentActivity.targetSubject || 'DSA, Operating Systems & System Design');
    setBio(currentActivity.bio || 'Socratic learner mastering CS algorithms, AI agents & system design.');
    setAvatarPreset(currentActivity.avatarPreset || 'purple');

    const handleUpdate = (e: any) => {
      if (e.detail) setActivity(e.detail);
    };
    window.addEventListener('user-activity-updated', handleUpdate);
    return () => window.removeEventListener('user-activity-updated', handleUpdate);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
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
        password: newPassword || undefined,
      });

      userActivityService.updateProfileData({
        academicGoal,
        targetSubject,
        bio,
        avatarPreset,
      });

      if (ok) {
        setSuccessMessage('Profile and learning preferences updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrorMessage('Failed to update profile. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred while saving profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your study and search history?')) {
      userActivityService.clearHistory();
      setActivity(userActivityService.getActivity());
    }
  };

  const colorBgMap: Record<string, string> = {
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600',
    indigo: 'bg-indigo-600',
    rose: 'bg-rose-600',
    amber: 'bg-amber-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden font-sans max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl ${colorBgMap[avatarPreset] || 'bg-purple-600'} text-white font-black text-base flex items-center justify-center shadow-lg shadow-purple-600/20`}>
              {fullName ? fullName.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-neutral-100 leading-tight">
                  {fullName || 'Student Profile'}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-extrabold text-[10px] uppercase border border-purple-200 dark:border-purple-800">
                  CS Learner
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium mt-0.5">
                {email || 'student@eduverse.ai'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Active Streak & Study Stats Header Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left space-y-1">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Active Streak</span>
              <Flame className="w-4 h-4 animate-bounce" />
            </div>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {activity.activeStreak} {activity.activeStreak === 1 ? 'Day' : 'Days'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-left space-y-1">
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Active Days</span>
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {activity.totalActiveDays} {activity.totalActiveDays === 1 ? 'Day' : 'Days'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left space-y-1">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Topics Studied</span>
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {activity.history.length} Topics
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-left space-y-1">
            <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Level Status</span>
              <Award className="w-4 h-4" />
            </div>
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              Level 4
            </p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-100 dark:border-neutral-800 gap-6 text-xs font-extrabold shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'profile'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Edit Profile & Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'history'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Searched & Studied History ({activity.history.length})</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold shrink-0">
            {errorMessage}
          </div>
        )}

        {/* Tab 1: Edit Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 overflow-y-auto pr-1 flex-1 text-left">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-500" />
                  <span>Full Name / Username</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Academic Goal & Target Focus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Academic Level / Target Goal</span>
                </label>
                <input
                  type="text"
                  value={academicGoal}
                  onChange={(e) => setAcademicGoal(e.target.value)}
                  placeholder="e.g. Computer Science B.Tech / GATE Prep"
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Target Subject Focus</span>
                </label>
                <input
                  type="text"
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  placeholder="e.g. DSA, Operating Systems, DBMS"
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Avatar Theme Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                Avatar Theme Color
              </label>
              <div className="flex items-center gap-3">
                {[
                  { id: 'purple', name: 'Purple', bg: 'bg-purple-600' },
                  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-600' },
                  { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-600' },
                  { id: 'rose', name: 'Rose', bg: 'bg-rose-600' },
                  { id: 'amber', name: 'Amber', bg: 'bg-amber-600' },
                ].map((color) => (
                  <button
                    type="button"
                    key={color.id}
                    onClick={() => setAvatarPreset(color.id)}
                    className={`w-7 h-7 rounded-xl ${color.bg} transition-all cursor-pointer ${
                      avatarPreset === color.id ? 'ring-4 ring-purple-500/30 scale-110 shadow-md' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Personal Learning Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                Personal Learning Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your learning focus or goals..."
                rows={2}
                className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium resize-none"
              />
            </div>

            {/* Security Section (Change Password) */}
            <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 space-y-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Security & Password (Optional)</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (leave blank to keep)"
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile & Preferences'}</span>
              </button>
            </div>

          </form>
        )}

        {/* Tab 2: Searched & Studied History */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Searched & Studied Topics Log
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                  Every concept, code problem, and sign gesture query you search is logged here.
                </p>
              </div>

              {activity.history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[11px] font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Log</span>
                </button>
              )}
            </div>

            {activity.history.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 text-center space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-400 animate-pulse" />
                <p className="text-xs font-bold text-slate-700 dark:text-neutral-300">No Search History Yet</p>
                <p className="text-[11px] text-slate-400">Ask any question to Master AI or Sign AI to build your study history!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activity.history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 shadow-2xs hover:border-purple-300 dark:hover:border-purple-800 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-[10px] font-extrabold">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.dateStr} • {item.timestamp}</span>
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-900 dark:text-neutral-100 truncate">
                        {item.query}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new CustomEvent('send-master-ai-prompt', { detail: item.query }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-sm"
                      title="Re-run search query with Master AI"
                    >
                      Re-study
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
