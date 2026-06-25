import Link from "next/link";
import { getCategories, getProducts } from "@/lib/db";
import { deleteCategoryAction, saveCategoryAction } from "../actions";

export default async function AdminCategoriesPage(
  props: PageProps<"/admin/kategoriler">,
) {
  const sp = await props.searchParams;
  const editSlug = typeof sp.edit === "string" ? sp.edit : "";
  const ok = typeof sp.ok === "string" ? sp.ok : "";
  const error = typeof sp.error === "string";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  const editing = editSlug
    ? categories.find((c) => c.slug === editSlug)
    : undefined;
  const countByCat = (slug: string) =>
    products.filter((p) => p.category === slug).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-4">Kategori Yönetimi</h1>

      {ok && (
        <p className="mb-4 rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-800">
          {ok === "silindi" ? "Kategori silindi." : "Kaydedildi."}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          Kategori adı zorunludur.
        </p>
      )}

      {/* Ekle / Düzenle */}
      <section className="rounded-xl border border-ink-200 bg-white p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink-900">
            {editing ? `Düzenle: ${editing.name}` : "Yeni Kategori Ekle"}
          </h2>
          {editing && (
            <Link
              href="/admin/kategoriler"
              className="text-sm text-ink-600 hover:underline"
            >
              + Yeni kategoriye geç
            </Link>
          )}
        </div>

        <form
          action={saveCategoryAction}
          className="grid gap-4 sm:grid-cols-2"
          key={editing?.slug ?? "new"}
        >
          <input
            type="hidden"
            name="originalSlug"
            defaultValue={editing?.slug ?? ""}
          />
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Kategori Adı *
            </label>
            <input
              name="name"
              required
              defaultValue={editing?.name}
              className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Sıra (küçük önce gelir)
            </label>
            <input
              name="sort"
              type="number"
              defaultValue={editing?.sort ?? 0}
              className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={2}
              defaultValue={editing?.description}
              className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-6 py-2 font-semibold text-white hover:bg-brand-700"
            >
              {editing ? "Güncelle" : "Kategori Ekle"}
            </button>
          </div>
        </form>
      </section>

      {/* Liste */}
      <section className="rounded-xl border border-ink-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-ink-600 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Sıra</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {categories.map((c) => (
              <tr key={c.slug}>
                <td className="px-4 py-3 text-ink-500">{c.sort ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-ink-900">{c.name}</div>
                  {c.description && (
                    <div className="text-xs text-ink-500 line-clamp-1">
                      {c.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{countByCat(c.slug)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/kategoriler?edit=${c.slug}`}
                      className="rounded-md border border-ink-300 px-3 py-1 text-xs hover:bg-ink-100"
                    >
                      Düzenle
                    </Link>
                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="slug" value={c.slug} />
                      <button
                        type="submit"
                        className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="mt-3 text-xs text-ink-500">
        Not: Bir kategoriyi silmek, o kategorideki ürünleri silmez; ürünler
        başka bir kategoriye taşınana kadar listelerde görünmeyebilir.
      </p>
    </div>
  );
}
