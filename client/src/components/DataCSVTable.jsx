import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
} from "@mui/material";

const PreviewTable = ({ fileData }) => {
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Assuming fileData is an array of objects representing rows
    if (Array.isArray(fileData) && fileData.length > 0) {
      setHeaders(Object.keys(fileData[0])); // Extract headers from the first object
      setTableData(fileData); // Set the JSON data directly
    }
  }, [fileData]);

  const filteredData = tableData.filter((row) =>
    headers.some((header) =>
      row[header]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <div className="flex flex-col gap-6 m-[50px] rounded-lg border-gray-150 border-2 p-6 h-fit">
      <h2 className="text-lg font-extrabold text-gray-900 sm:text-4xl text-center">
        Post Details
      </h2>
      <TextField
        label="Search posts..."
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <TableContainer component={Paper}>
        <Table className="rounded-lg">
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} style={{ fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <TableCell key={colIndex}>{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20]}
      />
    </div>
  );
};

export default PreviewTable;
