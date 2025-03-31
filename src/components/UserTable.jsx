import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function CustomizedTables(props) {
  const data = props?.data || [];

  return (
    <TableContainer
      component={Paper}
      sx={{ width: "fit-content", margin: "start" }}
    >
      <Table aria-label="customized table">
        {data?.map(({ email, id, role }, index) => {
          return (
            <div key={id}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>Edit</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {rows.map((row) => ( */}
                <StyledTableRow key={id}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {email.split("@")[0]}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {email}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {role}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <div className="cursor-pointer" onClick={props.handleEdit}>
                      <EditIcon />
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </div>
          );
        })}
      </Table>
    </TableContainer>
  );
}
