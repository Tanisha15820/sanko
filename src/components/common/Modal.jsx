import { X } from 'lucide-react';

// Reusable modal dialog matching the existing application modal styling
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerContent,
  maxWidth = 'max-w-lg',
  scrollable = false,
  footer,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.18)] w-full ${maxWidth} ${
          scrollable ? 'max-h-[90vh] flex flex-col' : ''
        } overflow-hidden`}
      >
        <div
          className={`px-6 py-4 bg-[#f8fafc] border-b border-[#edf1f7] flex items-center justify-between ${
            scrollable ? 'shrink-0' : ''
          }`}
        >
          {headerContent || (
            <div>
              <h3 className="text-base font-extrabold text-[#0f172a]">{title}</h3>
              {subtitle && <p className="text-xs text-[#64748b] mt-0.5">{subtitle}</p>}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0]/50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children}

        {footer && (
          <div
            className={`px-6 py-3.5 bg-[#f8fafc] border-t border-[#edf1f7] flex justify-end ${
              scrollable ? 'shrink-0' : ''
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
