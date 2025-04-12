"use client";

import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export default function UsersTable({ users }) {
  if (!users || users.length === 0) {
    return <div className="text-center py-4 text-gray-500">No users found</div>;
  }

  // Define which fields to show and in what order
  const displayKeys = ["name", "email", "subscription", "badge", "image"];

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <tr>
            {displayKeys.map((key) => (
              <th key={key} className="px-4 py-2 capitalize whitespace-nowrap">
                {key === "badge" ? "Badges" : key.replace(/([A-Z])/g, " $1").trim()}
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
                      src={user[key]}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                      width={20}
                      height={20}
                    />
                  ) : key === "badge" ? (
                    <div className="flex flex-wrap gap-1">
                      {user[key]?.map((b, i) => (
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
                <DropdownActions />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DropdownActions() {
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
            <div className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 cursor-pointer">View details</div>
            <div className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 cursor-pointer">Edit user</div>
            <div className="hover:bg-red-100 dark:hover:bg-red-900 text-red-600 px-2 py-1 cursor-pointer">Delete</div>
          </div>
        </div>
      )}
    </div>
  );
}
