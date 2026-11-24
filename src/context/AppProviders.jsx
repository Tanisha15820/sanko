import { AuthProvider } from './AuthContext';
import { MachineProvider } from './MachineContext';
import { ToolProvider } from './ToolContext';
import { InventoryProvider } from './InventoryContext';
import { MaintenanceProvider } from './MaintenanceContext';
import { BreakdownProvider } from './BreakdownContext';

// Composes all shared feature contexts in dependency order
const AppProviders = ({ children }) => (
  <AuthProvider>
    <MachineProvider>
      <ToolProvider>
        <InventoryProvider>
          <MaintenanceProvider>
            <BreakdownProvider>{children}</BreakdownProvider>
          </MaintenanceProvider>
        </InventoryProvider>
      </ToolProvider>
    </MachineProvider>
  </AuthProvider>
);

export default AppProviders;
