import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Animations from "./Skeleton/TableSkeleton";
import LongMenu from "./UserSuspend";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [theme.breakpoints.down("sm")]: {
    padding: "8px 6px",
    fontSize: "12px",
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!props.data) return <Animations />;

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        overflowX: "auto",
        boxShadow: "none",
        // border: "1px solid #e0e0e0",
        [theme.breakpoints.down("sm")]: {
          border: "none",
        },
      }}
    >
      <Table
        aria-label="customized table"
        sx={{
          minWidth: isSmallScreen ? "auto" : 650,
          [theme.breakpoints.down("sm")]: {
            "& .MuiTableCell-root": {
              padding: "6px 4px",
            },
          },
        }}
      >
        <TableHead>
          <TableRow>
            {!isSmallScreen && <StyledTableCell>S.No</StyledTableCell>}
            <StyledTableCell>{isSmallScreen ? "User" : "Name"}</StyledTableCell>
            {!isSmallScreen && <StyledTableCell>Email</StyledTableCell>}
            <StyledTableCell>Role</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item, index) => {
            const { email, id, role } = item;
            return (
              <StyledTableRow key={id}>
                {!isSmallScreen && (
                  <StyledTableCell>{index + 1}</StyledTableCell>
                )}
                <StyledTableCell>
                  {isSmallScreen
                    ? email.split("@")[0].substring(0, 12) +
                      (email.split("@")[0].length > 12 ? "..." : "")
                    : email.split("@")[0]}
                </StyledTableCell>
                {!isSmallScreen && <StyledTableCell>{email}</StyledTableCell>}
                <StyledTableCell>{role}</StyledTableCell>
                <StyledTableCell>
                  <div className="cursor-pointer">
                    <LongMenu id={id} />
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
