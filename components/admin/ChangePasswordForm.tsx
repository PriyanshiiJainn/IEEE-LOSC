"use client";

import { useState } from "react";

type Field = "currentPassword" | "newPassword" | "confirmPassword";

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: Field;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          className="w-full rounded border border-gray-300 px-3 py-2 pr-10 text-gray-900 focus:border-ieee-red focus:outline-none focus:ring-1 focus:ring-ieee-red"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-ieee-red/30"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to update password.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <PasswordField
        id="currentPassword"
        label="Current password"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
      />
      <PasswordField
        id="newPassword"
        label="New password"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="new-password"
      />
      <p className="text-xs text-gray-500 -mt-2">At least 8 characters.</p>
      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">
          Password updated. Use your new password the next time you sign in.
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-ieee-red px-4 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
