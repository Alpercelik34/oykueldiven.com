import { getSettings } from "@/lib/db";
import {
  LOGO_SIZES,
  THEMES,
  type LogoSize,
  type ThemeKey,
} from "@/lib/settings";
import { saveSettingsAction } from "../actions";
import { ListEditor } from "@/components/admin/ListEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default async function AppearancePage(
  props: PageProps<"/admin/gorunum">,
) {
  const sp = await props.searchParams;
  const ok = typeof sp.ok === "string";
  const s = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-2">Görünüm & İçerik</h1>
      <p className="text-sm text-ink-600 mb-6">
        Buradaki değişiklikler kaydedince site genelinde anında geçerli olur.
      </p>

      {ok && (
        <p className="mb-4 rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-800">
          Değişiklikler kaydedildi.
        </p>
      )}

      <form action={saveSettingsAction} className="space-y-6">
        {/* Marka */}
        <Section title="Marka">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="siteName" label="Firma / Site Adı" value={s.siteName} />
            <Input
              name="logoLetter"
              label="Logo Harfi (logo görseli yoksa kullanılır)"
              value={s.logoLetter}
            />
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Logo Boyutu
              </label>
              <select
                name="logoSize"
                defaultValue={s.logoSize}
                className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500 bg-white"
              >
                {(Object.keys(LOGO_SIZES) as LogoSize[]).map((k) => (
                  <option key={k} value={k}>
                    {LOGO_SIZES[k].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Input name="tagline" label="Slogan" value={s.tagline} />
            </div>
            <div className="sm:col-span-2">
              <ImageUpload
                name="logoUrl"
                label="Logo Görseli (isteğe bağlı)"
                initialUrl={s.logoUrl}
              />
            </div>
          </div>
        </Section>

        {/* Renk teması */}
        <Section title="Renk Teması">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
              const t = THEMES[key];
              return (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-xl border border-ink-200 p-3 cursor-pointer hover:border-ink-300 has-[:checked]:border-2 has-[:checked]:border-ink-900"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={key}
                    defaultChecked={s.theme === key}
                    className="sr-only"
                  />
                  <span className="flex gap-1">
                    <span className="w-6 h-6 rounded-full" style={{ background: t.palette["600"] }} />
                    <span className="w-6 h-6 rounded-full" style={{ background: t.palette["400"] }} />
                    <span className="w-6 h-6 rounded-full" style={{ background: t.palette["200"] }} />
                  </span>
                  <span className="text-sm font-medium text-ink-800">{t.label}</span>
                </label>
              );
            })}
          </div>
        </Section>

        {/* Üst şerit + kargo */}
        <Section title="Duyuru Şeridi & Kargo">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                name="announcement"
                label="Üst duyuru metni"
                value={s.announcement}
              />
            </div>
            <Input
              name="freeShippingLimit"
              label="Ücretsiz kargo limiti (TL)"
              value={String(s.freeShippingLimit)}
              type="number"
            />
            <Input
              name="shippingCost"
              label="Kargo ücreti (limit altı, TL)"
              value={String(s.shippingCost)}
              type="number"
            />
          </div>
        </Section>

        {/* Ana sayfa */}
        <Section title="Ana Sayfa (Üst Alan)">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input name="heroBadge" label="Küçük etiket" value={s.heroBadge} />
            </div>
            <Input name="heroTitle" label="Başlık" value={s.heroTitle} />
            <Input
              name="heroHighlight"
              label="Başlıkta vurgulu kısım (renkli)"
              value={s.heroHighlight}
            />
            <div className="sm:col-span-2">
              <Textarea name="heroSubtitle" label="Açıklama" value={s.heroSubtitle} />
            </div>
            <Input name="heroPrimaryBtn" label="Buton yazısı" value={s.heroPrimaryBtn} />
          </div>
        </Section>

        {/* Güven rozetleri */}
        <Section title="Ana Sayfa Güven Rozetleri">
          <p className="text-xs text-ink-500 mb-2">
            Ana sayfada gösterilen küçük özellik kutucukları. İkon olarak emoji
            kullanabilirsiniz (ör. 🚚 💳 ✅).
          </p>
          <ListEditor
            name="trustBadges"
            initial={s.trustBadges as unknown as Record<string, string>[]}
            fields={[
              { key: "icon", label: "İkon", placeholder: "🚚" },
              { key: "title", label: "Başlık", placeholder: "Hızlı Kargo" },
              { key: "subtitle", label: "Alt yazı", placeholder: "Aynı gün gönderim" },
            ]}
            addLabel="+ Rozet ekle"
          />
        </Section>

        {/* Hakkımızda */}
        <Section title="Hakkımızda">
          <Textarea
            name="aboutText"
            label="Metin (paragrafları boş satır bırakarak ayırın)"
            value={s.aboutText}
            rows={8}
          />
          <div className="mt-4">
            <p className="text-sm font-medium text-ink-700 mb-1">
              İstatistikler
            </p>
            <ListEditor
              name="aboutStats"
              initial={s.aboutStats as unknown as Record<string, string>[]}
              fields={[
                { key: "value", label: "Değer", placeholder: "10.000+" },
                { key: "label", label: "Açıklama", placeholder: "Mutlu müşteri" },
              ]}
              addLabel="+ İstatistik ekle"
            />
          </div>
        </Section>

        {/* İletişim & sosyal */}
        <Section title="İletişim & Sosyal Medya">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="phone" label="Telefon" value={s.phone} />
            <Input
              name="whatsapp"
              label="WhatsApp (ülke koduyla, ör. 905xxxxxxxxx)"
              value={s.whatsapp}
            />
            <Input name="email" label="E-posta" value={s.email} />
            <Input name="address" label="Adres" value={s.address} />
            <Input name="instagram" label="Instagram (tam link)" value={s.instagram} />
            <Input name="facebook" label="Facebook (tam link)" value={s.facebook} />
            <Input name="twitter" label="X / Twitter (tam link)" value={s.twitter} />
            <Input name="youtube" label="YouTube (tam link)" value={s.youtube} />
          </div>
        </Section>

        {/* Ödeme */}
        <Section title="Ödeme Yöntemleri">
          <div className="space-y-2">
            <Toggle name="payHavale" label="Havale / EFT" checked={s.payHavale} />
            <Toggle name="payKapida" label="Kapıda Ödeme" checked={s.payKapida} />
            <Toggle
              name="payKart"
              label="Kredi Kartı (online — altyapı eklenince)"
              checked={s.payKart}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input name="bankName" label="Banka Adı" value={s.bankName} />
            <Input name="accountName" label="Hesap Sahibi" value={s.accountName} />
            <div className="sm:col-span-2">
              <Input name="iban" label="IBAN" value={s.iban} />
            </div>
          </div>
        </Section>

        {/* Footer */}
        <Section title="Alt Bilgi (Footer)">
          <Input
            name="footerNote"
            label="Footer'da sağ altta görünen küçük not"
            value={s.footerNote}
          />
        </Section>

        <div className="sticky bottom-4">
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-brand-700"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ink-200 bg-white p-5">
      <h2 className="font-semibold text-ink-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Input({
  name,
  label,
  value,
  type = "text",
}: {
  name: string;
  label: string;
  value?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        defaultValue={value}
        className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}

function Textarea({
  name,
  label,
  value,
  rows = 3,
}: {
  name: string;
  label: string;
  value?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        rows={rows}
        defaultValue={value}
        className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}

function Toggle({
  name,
  label,
  checked,
}: {
  name: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-ink-200 p-3 cursor-pointer hover:border-ink-300">
      <input type="checkbox" name={name} defaultChecked={checked} />
      <span className="text-sm font-medium text-ink-800">{label}</span>
    </label>
  );
}
