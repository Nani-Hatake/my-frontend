const Select = ({ label, name, value, onChange, options, error, required = false }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-ink-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink-900 bg-white
          transition-colors focus:border-accent focus:ring-1 focus:ring-accent
          ${error ? "border-red-300" : "border-slate-200"}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
