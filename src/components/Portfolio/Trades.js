import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Axios from "axios";
import Title from "../Title"
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Trades({ username }) {

  const [trades, setTrades] = useState([])

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    getTrades(username)
  }

  const getTrades = async (username) => {
    let url = `http://localhost:8080/trades/${username}`
    const response = await Axios.get(url);
    const trades = response.data;
    setTrades(trades);
  }

  const displayMonetaryValue = (value) => {
    if (value < 1)
      return value.toFixed(6);
    else
      return value.toFixed(2);
  }

  const convertToDate = (timestamp) => {
    var date = new Date(timestamp * 1000);

    let dateFormat = date.toLocaleString('en-US', { timeZoneName: 'short' })
    return dateFormat;

  }

  return (
    <React.Fragment>
      <Title>My Trades</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map(trade => (
            <TableRow key={trade.id}>
              <TableCell><Link to='/securityinfo' state={{ symbol: trade.symbol }}>{trade.symbol}</Link></TableCell>
              <TableCell>{trade.name}</TableCell>
              <TableCell>{trade.type}</TableCell>
              <TableCell>{trade.quantity}</TableCell>
              <TableCell>${displayMonetaryValue(trade.price)}</TableCell>
              <TableCell>{convertToDate(trade.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}