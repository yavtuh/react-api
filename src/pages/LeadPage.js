import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { startOfDay, format } from 'date-fns';

import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { JSONTree } from 'react-json-tree';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import useTable from '../hooks/useTable';

import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

import { TableHeadCustom, TableNoData, TableSelectedActions } from '../components/table';
import { LeadTableRow, LeadTableToolbar } from '../sections/@dashboard/lead/list';
import useFetch from '../hooks/useFetch';
import LeadTablePagination from '../sections/@dashboard/lead/list/LeadTablePagination';

import api from '../api/api';

const TABLE_HEAD = [
  { id: 'firstName', label: 'Имя', align: 'left' },
  { id: 'lastName', label: 'Фамилия', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Телефон', align: 'left', width: 140 },
  { id: 'crm', label: 'Crm', align: 'left', width: 140 },
  { id: 'user', label: 'Арбитражник', align: 'left' },
  { id: 'funnel', label: 'Воронка', align: 'left' },
  { id: 'domain', label: 'Домен', align: 'left' },
  { id: 'extra', label: 'Доп Данные', align: 'left', width: 140  },
  { id: 'userAgent', label: 'userAgent', align: 'left' },
  { id: 'utm', label: 'UTM', align: 'left' , width: 140 },
  { id: 'country', label: 'Страна', align: 'left' },
  { id: 'ip', label: 'IP', align: 'left' },
  { id: 'leadStatus', label: 'Статус Лида', align: 'left' },
  { id: 'sendStatus', label: 'Статус Отправки', align: 'left' },
  { id: 'sendResult', label: 'Результат Отправки', align: 'left' },
  { id: 'sentCrms', label: 'Отправленные Срм', align: 'left' },
  { id: 'sendDate', label: 'Дата Отправки', align: 'left' },
  { id: 'createdAt', label: 'Дата Создания', align: 'left' },
  { id: '' },
];

const LeadPage = () => {
  const { isLoading, error, data, setIsLoading, setError, refetch } = useFetch(`api/leads`, 'get');

  const [tableData, setTableData] = useState([]);

  const [metaData, setMetaData] = useState({});

  const [funnels, setFunnels] = useState([]);

  const [buyers, setBuyers] = useState([]);

  const [crms, setCrms] = useState([]);

  const [leadStatuses, setLeadStatuses] = useState([]);

  const [sentStatuses, setSentStatuses] = useState([]);

  const [sentResult, setSentResult] = useState([]);

  const initialFilter = {
    filterName: '',
    filteUtm: '',
    filterFunnel: 'Все',
    filterCrm: 'Все',
    filterBuyer: 'Все',
    filterLeadStatus: 'Все',
    filterSentStatus: 'Все',
    filterSentResult: 'Все',
    filterStartDate: null,
    filterEndDate: null,
    filterSendStartDate: null,
    filterSendEndDate: null,
    filterDomain: '',
  };

  const [filterParams, setFilterParams] = useState(initialFilter);

  const [showFilter, setShowFilter] = useState(false);

  const [isResponseOpen, setIsResponseOpen] = useState(false);

  const [crmResponseData, setCrmResponseData] = useState(null);

  const [isSentOpen, setIsSentOpen] = useState(false);

  const {
    dense,
    page,
    order,
    orderBy,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
  } = useTable({ defaultOrderBy: 'createdAt' });

  useEffect(() => {
    if (data) {
      updateData(data);
    }
  }, [data]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const updateData = (data) => {
    setTableData(data.data);
    setMetaData(data.meta);
  };

  const onChangePage = (event, newPage) => {
    setPage(newPage);
    fetchData({
      ...filterParams,
      page: newPage,
    });
  };

  const handleFilterName = (filterName) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterName,
    }));
  };

  const handleFilterUtm = (filteUtm) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filteUtm,
    }));
  };

  const handleFilterDomain = (filterDomain) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterDomain,
    }));
  };

  const handleFilterFunnel = (event) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterFunnel: event.target.value,
    }));
  };

  const handleFilterCrm = (event) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterCrm: event.target.value,
    }));
  };

  const handleFilterBuyer = (event) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterBuyer: event.target.value,
    }));
  };

  const handleFilterLeadStatus = (event) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterLeadStatus: event.target.value,
    }));
  };
  
  const handleFilterSentStatus = (event) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterSentStatus: event.target.value,
    }));
  };

  const handleFilterSentResult = (event) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterSentResult: event.target.value,
    }));
  };

  const handleDeleteRow = (id) => {
    fetchDelete([id]);
    setSelected([]);
  };

  const handleDeleteRows = (selected) => {
    fetchDelete(selected);
    setSelected([]);
  };

  const handleSendRows = (selected) => {
    setIsSentOpen(true);
  };

  const handleViewRow = (id) => {
    fetchShow(id);
  };

  const handleResetFilter = () => {
    setFilterParams(initialFilter);
    setPage(1);
    fetchData({
      ...initialFilter,
      page: 1,
    });
  };

  const handleApplyFilter = () => {
    setPage(1);
    fetchData({
      ...filterParams,
      page: 1,
    });
  };

  const updateLeads = () => {
    fetchData({
      ...filterParams,
      page,
    });
  }
  
  const isNotFound =
    (!tableData.length && !!filterParams.filterName) ||
    (!tableData.length && !!filterParams.filteUtm) ||
    (!tableData.length && !!filterParams.filterFunnel) ||
    (!tableData.length && !!filterParams.filterBuyer) ||
    (!tableData.length && !!filterParams.filterLeadStatus) ||
    (!tableData.length && !!filterParams.filterSentStatus) ||
    (!tableData.length && !!filterParams.filterSentResult) ||
    (!tableData.length && !!filterParams.filterEndDate) ||
    (!tableData.length && !!filterParams.filterStartDate) ||
    (!tableData.length && !!filterParams.filterSendStartDate) ||
    (!tableData.length && !!filterParams.filterDomain) ||
    (!tableData.length && !!filterParams.filterCrm) ||
    (!tableData.length && !!filterParams.filterSendEndDate);
    
  const fetchData = async ({
    filterName,
    filteUtm,
    filterFunnel,
    filterEndDate,
    filterStartDate,
    page,
    filterSentStatus,
    filterSendStartDate,
    filterSendEndDate,
    filterBuyer,
    filterLeadStatus,
    filterSentResult,
    filterDomain,
    filterCrm,
  }) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page,
        search: filterName,
        utm: filteUtm,
        domain: filterDomain,
        funnel: filterFunnel === 'Все' ? '' : filterFunnel,
        crm: filterCrm === 'Все' ? '' : filterCrm,
        buyer: filterBuyer === 'Все' ? '' : filterBuyer,
        leadStatus: filterLeadStatus === 'Все' ? '' : filterLeadStatus,
        sentStatus: filterSentStatus === 'Все' ? '' : filterSentStatus,
        sentResult: filterSentResult === 'Все' ? '' : filterSentResult,
        startDate: filterStartDate ? format(filterStartDate, 'yyyy-MM-dd') : '',
        endDate: filterEndDate ? format(filterEndDate, 'yyyy-MM-dd') : '',
        sendStartDate: filterSendStartDate ? format(filterSendStartDate, 'yyyy-MM-dd') : '',
        sendEndDate: filterSendEndDate ? format(filterSendEndDate, 'yyyy-MM-dd') : '',
      }).toString();
      const leads = await api.get(`api/leads?${queryParams}`);
      updateData(leads.data);
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

  const fetchShow = async (id) => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/leads/${id}`);
      setCrmResponseData(response.data);
      setIsResponseOpen(true);
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

  const fetchDelete = async (ids) => {
    try {
      setIsLoading(true);
      await api.delete(`api/leads`, { data: { ids } });
      fetchData({
        ...filterParams,
        page,
      });
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

  const fetchFilterData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/leads/filterData`);
      setFunnels(response.data.funnels);
      setBuyers(response.data.buyers);
      setLeadStatuses(response.data.leadStatuses);
      setSentStatuses(response.data.sentStatuses);
      setSentResult(response.data.sendResult);
      setCrms(response.data.crms);
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

  const fetchSentLeads = async (values) => {
    try {
      values.leads = selected;
      await api.post(`api/leads/sent`, values);
      setIsSentOpen(false);
      setSelected([]);
      fetchData({
        ...filterParams,
        page,
      });
      return null;
    } catch (error) {
      if (error.response && error.response.status === 422) {
        return error.response.data.errors;
      }
      setError(error.response.data.error);
      return null;
    }
  };

  const validationSchema = Yup.object().shape({
    sendNow: Yup.boolean(),
    crm: Yup.string().required('Поле обязательно'),
    fromInterval: Yup.number().required('Поле обязательно').min(0, 'Значение не может быть отрицательным'),
    toInterval: Yup.number().required('Поле обязательно').min(0, 'Значение не может быть отрицательным'),
    startDate: Yup.date().when('sendNow', {
      is: (sendNow) => !sendNow,
      then: (schema) =>
        schema.required('Дата начала обязательна').min(new Date(), 'Дата начала не может быть в прошлом'),
      otherwise: (schema) => schema,
    }),
  });

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
        <title> Leads</title>
      </Helmet>
      <Container maxWidth={false}>
        <Card>
          <Divider />
          <LeadTableToolbar
            filterName={filterParams.filterName}
            filterUtm={filterParams.filterUtm}
            filterFunnel={filterParams.filterFunnel}
            filterCrm={filterParams.filterCrm}
            filterBuyer={filterParams.filterBuyer}
            filterLeadStatus={filterParams.filterLeadStatus}
            filterSentStatus={filterParams.filterSentStatus}
            filterSentResult={filterParams.filterSentResult}
            filterStartDate={filterParams.filterStartDate}
            filterEndDate={filterParams.filterEndDate}
            filterSendStartDate={filterParams.filterSendStartDate}
            filterSendEndDate={filterParams.filterSendEndDate}
            filterDomain={filterParams.filterDomain}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            handleApplyFilter={handleApplyFilter}
            onFilterName={handleFilterName}
            onFilterUtm={handleFilterUtm}
            onFilterDomain={handleFilterDomain}
            onFilterFunnel={handleFilterFunnel}
            onFilterCrm={handleFilterCrm}
            onFilterBuyer={handleFilterBuyer}
            onFilterLeadStatus={handleFilterLeadStatus}
            onFilterSentStatus={handleFilterSentStatus}
            onFilterSentResult={handleFilterSentResult}
            onFilterStartDate={(newValue) => {
              const startDate = startOfDay(newValue);
              setFilterParams((prevParams) => ({
                ...prevParams,
                filterStartDate: startDate,
              }));
            }}
            onFilterEndDate={(newValue) => {
              const startDate = startOfDay(newValue);
              setFilterParams((prevParams) => ({
                ...prevParams,
                filterEndDate: startDate,
              }));
            }}
            onFilterSendStartDate={(newValue) => {
              const startDate = startOfDay(newValue);
              setFilterParams((prevParams) => ({
                ...prevParams,
                filterSendStartDate: startDate,
              }));
            }}
            onFilterSendEndDate={(newValue) => {
              const startDate = startOfDay(newValue);
              setFilterParams((prevParams) => ({
                ...prevParams,
                filterSendEndDate: startDate,
              }));
            }}
            optionsFunnel={funnels}
            optionsCrm={crms}
            optionsBuyer={buyers}
            optionsLeadStatuses={leadStatuses}
            optionsSentStatuses={sentStatuses}
            optionsSentResult={sentResult}
            handleResetFilter={handleResetFilter}
            onUpdateLeads={updateLeads}
          />
          {isLoading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2,
              }}
            >
              <CircularProgress />
            </div>
          )}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Отправить">
                        <IconButton color="primary" onClick={() => handleSendRows(selected)}>
                          <Iconify icon={'ic:round-send'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Удалить">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row) => (
                    <LeadTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', paddingBottom: '10px' }}>
            <LeadTablePagination
              currentPage={page}
              lastPage={metaData.last_page || 1}
              onPageChange={onChangePage}
              component="div"
            />
          </Box>
        </Card>
        <Dialog fullWidth open={isResponseOpen} onClose={() => setIsResponseOpen(false)}>
          <DialogTitle>
            Ответ CRM
            <IconButton
              aria-label="close"
              onClick={() => setIsResponseOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Iconify icon="eva:close-fill" width={24} height={24} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <JSONTree data={crmResponseData} />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog fullWidth open={isSentOpen} onClose={() => setIsSentOpen(false)}>
          <DialogTitle>
            Отправить лидов
            <IconButton
              aria-label="close"
              onClick={() => setIsSentOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Iconify icon="eva:close-fill" width={24} height={24} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Formik
              enableReinitialize
              initialValues={{ crm: '', fromInterval: '', toInterval: '', startDate: '', sendNow: false }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                const errors = await fetchSentLeads(values);
                if (errors) {
                  setErrors(errors);
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form>
                  <Stack spacing={3} sx={{ mt: '10px' }}>
                    <Field name="crm">
                      {({ field, form }) => (
                        <FormControl fullWidth>
                          <InputLabel id="crm">Crm</InputLabel>
                          <Select
                            labelId="crm"
                            id="crm"
                            {...field}
                            label="Crm"
                            error={Boolean(form.errors.crm && form.touched.crm)}
                          >
                            {crms.map((crm) => (
                              <MenuItem key={crm.id} value={crm.id}>
                                {crm.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <ErrorMessage name="crm">
                            {(msg) => <FormHelperText error>{msg}</FormHelperText>}
                          </ErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="fromInterval">
                      {({ field, form }) => (
                        <TextField
                          {...field}
                          placeholder="Интервал от(минут)"
                          label="Интервал от(минут)"
                          variant="outlined"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          error={Boolean(form.errors.fromInterval && form.touched.fromInterval)}
                          helperText={
                            form.errors.fromInterval && form.touched.fromInterval ? form.errors.fromInterval : null
                          }
                        />
                      )}
                    </Field>
                    <Field name="toInterval">
                      {({ field, form }) => (
                        <TextField
                          {...field}
                          placeholder="Интервал до(минут)"
                          label="Интервал до(минут)"
                          variant="outlined"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          error={Boolean(form.errors.toInterval && form.touched.toInterval)}
                          helperText={form.errors.toInterval && form.touched.toInterval ? form.errors.toInterval : null}
                        />
                      )}
                    </Field>
                    <FormControlLabel
                      control={
                        <Switch checked={values.sendNow} onChange={(e) => setFieldValue('sendNow', e.target.checked)} />
                      }
                      label="Отправить сейчас?"
                    />
                    {!values.sendNow && (
                      <Field name="startDate">
                        {({ field, form }) => (
                          <TextField
                            {...field}
                            label="Дата начала"
                            variant="outlined"
                            type="datetime-local"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={Boolean(form.errors.startDate && form.touched.startDate)}
                            helperText={form.errors.startDate && form.touched.startDate ? form.errors.startDate : null}
                          />
                        )}
                      </Field>
                    )}
                  </Stack>

                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ my: 2 }}
                    disabled={isSubmitting}
                  >
                    Обновить
                  </LoadingButton>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default LeadPage;
