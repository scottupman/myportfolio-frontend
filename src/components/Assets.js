import * as React from 'react';
import Link from '@mui/material/Link';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Assets({assets, currentPriceMap, profitLossMap}) {
  
  function getPrice(symbol)
  {
    if (currentPriceMap.size === 0)
      return;
    
    let price = currentPriceMap.get(symbol);
    return price.toFixed(2);
  }

  function getProfitLoss(symbol)
  {
    if (profitLossMap.size === 0)
      return;
    
    let profitLoss = profitLossMap.get(symbol);
    return profitLoss.toFixed(2);
  }

  function setTextColor(profitLoss)
  {
    if (profitLoss > 0)
      return "green"
    else if (profitLoss < 0)
      return "red"
  }

  function insertPositive(profitLoss)
  {
    if (profitLoss > 0)
      return "+"
  }

  return (
    <React.Fragment>
      <Title>My Assets</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>P&L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.symbol}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>${getPrice(row.symbol)}</TableCell>
              <TableCell style = {{color: setTextColor(getProfitLoss(row.symbol))}}>{insertPositive(getProfitLoss(row.symbol))}{getProfitLoss(row.symbol)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}