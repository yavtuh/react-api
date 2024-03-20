import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  TextField,
} from '@mui/material';
// components

import { filter } from 'lodash';
import Iconify from '../components/iconify';

// sections

import Scrollbar from '../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import useFetch from '../hooks/useFetch';
import api from '../api/api';

// -------------------------------------------------------------------

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

const FunnelPage = () => {
  const [crms, setCrms] = useState([]);
  const [funnels, setFunnels] = useState([]);

  const [currentFunnelId, setCurrentFunnelId] = useState(null);

  const [open, setOpen] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [tableHead, setTableHead] = useState([]);

  const { isLoading, error, data, refetch, setIsLoading, setError } = useFetch(`api/funnels/`, 'get');

  useEffect(() => {
    if (data) {
      setCrms(data.crms);
      setFunnels(data.data);

      const newTableHead = data.crms.map((crm) => ({
        id: crm.id,
        label: crm.name,
        alignRight: false,
      }));
      newTableHead.unshift({ id: 'name', label: 'Воронка', alignRight: false });
      newTableHead.push({ id: '', label: '', alignRight: false });
      setTableHead(newTableHead);
    }
  }, [data]);

  const handleSettingsChange = (newValue, funnelId, crmId) => {
    setFunnels((prevFunnels) =>
      prevFunnels.map((funnel) => {
        if (funnel.id === funnelId) {
          let updatedSettings = funnel.settings;
          const settingIndex = funnel.settings.findIndex((setting) => setting.crm_id === crmId);
          if (settingIndex >= 0) {
            updatedSettings = [
              ...funnel.settings.slice(0, settingIndex),
              { ...funnel.settings[settingIndex], score: Number(newValue) },
              ...funnel.settings.slice(settingIndex + 1),
            ];
          } else {
            updatedSettings = [...funnel.settings, { id: '', crm_id: crmId, score: Number(newValue) }];
          }

          return { ...funnel, settings: updatedSettings };
        }
        return funnel;
      })
    );
  };

  const handleNameChange = (newValue, funnelId) => {
    console.log(newValue, funnelId);
  };

  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    setCurrentFunnelId(id);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async () => {
    const updateFunnel = funnels.find((funnel) => funnel.id === currentFunnelId);

    if (updateFunnel) {
      updateFunnel.settings = updateFunnel.settings.filter((setting) => setting.score > 0);
      try {
        setIsLoading(true);
        setOpen(null);
        const response = await api.put(`api/funnels/${currentFunnelId}`, updateFunnel);
        if (response) {
          setCrms(response.data.crms);
          setFunnels(response.data.data);

          const newTableHead = data.crms.map((crm) => ({
            id: crm.id,
            label: crm.name,
            alignRight: false,
          }));
          newTableHead.unshift({ id: 'name', label: 'Воронка', alignRight: false });
          newTableHead.push({ id: '', label: '', alignRight: false });
          setTableHead(newTableHead);
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          setError(error.response.data.message);
        } else {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setOpen(null);
      setIsModalOpen(false);
      await api.delete(`api/funnels/${currentFunnelId}`);
      const updateFunnels = funnels.filter(funnel => funnel.id !== currentFunnelId);
      setFunnels(updateFunnels);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - funnels.length) : 0;

  const filteredFunnels = applySortFilter(funnels, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredFunnels.length && !!filterName;

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
        <Stack direction="column" alignItems="center" justifyContent="center" sx={{ height: 'calc(100vh - 200px)' }}>
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
        <title>Воронки</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Воронки
          </Typography>
          <Link to="/dashboard/funnels/create">
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Создать Воронку
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
                  headLabel={tableHead}
                  rowCount={filteredFunnels.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredFunnels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, settings } = row;
                    const selectedCrm = selected.indexOf(id) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedCrm}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedCrm} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <TextField
                              name={`name-${id}`}
                              variant="outlined"
                              value={name}
                              type="text"
                              fullWidth
                              onChange={(event) => handleNameChange(event.target.value, id)}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Stack>
                        </TableCell>
                        {crms.map((crm) => {
                          const settingsCrm = settings.find((setting) => setting.crm_id === crm.id);

                          return (
                            <TableCell key={crm.id} sx={{ minWidth: 100 }} component="th" scope="row" padding="normal">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {settingsCrm ? (
                                    <TextField
                                      name={`${crm.id}`}
                                      variant="outlined"
                                      value={settingsCrm.score}
                                      type="number"
                                      fullWidth
                                      onChange={(event) => handleSettingsChange(event.target.value, id, crm.id)}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  ) : (
                                    <TextField
                                      name={`${crm.id}`}
                                      variant="outlined"
                                      value="0"
                                      type="number"
                                      fullWidth
                                      onChange={(event) => handleSettingsChange(event.target.value, id, crm.id)}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  )}
                                </Typography>
                              </Stack>
                            </TableCell>
                          );
                        })}

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
                      <TableCell align="center" colSpan={crms.length + 2} sx={{ py: 3 }}>
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
            count={funnels.length}
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
          <MenuItem onClick={handleUpdate}>
            <Iconify icon={'eva:settings-fill'} sx={{ mr: 2 }} />
            Обновить
          </MenuItem>
          <MenuItem onClick={handleOpenModal} sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Удалить
          </MenuItem>
        </Popover>
        <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md">
          <DialogTitle id="alert-dialog-title">{'Вы уверены, что хотите удалить Воронку?'}</DialogTitle>
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
};

export default FunnelPage;
