import type { TrustBadge } from "@/lib/settings";

// Rozetin emoji/başlık/alt yazısına göre uygun profesyonel SVG ikonu seçer.
// Böylece panelden emoji girilse bile premium çizgi ikon gösterilir.
type IconKey =
  | "shipping"
  | "payment"
  | "invoice"
  | "certified"
  | "support"
  | "returns"
  | "default";

function resolveKey(badge: TrustBadge): IconKey {
  const t = `${badge.icon} ${badge.title} ${badge.subtitle}`.toLocaleLowerCase(
    "tr",
  );
  const has = (...ws: string[]) => ws.some((w) => t.includes(w));
  if (has("🚚", "🚛", "📦", "kargo", "teslim", "gönder", "sevk", "hızlı"))
    return "shipping";
  if (has("💳", "🔒", "🛡", "ödeme", "öde", "kart", "havale", "güven", "secure"))
    return "payment";
  if (has("📋", "📄", "🧾", "fatura", "belge", "sözleşme", "kurumsal"))
    return "invoice";
  if (
    has("✅", "✔", "🏅", "🎖", "🥇", "orijinal", "sertifika", "kalite", "garanti", "onay")
  )
    return "certified";
  if (has("📞", "☎", "🎧", "💬", "destek", "iletişim", "çağrı", "7/24"))
    return "support";
  if (has("🔄", "↩", "♻", "iade", "değişim", "geri")) return "returns";
  return "default";
}

const PATHS: Record<IconKey, React.ReactNode> = {
  shipping: (
    <>
      <rect x="1.75" y="7" width="11.5" height="8" rx="1.2" />
      <path d="M13.25 9h4.3l3.2 3.4V15h-7.5z" />
      <circle cx="6" cy="17" r="1.6" />
      <circle cx="16.5" cy="17" r="1.6" />
    </>
  ),
  payment: (
    <>
      <path d="M12 2.6 19 5.6V11c0 4.2-3 7.2-7 8.5C8 18.2 5 15.2 5 11V5.6z" />
      <path d="m9 11.2 2.2 2.2L15.2 9" />
    </>
  ),
  invoice: (
    <>
      <path d="M6.5 2.6H13l4.5 4.5V21H6.5z" />
      <path d="M13 2.6V7.1h4.5" />
      <path d="M9 12h6M9 15.4h6M9 9h3" />
    </>
  ),
  certified: (
    <>
      <circle cx="12" cy="9" r="5.4" />
      <path d="M9.5 9.1 11.3 10.9 14.6 7.4" />
      <path d="M8.8 13.4 7.1 20.8 12 18.2 16.9 20.8 15.2 13.4" />
    </>
  ),
  support: (
    <>
      <path d="M4 5.6A1.5 1.5 0 0 1 5.5 4.1h13A1.5 1.5 0 0 1 20 5.6v8.8a1.5 1.5 0 0 1-1.5 1.5H9l-4 3.4v-3.4H5.5A1.5 1.5 0 0 1 4 14.4z" />
      <path d="M8.5 10h.01M12 10h.01M15.5 10h.01" />
    </>
  ),
  returns: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M17.6 2.8 17.7 6.5 14 6.6" />
    </>
  ),
  default: (
    <path d="M12 3.5 14.1 8.2 19.2 8.7 15.3 12.2 16.5 17.3 12 14.6 7.5 17.3 8.7 12.2 4.8 8.7 9.9 8.2Z" />
  ),
};

export function TrustIcon({
  badge,
  className = "w-6 h-6",
}: {
  badge: TrustBadge;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[resolveKey(badge)]}
    </svg>
  );
}
