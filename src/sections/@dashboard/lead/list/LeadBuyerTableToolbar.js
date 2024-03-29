import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Button, Tooltip, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

LeadBuyerTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterName: PropTypes.func,
  filterUtm: PropTypes.string,
  onFilterUtm: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  handleApplyFilter: PropTypes.func,
  showFilter: PropTypes.bool,
  setShowFilter: PropTypes.func,
  handleResetFilter: PropTypes.func,
  filterSendStartDate: PropTypes.instanceOf(Date),
  filterSendEndDate: PropTypes.instanceOf(Date),
  onFilterSendStartDate: PropTypes.func,
  onFilterSendEndDate: PropTypes.func,
  filterLeadStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  filterSentStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterLeadStatus: PropTypes.func,
  optionsLeadStatuses: PropTypes.array,
  filterSentResult: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterSentStatus: PropTypes.func,
  optionsSentStatuses: PropTypes.array,
  optionsSentResult: PropTypes.array,
  onFilterDomain: PropTypes.func,
  filterDomain: PropTypes.string,
  onFilterSentResult: PropTypes.func,
  onUpdateLeads: PropTypes.func
};
export default function LeadBuyerTableToolbar({
  filterStartDate,
  filterEndDate,
  filterName,
  onFilterName,
  filterUtm,
  onFilterUtm,
  onFilterStartDate,
  onFilterEndDate,
  handleApplyFilter,
  showFilter,
  setShowFilter,
  handleResetFilter,
  filterSendStartDate,
  filterSendEndDate,
  onFilterSendStartDate,
  onFilterSendEndDate,
  filterLeadStatus,
  onFilterLeadStatus,
  optionsLeadStatuses,
  filterSentStatus,
  onFilterSentStatus,
  optionsSentStatuses,
  filterDomain,
  onFilterDomain,
  filterSentResult,
  optionsSentResult,
  onFilterSentResult,
  onUpdateLeads
}) {
  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ display: 'flex', justifyContent: 'end', py: 2.5, px: 3 }}
      >
        <Tooltip title="Фильтр">
          <IconButton onClick={() => setShowFilter(!showFilter)}>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      </Stack>
      {showFilter && (
        <>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ display: 'flex', py: 2.5, px: 3 }}>
            <DatePicker
              label="Дата получения От"
              value={filterStartDate}
              sx={{ width: '100%' }}
              onChange={onFilterStartDate}
            />

            <DatePicker
              label="Дата получения До"
              sx={{ width: '100%' }}
              value={filterEndDate}
              onChange={onFilterEndDate}
            />

            <DatePicker
              label="Дата отправки От"
              value={filterSendStartDate}
              sx={{ width: '100%' }}
              onChange={onFilterSendStartDate}
            />

            <DatePicker
              label="Дата отправки До"
              value={filterSendEndDate}
              sx={{ width: '100%' }}
              onChange={onFilterSendEndDate}
            />
          </Stack>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ display: 'flex', py: 2.5, px: 3 }}>
          <TextField
              fullWidth
              value={filterUtm}
              onChange={(event) => onFilterUtm(event.target.value)}
              placeholder="UTM"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              label="Статус Лида"
              value={filterLeadStatus}
              onChange={onFilterLeadStatus}
              SelectProps={{
                MenuProps: {
                  sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                },
              }}
              sx={{
                textTransform: 'capitalize',
              }}
            >
              <MenuItem
                value="Все"
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                Все
              </MenuItem>
              {optionsLeadStatuses.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Статус Отправки"
              value={filterSentStatus}
              onChange={onFilterSentStatus}
              SelectProps={{
                MenuProps: {
                  sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                },
              }}
              sx={{
                textTransform: 'capitalize',
              }}
            >
              <MenuItem
                value="Все"
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                Все
              </MenuItem>
              {optionsSentStatuses.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ display: 'flex', py: 2.5, px: 3 }}>
            <TextField
              fullWidth
              value={filterName}
              onChange={(event) => onFilterName(event.target.value)}
              placeholder="Почта, Имя"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              value={filterDomain}
              onChange={(event) => onFilterDomain(event.target.value)}
              placeholder="Домен"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            
            <TextField
              fullWidth
              select
              label="Результат Отправки"
              value={filterSentResult}
              onChange={onFilterSentResult}
              SelectProps={{
                MenuProps: {
                  sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                },
              }}
              sx={{
                textTransform: 'capitalize',
              }}
            >
              <MenuItem
                value="Все"
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                Все
              </MenuItem>
              {optionsSentResult.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack
            spacing={1}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ py: 2.5, px: 3, display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              sx={{
                backgroundColor: 'grey.400',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'grey.500',
                },
              }}
              onClick={handleResetFilter}
              variant="contained"
            >
              Сбросить
            </Button>
            <Button
              
              onClick={onUpdateLeads}
              variant="contained"
            >
              Обновить
            </Button>
            <Button onClick={handleApplyFilter} variant="contained">
              Применить
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}
