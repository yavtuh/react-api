import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell } from '@mui/material';
// utils


// ----------------------------------------------------------------------

LeadBuyerTableRow.propTypes = {
  row: PropTypes.object.isRequired,
};

export default function LeadBuyerTableRow({ row}) {

  const {
    first_name: firstName,
    last_name: lastName,
    email,
    domain,
    utm,
    lead_status: leadStatus,
    send_status: sendStatus,
    send_result: sendResult,
    send_date: sendDate,
    created_at: createdAt,
  } = row;

  return (
    <TableRow hover sx={{height: '100px'}}>
      
      <TableCell align="left">{firstName}</TableCell>

      <TableCell align="left">{lastName}</TableCell>

      <TableCell align="left">{email}</TableCell>

      <TableCell align="left">{domain}</TableCell>

      <TableCell align="left" sx={{ maxWidth: '150px', wordWrap: 'break-word', whiteSpace: 'normal' }}>{utm}</TableCell>
      
      <TableCell align="left">{leadStatus}</TableCell>

      <TableCell align="left">{sendStatus}</TableCell>

      <TableCell align="left">{sendResult}</TableCell>

      <TableCell align="left">{sendDate}</TableCell>

      <TableCell align="left">{createdAt}</TableCell>

      
    </TableRow>
  );
}
