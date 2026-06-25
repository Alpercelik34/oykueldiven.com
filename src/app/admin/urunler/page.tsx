import Link from "next/link";
import { getCategories, getProductById, getProducts } from "@/lib/db";
import { formatTRY } from "@/lib/format";
import { deleteProductAction, saveProductAction } from "../actions";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default async function AdminProductsPage(
  props: PageProps<"/admin/urunler">,
) {
  const sp = await props.searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";
  const ok = typeof sp.ok === "string" ? sp.ok : "";
  const error = typeof sp.error === "string" ? sp.error : "";

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const editing = editId ? await getProductById(editId) : undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-4">Ürün Yönetimi</h1>

      {ok && (
        <p className="mb-4 rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-800">
          {ok === "silindi" ? "Ürün silindi." : "Değişiklik kaydedildi."}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          Lütfen zorunlu alanları (ad, kategori, fiyat) doldurun.
        </p>
      )}

      {/* Ekle / Düzenle Formu */}
      <section className="rounded-xl border border-ink-200 bg-white p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink-900">
            {editing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h2>
          {editing && (
            <Link
              href="/admin/urunler"
              className="text-sm text-ink-600 hover:underline"
            >
              + Yeni ürüne geç
            </Link>
          )}
        </div>

        <form
          action={saveProductAction}
          className="grid gap-4 sm:grid-cols-2"
          key={editing?.id ?? "new"}
        >
          <input type="hidden" name="id" defaultValue={editing?.id ?? ""} />

          <Input
            name="name"
            label="Ürün Adı *"
            defaultValue={editing?.name}
            required
          />
          <Select
            name="category"
            label="Kategori *"
            defaultValue={editing?.category}
            options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          />
          <Input
            name="price"
            label="Fiyat (TL) *"
            type="number"
            step="0.01"
            defaultValue={editing?.price}
            required
          />
          <Input
            name="oldPrice"
            label="Eski Fiyat (indirim için)"
            type="number"
            step="0.01"
            defaultValue={editing?.oldPrice}
          />
          <Input
            name="stock"
            label="Stok Adedi"
            type="number"
            defaultValue={editing?.stock ?? 0}
          />
          <Input
            name="unit"
            label="Satış Birimi (ör. Kutu 100 adet)"
            defaultValue={editing?.unit}
          />
          <Input name="brand" label="Marka" defaultValue={editing?.brand} />
          <Input
            name="sku"
            label="Ürün Kodu (SKU)"
            defaultValue={editing?.sku}
          />
          <div className="sm:col-span-2">
            <ImageUpload
              name="image"
              label="Ürün Görseli (bilgisayardan yükleyin veya URL girin)"
              initialUrl={editing?.image}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editing?.description}
              className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={editing?.featured}
            />
            Ana sayfada öne çıkar
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-6 py-2 font-semibold text-white hover:bg-brand-700"
            >
              {editing ? "Güncelle" : "Ürünü Kaydet"}
            </button>
          </div>
        </form>
      </section>

      {/* Ürün Listesi */}
      <section className="rounded-xl border border-ink-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-ink-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Ürün</th>
                <th className="px-4 py-3 font-medium">Fiyat</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt=""
                        className="w-10 h-10 rounded object-cover bg-ink-50"
                      />
                      <div>
                        <div className="font-medium text-ink-900 line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-xs text-ink-500">
                          {p.brand} {p.featured && "• öne çıkan"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatTRY(p.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.stock === 0
                          ? "text-red-600"
                          : p.stock <= 20
                            ? "text-amber-600"
                            : "text-ink-700"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/urunler?edit=${p.id}`}
                        className="rounded-md border border-ink-300 px-3 py-1 text-xs hover:bg-ink-100"
                      >
                        Düzenle
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={p.id} />
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
        </div>
      </section>
    </div>
  );
}

function Input({
  name,
  label,
  defaultValue,
  type = "text",
  required,
  step,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  step?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500 bg-white"
      >
        <option value="" disabled>
          Seçiniz
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
