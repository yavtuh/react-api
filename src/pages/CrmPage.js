import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  CircularProgress,
} from '@mui/material';
// components
import { filter } from 'lodash';
import Iconify from '../components/iconify';
// sections
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import Label from '../components/label';
import useFetch from '../hooks/useFetch';
import api from '../api/api';

// -------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'name', label: 'Название', alignRight: false },
  { id: 'working_days', label: 'Рабочие дни', alignRight: false },
  { id: 'working_hours', label: 'Рабочее время', alignRight: false },
  { id: 'daily_cap', label: 'Кап', alignRight: false },
  { id: 'is_active', label: 'Статус', alignRight: false },
  { id: '' },
];

const DAYS = {
  0: 'Воскресенье',
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Субота',
};
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
// ----------------------------------------------------------------------

export default function CrmPage() {
  const [crms, setCrms] = useState([]);

  const [currentCrmId, setCurrentCrmId] = useState(null);

  const [open, setOpen] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const { isLoading, error, data, setIsLoading, setError, refetch } = useFetch(`api/crms/`, 'get');

  useEffect(() => {
    if (data) {
      setCrms(data.data);
    }
  }, [data]);

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    setCurrentCrmId(id);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = crms.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSettings = () => {
    navigate(`/dashboard/crms/${currentCrmId}/edit/settings`);
  };

  const handleCreate = () => {
    navigate(`/dashboard/crms/${currentCrmId}/edit/create`);
  };

  const handleStatus = () => {
    navigate(`/dashboard/crms/${currentCrmId}/edit/status`);
  };

  const handleHeader = () => {
    navigate(`/dashboard/crms/${currentCrmId}/edit/header`);
  };

  const handleResponse = () => {
    navigate(`/dashboard/crms/${currentCrmId}/edit/response`);
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setOpen(null);
      setIsModalOpen(false);
      await api.delete(`api/crms/${currentCrmId}`);
      const updateCrms = crms.filter((crm) => crm.id !== currentCrmId);
      setCrms(updateCrms);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - crms.length) : 0;

  const filteredCrms = applySortFilter(crms, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredCrms.length && !!filterName;

  if (isLoading) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: 'calc(100vh - 200px)' }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: 'calc(100vh - 200px)' }}>
          <Typography variant="subtitle2" noWrap>
            {error}
          </Typography>
          <Button onClick={refetch}>Обновить</Button>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title> Crm</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Crm
          </Typography>
          <Link to="/dashboard/crms/create">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New Crm
            </Button>
          </Link>
        </Stack>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={crms.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCrms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, settings } = row;
                    const selectedCrm = selected.indexOf(id) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedCrm}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedCrm} onChange={(event) => handleClick(event, id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        {settings && (
                          <>
                            <TableCell align="left">
                              {settings.working_days.map((day) => DAYS[day]).join(', ')}
                            </TableCell>

                            <TableCell align="left">
                              {settings.working_hours_start} || {settings.working_hours_end}
                            </TableCell>

                            <TableCell align="left">{settings.daily_cap}</TableCell>
                            <TableCell align="left">
                              <Label color={settings.is_active ? 'success' : 'error'}>
                                {settings.is_active ? 'Активный' : 'Неактивный'}
                              </Label>
                            </TableCell>
                          </>
                        )}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event, id)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={crms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 200,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem onClick={handleSettings}>
            <Iconify icon={'eva:settings-fill'} sx={{ mr: 2 }} />
            Настройки
          </MenuItem>
          <MenuItem onClick={handleCreate}>
            <Iconify icon={'eva:plus-circle-outline'} sx={{ mr: 2 }} />
            Создание Лида
          </MenuItem>
          <MenuItem onClick={handleResponse}>
            <Iconify icon={'eva:flip-2-outline'} sx={{ mr: 2 }} />
            Ответ Срм
          </MenuItem>
          <MenuItem onClick={handleStatus}>
            <Iconify icon={'eva:bar-chart-fill'} sx={{ mr: 2 }} />
            Статус Лида
          </MenuItem>
          <MenuItem onClick={handleHeader}>
            <Iconify icon={'eva:file-text-outline'} sx={{ mr: 2 }} />
            Заголовок Лида
          </MenuItem>

          <MenuItem onClick={handleOpenModal} sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Удалить
          </MenuItem>
        </Popover>
        <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md">
          <DialogTitle id="alert-dialog-title">{'Вы уверены, что хотите удалить Crm?'}</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseModal}>Нет</Button>
            <Button onClick={handleDelete} autoFocus>
              Да
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
