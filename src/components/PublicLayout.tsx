import { useState, type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DonationModal } from './DonationModal';

export function PublicLayout({ children }: { children: ReactNode }) {
  const [donateOpen, setDonateOpen] = useState(false);
  const openDonate = () => setDonateOpen(true);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onDonate={openDonate} />
      <main className="flex-1">{children}</main>
      <Footer />
      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}

export function useDonationModal() {
  const [open, setOpen] = useState(false);
  return { open, openDonation: () => setOpen(true), closeDonation: () => setOpen(false) };
}
