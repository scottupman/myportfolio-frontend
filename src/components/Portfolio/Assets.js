import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';
import {Link} from 'react-router-dom';


function preventDefault(event) {
  event.preventDefault();
}

export default function Assets({assets, currentPriceMap}) {

  function getPrice(symbol)
  {
    if (currentPriceMap.size === 0)
      return;
    
    let price = currentPriceMap.get(symbol);
    return price.toFixed(2);
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
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((row) => (
            <TableRow key={row.id}>
              <TableCell><Link to='/securityinfo' state={{symbol: row.symbol}}>{row.symbol}</Link></TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>${getPrice(row.symbol)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
