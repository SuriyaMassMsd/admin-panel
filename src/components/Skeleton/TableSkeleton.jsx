import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const columns = [
  "ID",
  "Priority",
  "Asignee",
  "Description",
  "Status",
  "Created on",
  "Actions",
];

export default function Animations() {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell key={index}>
                <Skeleton animation="wave" width="80%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton animation="wave" height={30} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
