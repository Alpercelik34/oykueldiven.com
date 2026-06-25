import { getSettings } from "@/lib/db";

export const metadata = { title: "İletişim" };

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink-900">İletişim</h1>
      <p className="mt-2 text-ink-600">
        Sipariş, toptan teklif ve sorularınız için bize ulaşın.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <InfoRow icon="📞" label="Telefon" value={settings.phone} />
          <InfoRow icon="✉️" label="E-posta" value={settings.email} />
          <InfoRow icon="📍" label="Adres" value={settings.address} />
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
          >
            WhatsApp ile Yaz
          </a>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="font-semibold text-ink-900 mb-4">Bize Yazın</h2>
          <form
            action={`mailto:${settings.email}`}
            method="post"
            encType="text/plain"
            className="space-y-3"
          >
            <input
              name="ad"
              placeholder="Ad Soyad"
              className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <input
              name="email"
              placeholder="E-posta"
              className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <textarea
              name="mesaj"
              rows={4}
              placeholder="Mesajınız"
              className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
            >
              Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white p-4">
      <span className="text-xl">{icon}</span>
      <div>
        <div className="text-xs text-ink-500">{label}</div>
        <div className="font-medium text-ink-900">{value}</div>
      </div>
    </div>
  );
}
