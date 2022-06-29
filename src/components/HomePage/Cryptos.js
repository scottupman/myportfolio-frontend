import Axios from "axios"
import Title from "../Title"
import React from "react";
import { useEffect, useState } from "react"
import { Link, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function Cryptos() {
  const [cryptoData, setCryptoData] = useState([])

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    getCrypto();
  }

  const getCrypto = async () => {
    let crypto =
    {
      method: 'GET',
      url: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      params: {
        limit: 10
      },
      headers: {
        'X-CMC_PRO_API_KEY': '199dc119-218c-485c-8fad-a735383b9153',
      }
    }

    let response = await Axios.request(crypto);
    let data = response.data.data;
    setCryptoData(data);
  }

  function insertPositive(percent)
  {
    if (percent > 0)
      return "+"
  }

  function setTextColor(percent)
  {
    if (percent > 0)
      return "green"
    else if (percent < 0)
      return "red"
  }

  return (
    <React.Fragment>
      <Title>Cryptocurrencies</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Market Cap</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Volume(24h)</TableCell>
            <TableCell>%1h</TableCell>
            <TableCell>%24h</TableCell>
            <TableCell>%7d</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cryptoData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.symbol}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>${row.quote.USD.market_cap.toFixed(2)}</TableCell>
              <TableCell>${row.quote.USD.price.toFixed(2)}</TableCell>
              <TableCell>${row.quote.USD.volume_24h.toFixed(2)}</TableCell>
              <TableCell style={{color: setTextColor(row.quote.USD.percent_change_1h)}}>{insertPositive(row.quote.USD.percent_change_1h)}{row.quote.USD.percent_change_1h.toFixed(2)}</TableCell>
              <TableCell style={{color: setTextColor(row.quote.USD.percent_change_24h)}}>{insertPositive(row.quote.USD.percent_change_24h)}{row.quote.USD.percent_change_24h.toFixed(2)}</TableCell>
              <TableCell style={{color: setTextColor(row.quote.USD.percent_change_7d)}}>{insertPositive(row.quote.USD.percent_change_7d)}{row.quote.USD.percent_change_7d.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}