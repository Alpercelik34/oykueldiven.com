"use client";

import { useRef, useState } from "react";

// Görsel alanı: bilgisayardan yükleme + manuel URL girişi + önizleme.
// Seçilen/yüklenen URL, name'li metin alanında tutulur (form ile gönderilir).
export function ImageUpload({
  name,
  label,
  initialUrl = "",
}: {
  name: string;
  label: string;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) setUrl(data.url);
      else setError(data.error || "Yükleme başarısız.");
    } catch {
      setError("Yükleme sırasında hata oluştu.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </label>
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 shrink-0 rounded-lg border border-ink-200 bg-ink-50 overflow-hidden grid place-items-center">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-ink-400">yok</span>
          )}
        </div>
        <div className="flex-1">
          <input
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Görsel adresi (URL) veya aşağıdan yükleyin"
            className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="rounded-lg border border-ink-300 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-100 disabled:opacity-60"
            >
              {busy ? "Yükleniyor..." : "📁 Bilgisayardan yükle"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-sm text-red-600 hover:underline"
              >
                Kaldır
              </button>
            )}
          </div>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
