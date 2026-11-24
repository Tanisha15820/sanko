import { createContext, useContext, useState } from 'react';
import { authService } from '../features/auth/authService';
import { initialRoles } from '../features/roles/roleService';

const AuthContext = createContext(null);

const ROLE_PROFILES = {
  Admin: {
    userId: 'RK-001',
    name: 'Rajesh Kumar',
    initials: 'RK',
    role: 'Admin',
    email: 'rajesh.kumar@sankogosei.com',
    plant: 'Plant-1 • Maintenance 4.0',
  },
  Engineer: {
    userId: 'KM-014',
    name: 'Karan Mehta',
    initials: 'KM',
    role: 'Engineer',
    email: 'karan.mehta@sankogosei.com',
    plant: 'Plant-1 • Maintenance Engineering',
  },
  Technician: {
    userId: 'SN-028',
    name: 'Suresh Nair',
    initials: 'SN',
    role: 'Technician',
    email: 'suresh.nair@sankogosei.com',
    plant: 'Plant-1 • Shopfloor Maintenance',
  },
  'Production Engineer': {
    userId: 'PD-019',
    name: 'Priya Deshmukh',
    initials: 'PD',
    role: 'Production Engineer',
    email: 'priya.deshmukh@sankogosei.com',
    plant: 'Plant-1 • Production Control',
  },
};

const getRolePermissions = (roleName) => {
  const matched = initialRoles.find((r) => r.name === roleName);
  return matched ? matched.permissions : initialRoles[0].permissions;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => authService.getSession());
  const [activeRole, setActiveRole] = useState('Admin');

  const login = (credentials) => {
    const nextSession = authService.login(credentials);
    setSession(nextSession);
    return nextSession;
  };

  const logout = () => {
    const nextSession = authService.logout();
    setSession(nextSession);
  };

  const switchRole = (roleName) => {
    if (ROLE_PROFILES[roleName]) {
      setActiveRole(roleName);
    }
  };

  const roleProfile = ROLE_PROFILES[activeRole] || ROLE_PROFILES.Admin;
  const activeUser = session.user
    ? { ...session.user, ...roleProfile }
    : roleProfile;
  const permissions = getRolePermissions(activeRole);
  const hasPermission = (permissionKey) =>
    !permissionKey || permissions.includes(permissionKey);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: session.isAuthenticated,
        user: activeUser,
        activeRole,
        switchRole,
        permissions,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
