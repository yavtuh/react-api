import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { startOfDay, format } from 'date-fns';

import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Divider,
  TableBody,
  Container,
  TableContainer,
  CircularProgress,
  Typography,
 
} from '@mui/material';

import useTable from '../hooks/useTable';

import Scrollbar from '../components/scrollbar';
import BuyerTableHeadCustom from '../components/table/BuyerTableHeadCustom';
import { TableNoData } from '../components/table';
import LeadBuyerTableRow from '../sections/@dashboard/lead/list/LeadBuyerTableRow';
import LeadBuyerTableToolbar from '../sections/@dashboard/lead/list/LeadBuyerTableToolbar';
import useFetch from '../hooks/useFetch';
import LeadTablePagination from '../sections/@dashboard/lead/list/LeadTablePagination';

import api from '../api/api';




const TABLE_HEAD = [
  { id: 'firstName', label: 'Имя', align: 'left' },
  { id: 'lastName', label: 'Фамилия', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'domain', label: 'Домен', align: 'left' },
  { id: 'utm', label: 'UTM', align: 'left' , width: 140 },
  { id: 'leadStatus', label: 'Статус Лида', align: 'left' },
  { id: 'sendStatus', label: 'Статус Отправки', align: 'left' },
  { id: 'sendResult', label: 'Результат Отправки', align: 'left' },
  { id: 'sendDate', label: 'Дата Отправки', align: 'left' },
  { id: 'createdAt', label: 'Дата Создания', align: 'left' },
];

const LeadBuyerPage = () => {
  const { isLoading, error, data, setIsLoading, setError, refetch } = useFetch(`api/leads`, 'get');

  const [tableData, setTableData] = useState([]);

  const [metaData, setMetaData] = useState({});

  const [leadStatuses, setLeadStatuses] = useState([]);

  const [sentStatuses, setSentStatuses] = useState([]);

  const [sentResult, setSentResult] = useState([]);

  const initialFilter = {
    filterName: '',
    filterUtm: '',
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


  const {
    page,
    setPage,
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

  const handleFilterUtm = (filterUtm) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterUtm,
    }));
  };

  const handleFilterDomain = (filterDomain) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      filterDomain,
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
    (!tableData.length && !!filterParams.filterUtm) ||
    (!tableData.length && !!filterParams.filterLeadStatus) ||
    (!tableData.length && !!filterParams.filterSentStatus) ||
    (!tableData.length && !!filterParams.filterSentResult) ||
    (!tableData.length && !!filterParams.filterEndDate) ||
    (!tableData.length && !!filterParams.filterStartDate) ||
    (!tableData.length && !!filterParams.filterSendStartDate) ||
    (!tableData.length && !!filterParams.filterDomain) ||
    (!tableData.length && !!filterParams.filterSendEndDate);

  const fetchData = async ({
    filterName,
    filterUtm,
    filterEndDate,
    filterStartDate,
    page,
    filterSentStatus,
    filterSendStartDate,
    filterSendEndDate,
    filterLeadStatus,
    filterSentResult,
    filterDomain,
  }) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page,
        search: filterName,
        utm: filterUtm,
        domain: filterDomain,
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

  const fetchFilterData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`api/leads/filterData`);
      setLeadStatuses(response.data.leadStatuses);
      setSentStatuses(response.data.sentStatuses);
      setSentResult(response.data.sendResult);
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
          <LeadBuyerTableToolbar
            filterName={filterParams.filterName}
            filterUtm={filterParams.filterUtm}
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
              
              <Table size={'small'}>
                <BuyerTableHeadCustom
                  headLabel={TABLE_HEAD}
                />

                <TableBody>
                  {tableData.map((row) => (
                    <LeadBuyerTableRow
                      key={row.id}
                      row={row}
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
      </Container>
    </>
  );
};

export default LeadBuyerPage;
