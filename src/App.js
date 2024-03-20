import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

// routes
import Router from './routes';
// theme

import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { AuthProvider } from './contexts/AuthContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <AuthProvider>
            <Router />
          </AuthProvider>
        </ThemeProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
