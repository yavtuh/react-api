import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';

import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

LeadTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function LeadTableRow({ row, selected, onSelectRow, onViewRow, onDeleteRow }) {
  const theme = useTheme();

  const {
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    crm,
    user,
    funnel,
    domain,
    extra,
    user_agent: userAgent,
    utm,
    country,
    ip,
    lead_status: leadStatus,
    send_status: sendStatus,
    send_result: sendResult,
    sent_crms: sentCrms,
    send_date: sendDate,
    created_at: createdAt,
  } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{firstName}</TableCell>

      <TableCell align="left">{lastName}</TableCell>

      <TableCell align="left">{email}</TableCell>

      <TableCell align="left">{phone}</TableCell>

      <TableCell align="left">{crm}</TableCell>

      <TableCell align="left">{user}</TableCell>

      <TableCell align="left">{funnel}</TableCell>

      <TableCell align="left">{domain}</TableCell>

      <TableCell align="left">{extra}</TableCell>

      <TableCell align="left">{userAgent}</TableCell>

      <TableCell align="left">{utm}</TableCell>

      <TableCell align="left">{country}</TableCell>

      <TableCell align="left">{ip}</TableCell>
      
      <TableCell align="left">{leadStatus}</TableCell>

      <TableCell align="left">{sendStatus}</TableCell>

      <TableCell align="left">{sendResult}</TableCell>

      <TableCell align="left">{sentCrms.length > 0 ? sentCrms.map((name) => <>{name} | </>) : 'Нету'}</TableCell>

      <TableCell align="left">{sendDate}</TableCell>

      <TableCell align="left">{createdAt}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                Ответ от срм
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Удалить
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
