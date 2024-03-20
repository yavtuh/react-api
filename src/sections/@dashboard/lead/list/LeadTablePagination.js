
import { Stack } from '@mui/material';
import  Pagination  from "@mui/material/Pagination";



const LeadTablePagination = ({ currentPage, lastPage, onPageChange }) => {
  


  const handleChange = (event, value) => {
    onPageChange(event, value);
  };

  return (
    <Stack spacing={2} >
      <Pagination
        count={lastPage}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};



export default LeadTablePagination;