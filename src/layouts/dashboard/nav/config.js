// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    roles: ['admin', 'buyer'],
  },
  {
    title: 'Лиды',
    path: '/dashboard/leads',
    icon: icon('ic_user'),
    roles: ['admin', 'buyer'],
  },
  {
    title: 'Арбитражники',
    path: '/dashboard/users',
    icon: icon('ic_user'),
    roles: ['admin'],
  },
  {
    title: 'Воронки',
    path: '/dashboard/funnels',
    icon: icon('ic_tour'),
    roles: ['admin'],
  },
  {
    title: 'Crm',
    path: '/dashboard/crms',
    icon: icon('ic_crm'),
    roles: ['admin'],
  },
];

export default navConfig;
