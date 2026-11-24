import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl border border-[#edf1f7] shadow-[0_20px_50px_rgba(15,23,42,0.08)] max-w-md w-full p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#eef4ff] text-[#0b57d0] flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#0b57d0]">
            Error 404
          </p>
          <h1 className="text-2xl font-extrabold text-[#0f172a] mt-1">
            Page Not Found
          </h1>
          <p className="text-xs font-medium text-[#64748b] mt-2 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b57d0] hover:bg-[#0947ab] text-white text-xs font-bold shadow-[0_6px_16px_rgba(11,87,208,0.22)] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
