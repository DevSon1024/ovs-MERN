export default function Input({ type = 'text', value, onChange, placeholder, required = false, name, disabled = false, onToggleVisibility, isPasswordVisible }) {
  return (
    <div className="relative">
      <input
        type={isPasswordVisible ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200 shadow-soft hover:border-gray-300"
      />
    </div>
  );
}