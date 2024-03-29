import { Navigate, useRoutes } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//


import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import useAuthContext from './contexts/AuthContext';
import CrmPage from './pages/CrmPage';
import CreateCrmPage from './pages/CreateCrmPage';
import UsersPage from './pages/UsersPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';
import EditCrmSettingPage from './pages/EditCrmSettingPage';
import EditCrmCreatePage from './pages/EditCrmCreatePage';
import EditCrmStatusPage from './pages/EditCrmStatusPage';
import EditCrmHeaderPage from './pages/EditCrmHeaderPage';
import FunnelPage from './pages/FunnelPage';
import CreateFunnelPage from './pages/CreateFunnelPage';
import EditCrmResponsePage from './pages/EditCrmResponsePage';
import LeadPage from './pages/LeadPage';
import LeadBuyerPage from './pages/LeadBuyerPage';
// ----------------------------------------------------------------------

function RouteGuard({ children, redirectTo, condition }) {
  const { user, isInitialized } = useAuthContext();

  if (!isInitialized) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
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
  const { isAdmin } = useAuthContext();

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <RouteGuard redirectTo="/login" condition={(user) => !user}>
          <DashboardLayout />
        </RouteGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        {path: 'leads', element: (
          isAdmin() ? <LeadPage/> : <LeadBuyerPage/>
        )},
        {
          path: 'users',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <UsersPage />
            </RouteGuard>
          ),
        },
        {
          path: 'users/create',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <CreateUserPage />
            </RouteGuard>
          ),
        },
        {
          path: 'users/:userId/edit',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <EditUserPage />
            </RouteGuard>
          ),
        },
        {
          path: 'crms',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <CrmPage />
            </RouteGuard>
          ),
        },
        {
          path: 'crms/create',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <CreateCrmPage />
            </RouteGuard>
          ),
        },
        {
          path: 'crms/:crmId/edit/settings',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <EditCrmSettingPage/>
            </RouteGuard>
          ),
        },
        {
          path: 'crms/:crmId/edit/create',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <EditCrmCreatePage/>
            </RouteGuard>
          ),
        },
        {
          path: 'crms/:crmId/edit/status',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <EditCrmStatusPage/>
            </RouteGuard>
          ),
        },
        {
          path: 'crms/:crmId/edit/header',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <EditCrmHeaderPage/>
            </RouteGuard>
          ),
        },
        {
          path: 'crms/:crmId/edit/response',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <EditCrmResponsePage />
            </RouteGuard>
          ),
        },
        {
          path: 'funnels',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <FunnelPage/>
            </RouteGuard>
          ),
        },
        {
          path: 'funnels/create',
          element: (
            <RouteGuard redirectTo="/404" condition={() => !isAdmin()}>
              <CreateFunnelPage/>
            </RouteGuard>
          ),
        },
      ],
    },
    {
      path: 'login',
      element: (
        <RouteGuard redirectTo="/dashboard/app" condition={(user) => user}>
          <LoginPage />
        </RouteGuard>
      ),
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
