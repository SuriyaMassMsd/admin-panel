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
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import EditNoteIcon from "@mui/icons-material/EditNote";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TicketOpen from "./TicketOpen";

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

export default function TicketsTable() {
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("");
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    console.log("Filter selected:", filter);
  }, [filter]);

  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${apiUrl}/ticket`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const ticketsData = await response.json();

        if (!response.ok) {
          throw new Error(ticketsData.message || "Something went wrong");
        }

        setData(ticketsData?.value.allTickets || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (data.length === 0) return <Animations />;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div></div>
        <div className="space-x-6">
          <select
            name="filter"
            id="filter"
            className="bg-white text-black border-none outline-none rounded-xl cursor-pointer focus:border-none focus:outline-none"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Select filter</option>
            <option value="userName">Username</option>
            <option value="ticketId">TicketId</option>
            <option value="message">Description</option>
            <option value="ticketStatus">Ticket Status</option>
          </select>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            className="px-10 py-2 outline-none border-none rounded-2xl bg-white mb-10 text-black"
            placeholder="search"
          />
        </div>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          boxShadow: "none",
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
              {!isSmallScreen && <StyledTableCell>ID</StyledTableCell>}
              {!isSmallScreen && <StyledTableCell>Priority</StyledTableCell>}
              {!isSmallScreen && <StyledTableCell>Asignee</StyledTableCell>}
              {!isSmallScreen && (
                <StyledTableCell>Descripition</StyledTableCell>
              )}
              {!isSmallScreen && <StyledTableCell>Status</StyledTableCell>}
              {/* {!isSmallScreen && <StyledTableCell>Released by</StyledTableCell>} */}
              {!isSmallScreen && <StyledTableCell>Created on</StyledTableCell>}
              {/* {!isSmallScreen && (
                <StyledTableCell>Completion date</StyledTableCell>
              )} */}
              {!isSmallScreen && <StyledTableCell></StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.filter((item) => {
                if (!search.trim()) return true;
                if (!filter) return true;
                const value = item[filter];
                return value
                  ?.toString()
                  .toLowerCase()
                  .includes(search.toLowerCase());
              })
              .map((item, index) => {
                const {
                  ticketId,
                  username,
                  message,
                  ticketStatus,
                  createdAt,
                  updatedAt,
                } = item;
                return (
                  <StyledTableRow key={ticketId}>
                    {!isSmallScreen && (
                      <StyledTableCell>
                        {`ABC${ticketId.toString().padStart(4, "0")}`}
                      </StyledTableCell>
                    )}
                    <StyledTableCell>P1</StyledTableCell>
                    {!isSmallScreen && (
                      <StyledTableCell>{username}</StyledTableCell>
                    )}
                    {!isSmallScreen && (
                      <StyledTableCell>
                        {message?.length > 12
                          ? `${message?.substring(0, 40)}...`
                          : ""}
                      </StyledTableCell>
                    )}
                    {!isSmallScreen && (
                      <StyledTableCell>
                        {ticketStatus === 1 ? (
                          <div className="flex justify-center items-center space-x-2">
                            <span className="bg-blue-600 px-2 flex justify-center items-center py-1 rounded-lg">
                              <ConfirmationNumberIcon
                                fontSize={"sm"}
                                color="primary"
                              />
                            </span>
                            <span className="">open</span>
                          </div>
                        ) : ticketStatus === 2 ? (
                          <div className="flex justify-center items-center space-x-2">
                            <span className="bg-orange-600 px-2 flex justify-center items-center py-1 rounded-lg">
                              <HorizontalRuleIcon fontSize={"sm"} />
                            </span>
                            <span className="">closed</span>
                          </div>
                        ) : (
                          <div className="flex justify-center items-center space-x-2">
                            <span className="bg-yellow-500 px-2 flex justify-center items-center py-1 rounded-lg">
                              <RotateLeftIcon fontSize={"sm"} />
                            </span>
                            <span className="">Reopened</span>
                          </div>
                        )}
                      </StyledTableCell>
                    )}
                    {/* {!isSmallScreen && <StyledTableCell>Admin</StyledTableCell>} */}
                    {!isSmallScreen && (
                      <StyledTableCell>
                        {dayjs(Number(createdAt))
                          .format("DD.MMM.YYYY")
                          .toUpperCase()}
                      </StyledTableCell>
                    )}
                    {/* {!isSmallScreen && (
                      <StyledTableCell>
                        {dayjs(Number(updatedAt))
                          .format("DD.MMM.YYYY")
                          .toUpperCase()}
                      </StyledTableCell>
                    )} */}
                    <StyledTableCell>
                      <div className="cursor-pointer">
                        <TicketOpen data={item} />
                        {/* <VisibilityIcon fontSize={"sm"} /> */}
                        {/* <LongMenu
                      // id={id}
                      // navigate={props.navigate}
                      data={item}
                      // handleDelete={props.handleDelete}
                    /> */}
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
