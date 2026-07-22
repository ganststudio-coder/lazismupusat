export type AdminRole = 'master' | 'regular';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface Program {
  id: string;
  nama: string;
  deskripsi: string | null;
  target_dana: number;
  dana_terkumpul: number;
  kategori: string | null;
  foto: string | null;
  urutan: number;
  is_active: boolean;
  created_at: string;
}

export interface Pengurus {
  id: string;
  nama: string;
  jabatan: string;
  masa_jabatan: string | null;
  foto: string | null;
  urutan: number;
  created_at: string;
}

export interface Galeri {
  id: string;
  image_url: string;
  caption: string | null;
  kategori: string | null;
  urutan: number;
  created_at: string;
}

export interface Berita {
  id: string;
  judul: string;
  tanggal: string;
  ringkasan: string | null;
  isi: string | null;
  foto: string | null;
  created_at: string;
}

export interface DashboardSlide {
  id: string;
  image_url: string;
  caption: string | null;
  urutan: number;
  is_active: boolean;
  created_at: string;
}

export interface KontakSettings {
  id: number;
  telepon: string | null;
  email: string | null;
  alamat: string | null;
  qris_image: string | null;
  updated_at: string;
}

export interface ZakatSettings {
  id: number;
  harga_emas_per_gram: number;
  harga_beras_per_kg: number;
  updated_at: string;
}

export type DonasiTipe = 'rekening' | 'qris' | 'gopay' | 'debit' | 'va';

export interface DonasiMetode {
  id: string;
  tipe: DonasiTipe;
  label: string;
  nilai: string;
  catatan: string | null;
  urutan: number;
  is_active: boolean;
  created_at: string;
}

export interface ZakatChatLog {
  id: string;
  pertanyaan: string;
  jawaban: string | null;
  provider: string | null;
  status: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: number;
}
