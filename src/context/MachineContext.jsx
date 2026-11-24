import { createContext, useContext, useState, useEffect } from 'react';
import { machineService } from '../features/machines/machineService';

const MachineContext = createContext(null);

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState(() => machineService.getAll());

  useEffect(() => {
    machineService.saveAll(machines);
  }, [machines]);

  const addMachine = (newMachine) => {
    setMachines((prev) => [newMachine, ...prev]);
  };

  return (
    <MachineContext.Provider value={{ machines, addMachine }}>
      {children}
    </MachineContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMachines = () => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error('useMachines must be used within a MachineProvider');
  }
  return context;
};
