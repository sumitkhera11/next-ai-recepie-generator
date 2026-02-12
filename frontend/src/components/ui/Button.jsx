export function Button({ children, ...props }) {
  return (
    <button
      style={{
        padding: "8px 16px",
        background: "black",
        color: "white",
        borderRadius: "6px"
      }}
      {...props}
    >
      {children}
    </button>
  );
}
