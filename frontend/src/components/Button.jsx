export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  className = '', 
  disabled = false,
  fullWidth = false 
}) {
  const baseClasses = 'inline-flex justify-center items-center gap-2 border border-transparent font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-3 text-base rounded-xl',
  };
  
  const variants = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
    warning: 'text-gray-800 bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-500',
    outline: 'text-blue-600 bg-transparent border-2 border-blue-500 hover:bg-blue-50 focus:ring-blue-500',
    glass: 'text-gray-700 bg-gray-100 bg-opacity-50 backdrop-blur-sm border border-gray-200 hover:bg-opacity-75 focus:ring-indigo-500'
  };

  const widthClass = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}