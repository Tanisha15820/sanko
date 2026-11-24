import { Search } from 'lucide-react';

// Reusable search input with leading search icon
const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  variant = 'inline',
  className = '',
}) => {
  const inputClasses =
    variant === 'bordered'
      ? 'w-full h-10 pl-9 pr-3 bg-[#f3f6fb] border border-[#d6deeb] rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:bg-white focus:border-[#0b57d0]'
      : 'w-full h-9 pl-9 pr-3.5 bg-[#f3f6fb] hover:bg-[#edf2f9] focus:bg-white border border-transparent focus:border-[#0b57d0]/30 rounded-xl text-xs font-medium text-[#0f172a] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/10 transition-all';

  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
      />
    </div>
  );
};

export default SearchInput;
