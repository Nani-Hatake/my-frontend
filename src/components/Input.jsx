const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  textarea = false,
  rows = 3,
  min,
  step,
}) => {
  const baseClasses = `
    w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink-900
    placeholder:text-ink-700/40 transition-colors
    focus:border-accent focus:ring-1 focus:ring-accent
    ${error ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-white"}
  `;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-ink-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={baseClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          step={step}
          className={baseClasses}
        />
      )}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
