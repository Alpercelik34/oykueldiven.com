"use client";

import { useState } from "react";

type FieldDef = { key: string; label: string; placeholder?: string };

// Bir nesne dizisini (ör. rozetler, istatistikler) düzenleyen,
// satır ekleyip/çıkarabilen genel editör. Veriyi gizli bir input'a
// JSON olarak yazar; form gönderilince action bunu okur.
export function ListEditor({
  name,
  fields,
  initial,
  addLabel = "+ Yeni ekle",
}: {
  name: string;
  fields: FieldDef[];
  initial: Record<string, string>[];
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Record<string, string>[]>(
    initial.length ? initial : [],
  );

  function update(i: number, key: string, value: string) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)),
    );
  }
  function addRow() {
    const empty: Record<string, string> = {};
    fields.forEach((f) => (empty[f.key] = ""));
    setRows((prev) => [...prev, empty]);
  }
  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex flex-wrap items-end gap-2 rounded-lg border border-ink-200 p-2"
          >
            {fields.map((f) => (
              <label key={f.key} className="flex-1 min-w-32">
                <span className="block text-xs text-ink-500 mb-1">
                  {f.label}
                </span>
                <input
                  value={row[f.key] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  className="w-full rounded-lg border border-ink-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="mt-2 rounded-lg border border-ink-300 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-100"
      >
        {addLabel}
      </button>
    </div>
  );
}
