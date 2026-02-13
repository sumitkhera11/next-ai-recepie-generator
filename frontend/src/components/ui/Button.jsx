export function Button({
  children,
  variant = "default",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200";

  const variants = {
    default: "bg-black text-white hover:bg-gray-800",
    ghost: "bg-transparent hover:bg-gray-100",
    primary: "bg-orange-600 text-white hover:bg-orange-700",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
