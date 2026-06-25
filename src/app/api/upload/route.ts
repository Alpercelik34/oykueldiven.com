import { promises as fs } from "fs";
import path from "path";
import { isAuthed } from "@/lib/auth";
import { slugify } from "@/lib/format";

// Görsel yükleme. Dosyayı public/uploads altına kaydeder ve URL döner.
// NOT: Yerel/Docker/VPS'te kalıcıdır. Vercel gibi sunucusuz ortamda dosya
// sistemi kalıcı olmadığından orada kalıcı depolama (ör. Vercel Blob) gerekir.
export async function POST(request: Request): Promise<Response> {
  if (!(await isAuthed())) {
    return Response.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json(
      { error: "Sadece görsel dosyaları yüklenebilir." },
      { status: 400 },
    );
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json(
      { error: "Dosya boyutu en fazla 5 MB olabilir." },
      { status: 400 },
    );
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "gorsel";
  const filename = `${base}-${Date.now().toString(36)}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), bytes);

  return Response.json({ url: `/uploads/${filename}` });
}
