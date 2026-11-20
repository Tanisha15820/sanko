import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/machines': 'Machine Status',
  '/breakdowns': 'Breakdown Management',
  '/machines/details': 'Machine Details',
  '/production': 'Production Monitoring',
  '/pm/calendar': 'PM Calendar',
  '/pm/checklist': 'PM Checklist',
  '/pm/history': 'PM History',
  '/inventory/spare-parts': 'Spare Parts Inventory',
  '/inventory/tools': 'Tool Management',
  '/notifications': 'Notifications',
  '/escalations': 'Escalation Management',
};

const Navbar = ({ onOpenMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-[#edf1f7] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Button + Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#334155] hover:bg-[#f4f7fb] hover:text-[#0f172a] transition-colors cursor-pointer"
          aria-label="Open mobile sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg sm:text-[21px] font-extrabold text-[#0f172a] tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 py-1 px-1.5 rounded-full hover:bg-[#f8fafc] transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#0b57d0] text-white font-bold text-xs flex items-center justify-center shadow-[0_4px_10px_rgba(11,87,208,0.22)]">
              RK
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-[13px] font-bold text-[#0f172a] leading-tight">
                Rajesh Kumar
              </span>
              <span className="text-[11px] font-medium text-[#64748b] leading-tight mt-0.5">
                Maintenance Head
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#64748b] ml-0.5" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-[#edf1f7] overflow-hidden z-50">
              <div className="p-4 bg-[#f8fafc] border-b border-[#edf1f7]">
                <p className="text-sm font-bold text-[#0f172a]">Rajesh Kumar</p>
                <p className="text-xs text-[#64748b]">rajesh.kumar@sankogosei.com</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 text-[10.5px] font-bold rounded-md bg-[#0b57d0]/10 text-[#0b57d0]">
                  Plant-1 • Maintenance 4.0
                </span>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#eff4ff] hover:text-[#0b57d0] transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#eff4ff] hover:text-[#0b57d0] transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="p-1.5 border-t border-[#edf1f7]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
