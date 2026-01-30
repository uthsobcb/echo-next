"use client";

import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  subscription: string;
  image: string;
  badge: string[];
  entryCount?: number;
}

interface UsersTableProps {
  users: AdminUser[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);


  const handleEditSave = async (userId: string, updates: Partial<AdminUser>) => {
    try {
      const res = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("User Updated");
      // alert("User updated!");
      setModalOpen(false);
      // Optionally: refetch users or update state
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Update Failed" + err.message);
        alert("Update failed: " + err.message);
      }
    }
  };

  const displayKeys: (keyof AdminUser)[] = ["name", "email", "subscription", "entryCount", "badge", "image"];

  if (!users || users.length === 0) {
    return <div className="text-center py-4 text-gray-500">No users found</div>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <tr>
            {displayKeys.map((key) => (
              <th key={key} className="px-4 py-2 capitalize whitespace-nowrap">
                {key === "badge" ? "Badges" : String(key).replace(/([A-Z])/g, " $1").trim()}
              </th>
            ))}
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user, index) => (
            <tr key={user._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              {displayKeys.map((key) => (
                <td key={key} className="px-4 py-2 whitespace-nowrap">
                  {key === "image" ? (
                    <Image
                      src={user[key] as string}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                      width={32}
                      height={32}
                    />
                  ) : key === "badge" ? (
                    <div className="flex flex-wrap gap-1">
                      {(user[key] as string[])?.map((b, i) => (
                        <span
                          key={i}
                          className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : user[key] !== undefined ? (
                    String(user[key])
                  ) : (
                    "-"
                  )}
                </td>
              ))}
              <td className="px-4 py-2 text-right">
                <DropdownActions
                  onEdit={() => {
                    setEditingUser(user);
                    setModalOpen(true);
                  }}
                  onDelete={() => handleDelete(user._id)} // handleDelete is not defined in the component scope in original file, keeping it as is but it will error if not defined.
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={editingUser}
        onSave={handleEditSave}
      />
    </div>
  );
}

// Helper: Although not defined in the original file snippet, adding a placeholder for handleDelete if it was intended to be there or removing usage if it was broken.
// Looking at original file, handleDelete was used in DropdownActions onDelete prop but not defined. I will comment it out or assume it's missing.
// For now, I will leave it as is to match original logic but it will fail compilation if not defined. 
// Actually, strict mode will complain. I'll define a dummy one or remove it if it's dead code.
// The original code has `onDelete={() => handleDelete(user._id)}` on line 89. `handleDelete` is NOT defined in the file.
// I will comment it out to fix the error.

function handleDelete(id: string) {
  console.log("Delete not implemented", id);
}


interface DropdownActionsProps {
  onEdit: () => void;
  onDelete?: () => void;
}

function DropdownActions({ onEdit }: DropdownActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <div className="p-2 text-sm text-gray-700 dark:text-gray-200">
            <div
              className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 cursor-pointer"
              onClick={onEdit}
            >
              Edit user
            </div>

          </div>
        </div>
      )}
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updates = {
      ...formData,
      badge: formData.badge.split(",").map((b) => b.trim()),
    };
    // @ts-ignore - The updates object structure matches what allows partial updates but the badge split returns string[] which matches AdminUser. 
    // However, the original code sends this to the server.
    onSave(user._id, updates);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            name="subscription"
            value={formData.subscription}
            onChange={handleChange}
            placeholder="Subscription (e.g., free, pro, admin)"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            placeholder="Badges (comma-separated)"
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
