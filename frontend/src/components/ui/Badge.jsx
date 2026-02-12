export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-black text-white ${className}`}
    >
      {children}
    </span>
  );
}
