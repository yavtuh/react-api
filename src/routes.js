import { Navigate, useRoutes } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//

import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import useAuthContext from './contexts/AuthContext';
// ----------------------------------------------------------------------


function RouteGuard({ children, redirectTo, condition }) {
  const { user, isInitialized } = useAuthContext();

  if (!isInitialized) {
      return (
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
        >
        <CircularProgress color="inherit" />
      </Backdrop>
    ); 
  }

  if (condition(user)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}


export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <RouteGuard redirectTo="/login" condition={(user) => !user}><DashboardLayout /></RouteGuard>,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <RouteGuard redirectTo="/dashboard/app" condition={(user) => user}><LoginPage /></RouteGuard>,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
