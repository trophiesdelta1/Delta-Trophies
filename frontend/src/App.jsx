import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
