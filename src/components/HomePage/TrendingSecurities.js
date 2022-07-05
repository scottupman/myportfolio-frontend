import { Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import Axios from "axios"
import Title from "../Title"
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TrendingSecurities() {
    const [trendingSecurities, setTrendingSecurities] = useState([])

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        getTrendingSecurities()
    }

    const getTrendingSecurities = async () => {
        const trending = {
            method: 'GET',
            url: 'https://yh-finance.p.rapidapi.com/market/get-trending-tickers',
            params: { region: 'US' },
            headers: {
                'X-RapidAPI-Key': '122d1b3a3amshaea5e7dab62ae7fp1f22c9jsn2647a22ffe86',
                'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
            }
        };
        const response = await Axios.request(trending)
        const data = response.data.finance.result[0].quotes
        setTrendingSecurities(data);
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

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    return (
        <React.Fragment>
                <Title>Trending</Title>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Price Change (24h)</TableCell>
                            <TableCell>%24h</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trendingSecurities.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell><Link to="/securityinfo" state={{ symbol: row.symbol }}>{row.symbol}</Link></TableCell>
                                <TableCell>{row.shortName}</TableCell>
                                <TableCell>{toTitleCase(row.quoteType)}</TableCell>
                                <TableCell>${row.regularMarketPrice}</TableCell>
                                <TableCell style={{ color: setTextColor(row.regularMarketChange) }}>{insertPositive(row.regularMarketChange)}{row.regularMarketChange.toFixed(2)}</TableCell>
                                <TableCell style={{ color: setTextColor(row.regularMarketChangePercent) }}>{insertPositive(row.regularMarketChangePercent)}{row.regularMarketChangePercent.toFixed(2)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </React.Fragment>
    )

}