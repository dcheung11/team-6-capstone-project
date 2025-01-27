import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ScheduleTable(props) {
  return (
    <TableContainer component={Paper} sx={{ mb: 6, maxHeight: "50vh" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {props.columns.map((column, index) => (
              <TableCell key={index}>{column.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {props.columns.map((column, colIndex) => (
                <TableCell key={colIndex} sx={{ height: 12 }}>
                  {column.accessor ? column.accessor(row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
