import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useKontak } from '../lib/data';
import { useDonationModal } from '../components/PublicLayout';
import { DonationModal } from '../components/DonationModal';

export function KontakPage() {
  const { kontak, loading } = useKontak();
  const { open, openDonation, closeDonation } = useDonationModal();

  return (
    <div className="container-px py-12">
      <span className="section-eyebrow"><span className="h-px w-8 bg-lazismu-orange" /> Hubungi kami</span>
      <h1 className="section-title">Kontak LAZISMU</h1>
      <p className="mt-3 max-w-2xl text-sm text-neutral-600">
        Hubungi kami untuk informasi zakat, infaq, wakaf, atau konfirmasi donasi.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {kontak?.telepon && <ContactRow icon={<Phone className="h-5 w-5" />} label="Telepon" value={kontak.telepon} href={`tel:${kontak.telepon.replace(/\s/g, '')}`} />}
          {kontak?.email && <ContactRow icon={<Mail className="h-5 w-5" />} label="Email" value={kontak.email} href={`mailto:${kontak.email}`} />}
          {kontak?.alamat && <ContactRow icon={<MapPin className="h-5 w-5" />} label="Alamat" value={kontak.alamat} />}

          {kontak?.qris_image && (
            <div className="card p-5">
              <h3 className="font-serif text-base font-semibold text-lazismu-green">Scan QRIS untuk Donasi</h3>
              <p className="mt-1 text-xs text-neutral-500">Scan kode QRIS berikut menggunakan aplikasi e-wallet atau m-banking Anda.</p>
              <div className="mt-4 flex justify-center">
                <div className="overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-neutral-200">
                  <img src={kontak.qris_image} alt="QRIS LAZISMU" className="h-48 w-48 object-contain" />
                </div>
              </div>
              <button onClick={openDonation} className="btn-primary mt-4 w-full">Donasi via metode lain</button>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-serif text-xl font-semibold text-lazismu-green">Kirim Pesan</h3>
          <p className="mt-1 text-xs text-neutral-500">Formulir ini akan mengirim pesan ke email resmi LAZISMU.</p>
          <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Pesan Anda telah dicatat. Admin akan menghubungi Anda segera. Jazakumullah khairan.'); (e.target as HTMLFormElement).reset(); }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Nama</label>
                <input required className="input" placeholder="Nama Anda" />
              </div>
              <div>
                <label className="label">No. WhatsApp</label>
                <input required className="input" placeholder="08xxxxxxxxxx" />
              </div>
            </div>
            <div>
              <label className="label">Pesan</label>
              <textarea required rows={5} className="input resize-none" placeholder="Tulis pertanyaan atau pesan Anda..." />
            </div>
            <button type="submit" className="btn-green w-full">
              <Send className="h-4 w-4" /> Kirim Pesan
            </button>
          </form>
        </div>
      </div>

      {loading && <p className="mt-4 text-xs text-neutral-400">Memuat informasi kontak...</p>}

      <DonationModal open={open} onClose={closeDonation} />
    </div>
  );
}

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="card flex items-center gap-4 p-5 transition hover:shadow-lift">
      <div className="inline-flex rounded-xl bg-lazismu-orange/10 p-3 text-lazismu-orange-dark">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-neutral-800">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer" className="block">{content}</a> : content;
}
