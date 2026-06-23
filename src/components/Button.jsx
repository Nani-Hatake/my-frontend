const variantStyles = {
  primary:
    "bg-accent text-white hover:bg-accent-dark disabled:bg-accent/50 shadow-sm",
  secondary:
    "bg-white text-ink-900 border border-slate-200 hover:bg-slate-50 disabled:opacity-50",
  danger:
    "bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50",
  ghost: "text-ink-700 hover:bg-slate-100 disabled:opacity-50",
};

const Button = ({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
        text-sm font-semibold transition-colors duration-150
        disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
};

export default Button;
