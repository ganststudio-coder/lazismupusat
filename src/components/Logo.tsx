export function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <img src="/logo.png" alt="Logo LAZISMU Jakarta Pusat" className={`${className} object-contain rounded-lg`} />
  );
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo.png" alt="Logo LAZISMU Jakarta Pusat" className="h-12 w-auto object-contain rounded-lg" />
    </div>
  );
}