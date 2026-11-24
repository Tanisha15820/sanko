import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Cpu,
  Activity,
  AlertTriangle,
  Factory,
  BarChart3,
  ClipboardList,
  ShieldCheck,
  Calendar,
  History,
  Boxes,
  Package,
  Wrench,
  Users,
  KeyRound,
  FileText,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  LogOut,
  X,
} from 'lucide-react';
import sankoLogo from '../../assets/images/sanko-logo.png';
import loginLogo from '../../assets/images/login-logo.png';
import { useAuth } from '../../context/AuthContext';

const mainMenus = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutGrid,
    permission: 'dashboard.view',
  },
  {
    id: 'machine-management',
    name: 'Machine Management',
    icon: Cpu,
    subMenus: [
      {
        name: 'Machine Status',
        path: '/machines',
        icon: Activity,
        permission: 'machines.view_status',
      },
      {
        name: 'Breakdown Management',
        path: '/breakdowns',
        icon: AlertTriangle,
        permission: 'breakdowns.view',
      },
      {
        name: 'RCA Management',
        path: '/breakdowns/rca',
        icon: FileText,
        permission: 'breakdowns.submit_rca',
      },
    ],
  },
  {
    id: 'production',
    name: 'Production',
    icon: Factory,
    subMenus: [
      {
        name: 'Production Plan',
        path: '/production/plan',
        icon: ClipboardList,
        permission: 'production.view_plan',
      },
      {
        name: 'Production Monitoring',
        path: '/production',
        icon: BarChart3,
        permission: 'production.view_monitoring',
      },
    ],
  },
  {
    id: 'preventive-maintenance',
    name: 'Preventive Maintenance',
    icon: ShieldCheck,
    subMenus: [
      {
        name: 'PM Calendar',
        path: '/pm/calendar',
        icon: Calendar,
        permission: 'pm.view_calendar',
      },
      {
        name: 'PM History',
        path: '/pm/history',
        icon: History,
        permission: 'pm.view_history',
      },
      {
        name: 'PM Failure Review',
        path: '/pm/failure-review',
        icon: ShieldCheck,
        permission: 'admin.manage_users',
      },
    ],
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management',
    icon: Boxes,
    subMenus: [
      {
        name: 'Spare Parts Inventory',
        path: '/inventory/spare-parts',
        icon: Package,
        permission: 'inventory.view_spare_parts',
      },
      {
        name: 'Tool Management',
        path: '/inventory/tools',
        icon: Wrench,
        permission: 'inventory.view_tools',
      },
    ],
  },
  {
    id: 'user-management',
    name: 'User Management',
    path: '/admin/users',
    icon: Users,
    permission: 'admin.manage_users',
  },
  {
    id: 'roles-permissions',
    name: 'Roles & Permissions',
    path: '/admin/roles',
    icon: KeyRound,
    permission: 'admin.manage_roles',
  },
];

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission, logout } = useAuth();

  const handleLogout = () => {
    setIsMobileOpen(false);
    logout();
    navigate('/login');
  };

  const visibleMenus = mainMenus
    .map((menu) => {
      if (menu.subMenus) {
        const allowedSubMenus = menu.subMenus.filter((sub) =>
          hasPermission(sub.permission)
        );
        return allowedSubMenus.length > 0
          ? { ...menu, subMenus: allowedSubMenus }
          : null;
      }
      return hasPermission(menu.permission) ? menu : null;
    })
    .filter(Boolean);

  const activeParentId =
    visibleMenus.find(
      (menu) =>
        menu.subMenus &&
        menu.subMenus.some((sub) => location.pathname === sub.path)
    )?.id || null;

  const [menuSelection, setMenuSelection] = useState({
    pathname: location.pathname,
    menuId: activeParentId,
  });

  const expandedMenu =
    menuSelection.pathname === location.pathname
      ? menuSelection.menuId
      : activeParentId;

  const setExpandedMenu = (next) => {
    setMenuSelection((prev) => {
      const current = prev.pathname === location.pathname ? prev.menuId : activeParentId;
      const nextId = typeof next === 'function' ? next(current) : next;
      return { pathname: location.pathname, menuId: nextId };
    });
  };

  // Toggle accordion Main Menu (only one expanded at a time)
  const handleMainMenuClick = (menuId) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedMenu(menuId);
      return;
    }
    setExpandedMenu((prev) => (prev === menuId ? null : menuId));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0f172a]/35 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-[#edf1f7] flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-68'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Brand / Logo Section with Toggle UI on the right side of Logo */}
        <div
          className={`h-22 flex items-center border-b border-[#f1f5f9] shrink-0 ${
            isCollapsed ? 'px-2 justify-center gap-1' : 'px-3.5 justify-between gap-2'
          }`}
        >
          {!isCollapsed ? (
            <div className="flex items-center overflow-hidden flex-1">
              <img
                src={sankoLogo}
                alt="Sanko Gosei Ltd."
                className="h-14 w-full max-w-[215px] object-contain object-left mix-blend-multiply"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              title="Expand Sidebar"
              className="flex items-center justify-center cursor-pointer"
            >
              <img
                src={loginLogo}
                alt="Sanko Gosei"
                className="w-11 h-11 object-contain mix-blend-multiply"
              />
            </button>
          )}

          {/* Desktop Toggle Button on the right side of Logo (Hidden when collapsed) */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0b57d0] hover:border-[#cbd5e1] shadow-2xs transition-all cursor-pointer shrink-0"
              aria-label="Collapse sidebar"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={2.2} />
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accordion Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3.5">
          <ul className="space-y-1.5">
            {visibleMenus.map((menu) => {
              const Icon = menu.icon;
              const hasSubMenus = Boolean(menu.subMenus && menu.subMenus.length > 0);
              const isExpanded = expandedMenu === menu.id;
              const isParentActive =
                hasSubMenus &&
                menu.subMenus.some((sub) => location.pathname === sub.path);

              // Direct navigation item (Dashboard)
              if (!hasSubMenus) {
                return (
                  <li key={menu.id}>
                    <NavLink
                      to={menu.path}
                      onClick={() => {
                        setExpandedMenu(null);
                        setIsMobileOpen(false);
                      }}
                      title={isCollapsed ? menu.name : ''}
                      className={({ isActive }) =>
                        `group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all ${
                          isCollapsed ? 'justify-center' : ''
                        } ${
                          isActive
                            ? 'bg-[#0b57d0] text-white font-semibold shadow-[0_6px_16px_rgba(11,87,208,0.25)]'
                            : 'text-[#334155] font-medium hover:bg-[#f4f7fb] hover:text-[#0f172a]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                              isActive
                                ? 'text-white'
                                : 'text-[#475569] group-hover:text-[#0f172a]'
                            }`}
                          />
                          {!isCollapsed && <span className="truncate">{menu.name}</span>}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              }

              // Expandable Accordion Main Menu
              return (
                <li key={menu.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleMainMenuClick(menu.id)}
                    title={isCollapsed ? menu.name : ''}
                    className={`w-full group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all cursor-pointer ${
                      isCollapsed ? 'justify-center' : ''
                    } ${
                      isParentActive
                        ? 'bg-[#0b57d0] text-white font-semibold shadow-[0_6px_16px_rgba(11,87,208,0.25)]'
                        : isExpanded
                          ? 'bg-[#eef4ff] text-[#0b57d0] font-semibold'
                          : 'text-[#334155] font-medium hover:bg-[#f4f7fb] hover:text-[#0f172a]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                          isParentActive
                            ? 'text-white'
                            : isExpanded
                              ? 'text-[#0b57d0]'
                              : 'text-[#475569] group-hover:text-[#0f172a]'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{menu.name}</span>}
                    </div>

                    {!isCollapsed && (
                      <span className="shrink-0">
                        {isExpanded ? (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isParentActive ? 'text-white' : 'text-[#0b57d0]'
                            }`}
                          />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#475569] transition-transform duration-200" />
                        )}
                      </span>
                    )}
                  </button>

                  {/* Animated Expandable Sub-Menus */}
                  {!isCollapsed && (
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isExpanded
                          ? 'grid-rows-[1fr] opacity-100 mt-1'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="ml-5 pl-3 border-l-2 border-[#e2e8f0] space-y-1 py-0.5">
                          {menu.subMenus.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <li key={sub.path}>
                                <NavLink
                                  to={sub.path}
                                  end
                                  onClick={() => setIsMobileOpen(false)}
                                  className={({ isActive }) =>
                                    `group flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all ${
                                      isActive
                                        ? 'bg-[#eef4ff] text-[#0b57d0] font-bold'
                                        : 'text-[#64748b] font-medium hover:bg-[#f8fafc] hover:text-[#0f172a]'
                                    }`
                                  }
                                >
                                  {({ isActive }) => (
                                    <>
                                      <SubIcon
                                        className={`w-4 h-4 shrink-0 transition-colors ${
                                          isActive
                                            ? 'text-[#0b57d0]'
                                            : 'text-[#94a3b8] group-hover:text-[#475569]'
                                        }`}
                                      />
                                      <span className="truncate">{sub.name}</span>
                                    </>
                                  )}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Logout Section */}
        <div className="p-3.5 border-t border-[#f1f5f9] shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : ''}
            className={`w-full group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!isCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
