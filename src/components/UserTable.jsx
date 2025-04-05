import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Animations from "./Skeleton/TableSkeleton";
import LongMenu from "./UserSuspend";

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

export default function CustomizedTables(props) {
  const data = props?.data || [];
  const { setPathname } = props.current;

  if (!props.data) return <Animations />;

  return (
    <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
      <Table aria-label="customized table">
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
          {data?.map((item, index) => {
            const { email, id, role } = item;
            return (
              <StyledTableRow key={id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{email.split("@")[0]}</StyledTableCell>
                <StyledTableCell>{email}</StyledTableCell>
                <StyledTableCell>{role}</StyledTableCell>
                <StyledTableCell>
                  <div className="cursor-pointer">
                    <LongMenu />
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
