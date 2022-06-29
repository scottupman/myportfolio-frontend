import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Axios from "axios"
import React from "react";
import { useEffect, useState } from "react";
import Title from "../Title";

export default function Stocks() {
    // Not done, show trending stocks first
    const [stocks, setStocks] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        getTrendingStocks();
    }

    const getTrendingStocks = async () => {
        const stocks = {
            method: 'GET',
            url: 'https://yh-finance.p.rapidapi.com/market/get-trending-tickers',
            params: { region: 'US' },
            headers: {
                'X-RapidAPI-Key': '122d1b3a3amshaea5e7dab62ae7fp1f22c9jsn2647a22ffe86',
                'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
            }
        };

        let response = await Axios.request(stocks);
        let data = response.data.finance.result[0].quotes;
        setStocks(data);
    }

    function insertPositive(percent) {
        if (percent > 0)
            return "+"
    }

    function setTextColor(percent) {
        if (percent > 0)
            return "green"
        else if (percent < 0)
            return "red"
    }

    return (
        <React.Fragment>
            <Title>Stocks</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Volume(24h)</TableCell>
                        <TableCell>%1h</TableCell>
                        <TableCell>%24h</TableCell>
                        <TableCell>%7d</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stocks.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.symbol}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>${row.quote.USD.market_cap.toFixed(2)}</TableCell>
                            <TableCell>${row.quote.USD.price.toFixed(2)}</TableCell>
                            <TableCell>${row.quote.USD.volume_24h.toFixed(2)}</TableCell>
                            <TableCell style={{ color: setTextColor(row.quote.USD.percent_change_1h) }}>{insertPositive(row.quote.USD.percent_change_1h)}{row.quote.USD.percent_change_1h.toFixed(2)}</TableCell>
                            <TableCell style={{ color: setTextColor(row.quote.USD.percent_change_24h) }}>{insertPositive(row.quote.USD.percent_change_24h)}{row.quote.USD.percent_change_24h.toFixed(2)}</TableCell>
                            <TableCell style={{ color: setTextColor(row.quote.USD.percent_change_7d) }}>{insertPositive(row.quote.USD.percent_change_7d)}{row.quote.USD.percent_change_7d.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    )
}