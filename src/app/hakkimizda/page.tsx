import { getSettings } from "@/lib/db";

export const metadata = { title: "Hakkımızda" };

export default async function AboutPage() {
  const settings = await getSettings();
  const paragraphs = settings.aboutText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-ink-900">Hakkımızda</h1>
      <div className="mt-6 space-y-4 text-ink-700 leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {settings.aboutStats.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {settings.aboutStats.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-ink-200 bg-white p-5 text-center"
            >
              <div className="text-2xl font-bold text-brand-700">
                {stat.value}
              </div>
              <div className="text-sm text-ink-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
