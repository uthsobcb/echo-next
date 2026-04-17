"use client";

import { MoreHorizontal, Edit2, Trash2, Send, Search } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  subscription: string;
  image: string;
  badge: string[];
  entryCount?: number;
  deleteRequested?: boolean;
}

interface UsersTableProps {
  users: AdminUser[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditSave = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      const res = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("User Profile Updated");
      setModalOpen(false);
    } catch (err: any) {
      toast.error("Update failed: " + err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;
    
    try {
      const res = await fetch("/api/admin/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      toast.success("User deleted successfully.");
      window.location.reload();
    } catch (err: any) {
      toast.error("Failed to delete user: " + err.message);
    }
  };

  const getSubColor = (sub: string) => {
    switch (sub?.toLowerCase()) {
      case 'plus': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'admin': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">User</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Subscription</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Entries</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Badges</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user._id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm"
                        width={40}
                        height={40}
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {user.name}
                        {user.deleteRequested && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-800">
                            Delete Req
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold uppercase tracking-tight ${getSubColor(user.subscription)}`}>
                    {user.subscription}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min((user.entryCount || 0) * 10, 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{user.entryCount || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {(user.badge as string[])?.slice(0, 2).map((b, i) => (
                      <span
                        key={i}
                        className="inline-block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-medium"
                      >
                        {b}
                      </span>
                    ))}
                    {user.badge?.length > 2 && (
                      <span className="text-[10px] text-slate-400 font-medium">+{user.badge.length - 2} more</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownActions
                    onEdit={() => {
                      setEditingUser(user);
                      setModalOpen(true);
                    }}
                    onSendNotification={() => {
                      const panel = document.getElementById('notifications-panel');
                      if (panel) {
                        panel.scrollIntoView({ behavior: 'smooth' });
                      }
                      navigator.clipboard.writeText(user._id);
                      toast.info("User ID copied for Targeted Notification");
                    }}
                    onDelete={() => handleDeleteUser(user._id)}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={editingUser}
        onSave={handleEditSave}
      />
    </div>
  );
}

interface DropdownActionsProps {
  onEdit: () => void;
  onSendNotification?: () => void;
  onDelete?: () => void;
}

function DropdownActions({ onEdit, onSendNotification, onDelete }: DropdownActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 z-20 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1.5 focus:outline-none"
            >
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                onClick={() => { onEdit(); setOpen(false); }}
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
              {onSendNotification && (
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                  onClick={() => { onSendNotification(); setOpen(false); }}
                >
                  <Send size={14} />
                  Message User
                </button>
              )}
              <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-colors"
                onClick={() => { if(onDelete) onDelete(); setOpen(false); }}
              >
                <Trash2 size={14} />
                Delete User
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSave: (id: string, updates: Partial<AdminUser>) => void;
}

function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subscription: "",
    badge: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        subscription: user.subscription || "",
        badge: user.badge?.join(", ") || "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updates = {
      ...formData,
      badge: formData.badge.split(",").map((b) => b.trim()).filter(b => b),
    };
    onSave(user._id, updates);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Modify Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Plan</label>
              <select
                value={formData.subscription}
                onChange={(e) => setFormData({ ...formData, subscription: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
              >
                <option value="free">Free</option>
                <option value="plus">Plus</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Badges (comma separated)</label>
            <input
              name="badge"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="Badges..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 flex-1 text-sm font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 flex-1 text-sm font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all border border-blue-500/50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function X({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  )
}
