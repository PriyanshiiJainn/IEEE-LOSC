"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  /** Extra guidance appended after the standard formatting hint. */
  hint?: string;
};

/**
 * Textarea for admin-authored markdown, paired with a live preview that uses
 * the exact same renderer as the public site — so what is typed here is what
 * visitors see. The box grows with its content instead of scrolling inside a
 * fixed height.
 */
export function MarkdownField({
  label,
  value,
  onChange,
  required = false,
  rows = 6,
  placeholder,
  hint,
}: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  // Grow to fit the text; `rows` acts as the minimum height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, showPreview]);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="text-xs font-medium text-ieee-red hover:underline"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {showPreview ? (
        <div className="min-h-[6rem] w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800">
          {value.trim() ? (
            <MarkdownContent>{value}</MarkdownContent>
          ) : (
            <p className="text-gray-400">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className="block w-full resize-y overflow-hidden rounded border border-gray-300 px-3 py-2 text-sm leading-relaxed"
        />
      )}

      <p className="mt-1 text-xs text-gray-400">
        Shown on the site exactly as typed here — every line break, space and symbol is kept, and
        nothing is added that you did not type. Optional formatting: <code>**bold**</code>,{" "}
        <code>*italic*</code>, <code>- </code> for bullets, <code>1. </code> for numbers,{" "}
        <code>## </code> for a heading, <code>[text](https://link)</code>.
        {hint ? ` ${hint}` : ""}
      </p>
    </div>
  );
}
