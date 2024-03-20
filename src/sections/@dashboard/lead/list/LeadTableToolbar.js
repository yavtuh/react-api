import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem, Button, Tooltip, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

LeadTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  onFilterName: PropTypes.func,
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
  filterFunnel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterFunnel: PropTypes.func,
  optionsFunnel: PropTypes.array,
  filterBuyer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterBuyer: PropTypes.func,
  optionsBuyer: PropTypes.array,
  filterCrm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterCrm: PropTypes.func,
  optionsCrm: PropTypes.array,
  filterLeadStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterLeadStatus: PropTypes.func,
  optionsLeadStatuses: PropTypes.array,
  filterSentStatus: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFilterSentStatus: PropTypes.func,
  optionsSentStatuses: PropTypes.array,
  onFilterDomain: PropTypes.func,
  filterDomain: PropTypes.string,
};
export default function LeadTableToolbar({
  optionsFunnel,
  filterStartDate,
  filterEndDate,
  filterName,
  onFilterName,
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
  filterFunnel,
  onFilterFunnel,
  filterBuyer,
  onFilterBuyer,
  optionsBuyer,
  filterCrm,
  onFilterCrm,
  optionsCrm,
  filterLeadStatus,
  onFilterLeadStatus,
  optionsLeadStatuses,
  filterSentStatus,
  onFilterSentStatus,
  optionsSentStatuses,
  filterDomain,
  onFilterDomain,
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
              select
              label="Воронка"
              value={filterFunnel}
              onChange={onFilterFunnel}
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
              {optionsFunnel.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Арбитражник"
              value={filterBuyer}
              onChange={onFilterBuyer}
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
              {optionsBuyer.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {option.name}
                </MenuItem>
              ))}
            </TextField>

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
              placeholder="Телефон, Почта, Имя"
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
              label="Crm"
              value={filterCrm}
              onChange={onFilterCrm}
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
              {optionsCrm.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {option.name}
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
            <Button onClick={handleApplyFilter} variant="contained">
              Применить
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}
