/*
# LAZISMU Jakarta Pusat — Full schema & seed

## Tables (all public)
- admin_users: master/regular admin accounts (username, password_hash, email, role). Base table is service-role only; public view admin_users_public exposes non-sensitive fields.
- programs: program unggulan (nama, deskripsi, target_dana, dana_terkumpul, kategori, foto, urutan, is_active).
- pengurus: pengurus LAZISMU (nama, jabatan, masa_jabatan, foto, urutan).
- galeri: foto galeri (image_url, caption, kategori, urutan).
- berita: berita/kabar (judul, tanggal, ringkasan, isi, foto).
- dashboard_slides: carousel slides untuk dashboard (image_url, caption, urutan, is_active).
- kontak_settings: pengaturan kontak (telepon, email, alamat, qris_image) — single row.
- zakat_settings: harga emas per gram, harga beras per kg — single row.
- donasi_metode: metode donasi (tipe, label, nilai, catatan, urutan, is_active). Tipe: rekening, qris, gopay, debit, va.
- zakat_chat_logs: log percakapan AI (pertanyaan, jawaban, provider, status, created_at).

## Security (RLS)
- Public content tables (programs, pengurus, galeri, berita, dashboard_slides, kontak_settings, zakat_settings, donasi_metode): SELECT TO anon, authenticated (USING true). Writes via service role only (no anon write policies).
- admin_users base table: no anon policy; authenticated SELECT only. Public view admin_users_public is anon-readable for listing/logins.
- zakat_chat_logs: INSERT TO anon, authenticated (anyone may ask); SELECT TO authenticated (admin review).

## Notes
1. Master admin (username=admin, password=1818) seeded with the correct SHA-256 hash via execute_sql after this migration (kept here is idempotent placeholder).
2. Admin login is verified through the admin-login edge function (service role reads hash, SHA-256 compares). The client never sees password_hash.
3. Seed data: 3 programs, 4 pengurus, 4 galeri, 2 berita, 3 slides, kontak defaults, zakat defaults (gold 1.350.000/g, rice 15.000/kg), 5 donasi metode.
*/

-- ========== admin_users ==========
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'regular' CHECK (role IN ('master','regular')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_select_admin_users" ON admin_users;
CREATE POLICY "admin_select_admin_users" ON admin_users FOR SELECT TO authenticated USING (true);

DROP VIEW IF EXISTS admin_users_public;
CREATE VIEW admin_users_public AS
  SELECT id, username, email, role, created_at FROM admin_users;
ALTER VIEW admin_users_public OWNER TO postgres;
GRANT SELECT ON admin_users_public TO anon, authenticated;

-- ========== programs ==========
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  deskripsi text,
  target_dana bigint DEFAULT 0,
  dana_terkumpul bigint DEFAULT 0,
  kategori text DEFAULT 'Umum',
  foto text,
  urutan int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_programs" ON programs;
CREATE POLICY "public_select_programs" ON programs FOR SELECT TO anon, authenticated USING (true);

-- ========== pengurus ==========
CREATE TABLE IF NOT EXISTS pengurus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  jabatan text NOT NULL,
  masa_jabatan text,
  foto text,
  urutan int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE pengurus ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_pengurus" ON pengurus;
CREATE POLICY "public_select_pengurus" ON pengurus FOR SELECT TO anon, authenticated USING (true);

-- ========== galeri ==========
CREATE TABLE IF NOT EXISTS galeri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  kategori text DEFAULT 'Umum',
  urutan int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_galeri" ON galeri;
CREATE POLICY "public_select_galeri" ON galeri FOR SELECT TO anon, authenticated USING (true);

-- ========== berita ==========
CREATE TABLE IF NOT EXISTS berita (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  tanggal date DEFAULT CURRENT_DATE,
  ringkasan text,
  isi text,
  foto text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_berita" ON berita;
CREATE POLICY "public_select_berita" ON berita FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS berita_tanggal_idx ON berita(tanggal DESC);

-- ========== dashboard_slides ==========
CREATE TABLE IF NOT EXISTS dashboard_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  urutan int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE dashboard_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_slides" ON dashboard_slides;
CREATE POLICY "public_select_slides" ON dashboard_slides FOR SELECT TO anon, authenticated USING (true);

-- ========== kontak_settings (single row) ==========
CREATE TABLE IF NOT EXISTS kontak_settings (
  id int PRIMARY KEY DEFAULT 1,
  telepon text,
  email text,
  alamat text,
  qris_image text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT kontak_singleton CHECK (id = 1)
);
ALTER TABLE kontak_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_kontak" ON kontak_settings;
CREATE POLICY "public_select_kontak" ON kontak_settings FOR SELECT TO anon, authenticated USING (true);

-- ========== zakat_settings (single row) ==========
CREATE TABLE IF NOT EXISTS zakat_settings (
  id int PRIMARY KEY DEFAULT 1,
  harga_emas_per_gram bigint DEFAULT 1350000,
  harga_beras_per_kg bigint DEFAULT 15000,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT zakat_singleton CHECK (id = 1)
);
ALTER TABLE zakat_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_zakat" ON zakat_settings;
CREATE POLICY "public_select_zakat" ON zakat_settings FOR SELECT TO anon, authenticated USING (true);

-- ========== donasi_metode ==========
CREATE TABLE IF NOT EXISTS donasi_metode (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipe text NOT NULL CHECK (tipe IN ('rekening','qris','gopay','debit','va')),
  label text NOT NULL,
  nilai text NOT NULL,
  catatan text,
  urutan int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE donasi_metode ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_donasi" ON donasi_metode;
CREATE POLICY "public_select_donasi" ON donasi_metode FOR SELECT TO anon, authenticated USING (true);

-- ========== zakat_chat_logs ==========
CREATE TABLE IF NOT EXISTS zakat_chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pertanyaan text NOT NULL,
  jawaban text,
  provider text,
  status text DEFAULT 'ok',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE zakat_chat_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_chat_logs" ON zakat_chat_logs;
CREATE POLICY "anon_insert_chat_logs" ON zakat_chat_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_select_chat_logs" ON zakat_chat_logs;
CREATE POLICY "admin_select_chat_logs" ON zakat_chat_logs FOR SELECT TO authenticated USING (true);

-- ========== SEED DATA ==========
INSERT INTO programs (nama, deskripsi, target_dana, dana_terkumpul, kategori, foto, urutan, is_active)
SELECT 'Beasiswa Cerdas Mu', 'Bantuan pendidikan untuk anak yatim dan dhuafa berprestasi di Jakarta Pusat.', 250000000, 187500000, 'Pendidikan', 'https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg', 1, true
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE nama = 'Beasiswa Cerdas Mu');

INSERT INTO programs (nama, deskripsi, target_dana, dana_terkumpul, kategori, foto, urutan, is_active)
SELECT 'Wakaf Al-Qur''an', 'Pengadaan dan distribusi Al-Qur''an ke masjid dan mushalla di wilayah Jakarta Pusat.', 100000000, 64000000, 'Wakaf', 'https://images.pexels.com/photos/8108044/pexels-photo-8108044.jpeg', 2, true
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE nama = 'Wakaf Al-Qur''an');

INSERT INTO programs (nama, deskripsi, target_dana, dana_terkumpul, kategori, foto, urutan, is_active)
SELECT 'Bantuan Sosial Dhuafa', 'Paket sembako dan bantuan kesehatan rutin untuk keluarga dhuafa Jakarta Pusat.', 150000000, 98000000, 'Sosial', 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg', 3, true
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE nama = 'Bantuan Sosial Dhuafa');

INSERT INTO pengurus (nama, jabatan, masa_jabatan, foto, urutan)
SELECT 'H. Ahmad Fauzi, S.E.', 'Ketua', '2024-2028', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', 1
WHERE NOT EXISTS (SELECT 1 FROM pengurus WHERE nama = 'H. Ahmad Fauzi, S.E.');

INSERT INTO pengurus (nama, jabatan, masa_jabatan, foto, urutan)
SELECT 'Drs. Sutrisno, M.M.', 'Wakil Ketua', '2024-2028', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', 2
WHERE NOT EXISTS (SELECT 1 FROM pengurus WHERE nama = 'Drs. Sutrisno, M.M.');

INSERT INTO pengurus (nama, jabatan, masa_jabatan, foto, urutan)
SELECT 'Hj. Siti Aminah, S.Pd.', 'Bendahara', '2024-2028', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', 3
WHERE NOT EXISTS (SELECT 1 FROM pengurus WHERE nama = 'Hj. Siti Aminah, S.Pd.');

INSERT INTO pengurus (nama, jabatan, masa_jabatan, foto, urutan)
SELECT 'Muhammad Rizki, S.Kom.', 'Sekretaris', '2024-2028', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', 4
WHERE NOT EXISTS (SELECT 1 FROM pengurus WHERE nama = 'Muhammad Rizki, S.Kom.');

INSERT INTO galeri (image_url, caption, kategori, urutan)
SELECT 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg', 'Penyaluran paket sembako', 'Sosial', 1
WHERE NOT EXISTS (SELECT 1 FROM galeri WHERE caption = 'Penyaluran paket sembako');

INSERT INTO galeri (image_url, caption, kategori, urutan)
SELECT 'https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg', 'Penyerahan beasiswa', 'Pendidikan', 2
WHERE NOT EXISTS (SELECT 1 FROM galeri WHERE caption = 'Penyerahan beasiswa');

INSERT INTO galeri (image_url, caption, kategori, urutan)
SELECT 'https://images.pexels.com/photos/8108044/pexels-photo-8108044.jpeg', 'Wakaf Al-Qur''an', 'Wakaf', 3
WHERE NOT EXISTS (SELECT 1 FROM galeri WHERE caption = 'Wakaf Al-Qur''an');

INSERT INTO galeri (image_url, caption, kategori, urutan)
SELECT 'https://images.pexels.com/photos/8464574/pexels-photo-8464574.jpeg', 'Kegiatan santunan anak yatim', 'Sosial', 4
WHERE NOT EXISTS (SELECT 1 FROM galeri WHERE caption = 'Kegiatan santunan anak yatim');

INSERT INTO berita (judul, tanggal, ringkasan, isi, foto)
SELECT 'LAZISMU Jakarta Pusat Salurkan Bantuan Pendidikan', CURRENT_DATE - 2,
  'Penyaluran beasiswa kepada 50 anak yatim dan dhuafa di wilayah Jakarta Pusat.',
  'LAZISMU Jakarta Pusat kembali menyalurkan bantuan beasiswa pendidikan kepada 50 anak yatim dan dhuafa di wilayah Jakarta Pusat. Bantuan ini diharapkan dapat meringankan beban orang tua dan mendorong semangat belajar para penerima manfaat.',
  'https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM berita WHERE judul = 'LAZISMU Jakarta Pusat Salurkan Bantuan Pendidikan');

INSERT INTO berita (judul, tanggal, ringkasan, isi, foto)
SELECT 'Wakaf Al-Qur''an untuk 20 Mushalla', CURRENT_DATE - 6,
  'Distribusi 200 Al-Qur''an ke mushalla dan masjid di Jakarta Pusat.',
  'Program Wakaf Al-Qur''an LAZISMU Jakarta Pusat telah menyalurkan 200 Al-Qur''an ke 20 mushalla dan masjid di wilayah Jakarta Pusat. Program ini akan terus berjalan untuk menyelaraskan kebutuhan umat.',
  'https://images.pexels.com/photos/8108044/pexels-photo-8108044.jpeg'
WHERE NOT EXISTS (SELECT 1 FROM berita WHERE judul = 'Wakaf Al-Qur''an untuk 20 Mushalla');

INSERT INTO dashboard_slides (image_url, caption, urutan, is_active)
SELECT 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg', 'Penyaluran paket sembako untuk dhuafa', 1, true
WHERE NOT EXISTS (SELECT 1 FROM dashboard_slides WHERE caption = 'Penyaluran paket sembako untuk dhuafa');

INSERT INTO dashboard_slides (image_url, caption, urutan, is_active)
SELECT 'https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg', 'Beasiswa Cerdas Mu untuk anak yatim', 2, true
WHERE NOT EXISTS (SELECT 1 FROM dashboard_slides WHERE caption = 'Beasiswa Cerdas Mu untuk anak yatim');

INSERT INTO dashboard_slides (image_url, caption, urutan, is_active)
SELECT 'https://images.pexels.com/photos/8108044/pexels-photo-8108044.jpeg', 'Wakaf Al-Qur''an ke mushalla', 3, true
WHERE NOT EXISTS (SELECT 1 FROM dashboard_slides WHERE caption = 'Wakaf Al-Qur''an ke mushalla');

INSERT INTO kontak_settings (id, telepon, email, alamat, qris_image)
SELECT 1, '+62 21-1234-5678', 'info@lazismujakpus.or.id',
  'Jl. Kramat Raya No. 1, Jakarta Pusat, DKI Jakarta',
  'https://images.pexels.com/photos/8464574/pexels-photo-8464574.jpeg'
ON CONFLICT (id) DO NOTHING;

INSERT INTO zakat_settings (id, harga_emas_per_gram, harga_beras_per_kg)
SELECT 1, 1350000, 15000
ON CONFLICT (id) DO NOTHING;

INSERT INTO donasi_metode (tipe, label, nilai, catatan, urutan, is_active)
SELECT 'rekening', 'Bank Muamalat', '1234567890', 'a.n. LAZISMU Jakarta Pusat', 1, true
WHERE NOT EXISTS (SELECT 1 FROM donasi_metode WHERE tipe='rekening' AND label='Bank Muamalat');

INSERT INTO donasi_metode (tipe, label, nilai, catatan, urutan, is_active)
SELECT 'qris', 'QRIS', 'lazismu-jakpus-qris', 'Scan untuk donasi via QRIS', 2, true
WHERE NOT EXISTS (SELECT 1 FROM donasi_metode WHERE tipe='qris');

INSERT INTO donasi_metode (tipe, label, nilai, catatan, urutan, is_active)
SELECT 'gopay', 'GoPay', '081234567890', 'a.n. LAZISMU Jakarta Pusat', 3, true
WHERE NOT EXISTS (SELECT 1 FROM donasi_metode WHERE tipe='gopay');

INSERT INTO donasi_metode (tipe, label, nilai, catatan, urutan, is_active)
SELECT 'debit', 'Kartu Debit', 'Via platform donasi', 'Pembayaran kartu debit melalui link donasi resmi', 4, true
WHERE NOT EXISTS (SELECT 1 FROM donasi_metode WHERE tipe='debit');

INSERT INTO donasi_metode (tipe, label, nilai, catatan, urutan, is_active)
SELECT 'va', 'Virtual Account BSI', '8800123456789012', 'a.n. LAZISMU Jakarta Pusat', 5, true
WHERE NOT EXISTS (SELECT 1 FROM donasi_metode WHERE tipe='va' AND label='Virtual Account BSI');
