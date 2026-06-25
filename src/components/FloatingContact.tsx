// Sağ altta sabit duran iletişim butonları: üstte "Bizi arayın" (telefon),
// altta WhatsApp. Numara boşsa ilgili buton gösterilmez.
export function FloatingContact({
  phone,
  whatsapp,
}: {
  phone: string;
  whatsapp: string;
}) {
  const tel = phone.replace(/[^0-9+]/g, "");
  const wa = whatsapp.replace(/[^0-9]/g, "");

  if (!tel && !wa) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {tel && (
        <a
          href={`tel:${tel}`}
          aria-label="Hemen Ara"
          className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-current"
            aria-hidden="true"
          >
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <span className="hidden text-sm font-semibold sm:inline">
            Hemen Ara
          </span>
        </a>
      )}

      {wa && (
        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Teklif Al"
          className="relative flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
          <svg
            viewBox="0 0 32 32"
            className="relative h-7 w-7 fill-current"
            aria-hidden="true"
          >
            <path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16c0 3.5 1.124 6.74 3.034 9.374L1.05 31.2l6.02-1.926A15.9 15.9 0 0 0 16.004 32C24.83 32 32 24.826 32 16S24.83 0 16.004 0zm9.32 22.594c-.388 1.094-1.926 2.002-3.152 2.266-.838.178-1.932.32-5.616-1.206-4.71-1.952-7.744-6.738-7.98-7.05-.226-.312-1.906-2.538-1.906-4.842s1.17-3.436 1.586-3.906c.388-.43.846-.626 1.302-.626.158 0 .3.008.43.014.412.018.62.042.892.694.338.814 1.16 2.84 1.262 3.046.104.206.174.448.034.76-.13.32-.244.46-.45.708-.206.248-.402.438-.608.704-.188.232-.4.482-.164.884.236.394 1.05 1.73 2.252 2.8 1.552 1.382 2.842 1.81 3.286 1.996.33.14.722.106.99-.18.34-.366.756-.974 1.18-1.574.3-.43.68-.484 1.078-.334.406.14 2.572 1.212 3.012 1.432.44.22.732.326.84.51.106.184.106 1.062-.282 2.156z" />
          </svg>
          <span className="relative hidden text-sm font-semibold sm:inline">
            Teklif Al
          </span>
        </a>
      )}
    </div>
  );
}
