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
import { CheckCircle, PauseCircle, Cancel } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

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

  const showStatusColumn = data.some((user) => user.role !== "Instructor");
  const loading = props.loading;
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

            {showStatusColumn && <StyledTableCell>Status </StyledTableCell>}

            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item, index) => {
            const { email, id, role, username, status } = item;

            return (
              <StyledTableRow
                key={id}
                // sx={{
                //   ...(Number(status) === -1 && {
                //     backgroundColor: "#222222 !important",
                //     "& td": {
                //       color: "#000 !important",
                //     },
                //   }),
                // }}
              >
                {!isSmallScreen && (
                  <StyledTableCell>{index + 1}</StyledTableCell>
                )}
                <StyledTableCell>
                  {isSmallScreen
                    ? username ||
                      email.split("@")[0].substring(0, 12) +
                        (email.split("@")[0].length > 12 ? "..." : "")
                    : username || email.split("@")[0]}
                </StyledTableCell>
                {!isSmallScreen && <StyledTableCell>{email}</StyledTableCell>}
                <StyledTableCell>{role}</StyledTableCell>
                {showStatusColumn && (
                  <StyledTableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {item.status === 2 && (
                        <>
                          <CheckCircle color="success" fontSize="small" />
                          <Typography variant="body2">Active</Typography>
                        </>
                      )}
                      {item.status === 1 && (
                        <>
                          <PauseCircle color="warning" fontSize="small" />
                          <Typography variant="body2">Inactive</Typography>
                        </>
                      )}
                      {item.status === -1 && (
                        <>
                          <Cancel color="error" fontSize="small" />
                          <Typography variant="body2">Deleted</Typography>
                        </>
                      )}
                    </Stack>
                  </StyledTableCell>
                )}
                <StyledTableCell>
                  <div className="cursor-pointer">
                    <LongMenu
                      id={id}
                      navigate={props.navigate}
                      data={item}
                      handleDelete={props.handleDelete}
                      loading={loading}
                    />
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
