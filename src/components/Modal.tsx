import { useEffect, type ReactNode } from 'react';
import { X, Loader2 } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-lazismu-green-dark/50 p-0 backdrop-blur-sm animate-fadeIn sm:items-center sm:p-4" onClick={onClose}>
      <div
        className={`w-full ${size === 'lg' ? 'max-w-2xl' : 'max-w-lg'} overflow-hidden rounded-t-3xl bg-white shadow-lift animate-scaleIn sm:rounded-3xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h3 className="font-serif text-lg font-semibold text-lazismu-green">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-neutral-100 bg-lazismu-cream/50 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onClose,
  loading,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">Batal</button>
          <button onClick={onConfirm} disabled={loading} className="btn-primary !bg-red-500 hover:!bg-red-600">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hapus'}
          </button>
        </>
      }
    >
      <p className="text-sm text-neutral-600">{message}</p>
    </Modal>
  );
}
