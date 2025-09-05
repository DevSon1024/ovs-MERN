export default function Alert({ message, type = 'error' }) {
    if (!message) return null;
    
    const baseClasses = 'flex items-start gap-3 px-4 py-3 rounded-xl relative mb-4 shadow-soft border-l-4';
    const typeClasses = {
        error: 'bg-red-50/80 backdrop-blur-sm border-red-400 text-red-800',
        success: 'bg-green-50/80 backdrop-blur-sm border-green-400 text-green-800',
        warning: 'bg-yellow-50/80 backdrop-blur-sm border-yellow-400 text-yellow-800',
        info: 'bg-blue-50/80 backdrop-blur-sm border-blue-400 text-blue-800',
    };
    
    return (
        <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
            <div className="flex-1">
                <span className="font-medium text-sm leading-relaxed">{message}</span>
            </div>
        </div>
    );
}