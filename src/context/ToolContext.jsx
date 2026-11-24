import { createContext, useContext, useState, useEffect } from 'react';
import { toolService } from '../features/tools/toolService';

const ToolContext = createContext(null);

export const ToolProvider = ({ children }) => {
  const [tools, setTools] = useState(() => toolService.getAll());

  useEffect(() => {
    toolService.saveAll(tools);
  }, [tools]);

  const addTool = (newTool) => {
    setTools((prev) => [newTool, ...prev]);
  };

  const updateTool = (toolId, updatedFields) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.toolId === toolId ? { ...tool, ...updatedFields } : tool
      )
    );
  };

  return (
    <ToolContext.Provider value={{ tools, addTool, updateTool }}>
      {children}
    </ToolContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTools = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useTools must be used within a ToolProvider');
  }
  return context;
};
