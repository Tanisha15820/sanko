import { BrowserRouter } from 'react-router-dom';
import { BASE_URL } from './config';
import AppProviders from './context/AppProviders';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppProviders>
      <BrowserRouter basename={BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
