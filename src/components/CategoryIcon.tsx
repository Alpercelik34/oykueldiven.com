// Kategorinin slug/adına göre uygun profesyonel SVG ikonu seçer.
type IconKey =
  | "glove"
  | "mask"
  | "disinfectant"
  | "supplies"
  | "protection"
  | "default";

function resolveKey(text: string): IconKey {
  const t = text.toLocaleLowerCase("tr");
  const has = (...ws: string[]) => ws.some((w) => t.includes(w));
  if (has("eldiven", "glove")) return "glove";
  if (has("maske", "yüz", "yuz", "mask")) return "mask";
  if (has("dezenfekt", "hijyen", "antisept", "temizlik")) return "disinfectant";
  if (has("sarf", "tıbbi", "tibbi", "enjektör", "enjektor", "gazlı", "pansuman"))
    return "supplies";
  if (has("koruyucu", "ekipman", "önlük", "onluk", "bone", "galoş", "tulum"))
    return "protection";
  return "default";
}

const PATHS: Record<IconKey, React.ReactNode> = {
  // Eldiven (el)
  glove: (
    <path d="M7 13.5V6.2a1.25 1.25 0 0 1 2.5 0v5.3M9.5 11.5V4.6a1.25 1.25 0 0 1 2.5 0v6.4M12 11V5.2a1.25 1.25 0 0 1 2.5 0v6M14.5 11.2V7.6a1.25 1.25 0 0 1 2.5 0V15a6 6 0 0 1-6 6H9.8a6 6 0 0 1-4.24-1.76L3.6 17.3a1.3 1.3 0 0 1 1.84-1.84l1.56 1.56" />
  ),
  // Maske
  mask: (
    <>
      <path d="M4 9.2c0-1 .9-1.7 1.85-1.45l4.95 1.05c.78.16 1.62.16 2.4 0l4.95-1.05C19.1 7.5 20 8.2 20 9.2v2.6c0 3.3-2.7 6-6 6h-4c-3.3 0-6-2.7-6-6z" />
      <path d="M5.5 11h13M6 13.4h12" />
      <path d="M4 8.4 1.6 6.8M20 8.4l2.4-1.6" />
    </>
  ),
  // Dezenfektan / sprey şişe
  disinfectant: (
    <>
      <rect x="7" y="9" width="8" height="11.5" rx="1.5" />
      <path d="M9.5 9V6.5h3V9" />
      <path d="M9.5 6V4.5h4.5M14 4.5l2.5-1.4" />
      <path d="M9.5 13.5h3" />
    </>
  ),
  // Tıbbi sarf / ilk yardım kutusu
  supplies: (
    <>
      <rect x="3.5" y="7" width="17" height="12.5" rx="2" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M12 10.5v5.5M9.25 13.25h5.5" />
    </>
  ),
  // Koruyucu ekipman / kalkan
  protection: (
    <path d="M12 2.6 19 5.6V11c0 4.2-3 7.2-7 8.5C8 18.2 5 15.2 5 11V5.6z" />
  ),
  // Varsayılan / sağlık artısı
  default: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
};

export function CategoryIcon({
  slug,
  name,
  className = "w-6 h-6",
}: {
  slug: string;
  name: string;
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
      {PATHS[resolveKey(`${slug} ${name}`)]}
    </svg>
  );
}
