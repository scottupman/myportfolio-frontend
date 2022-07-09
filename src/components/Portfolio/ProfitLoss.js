import { useEffect, useState } from "react"
import Axios from "axios"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import Title from "../Title"
import React from "react"
import { Link, matchPath } from "react-router-dom"
export default function ProfitLoss(props) {

    // Figure out why profitLossElements doesn't show in the table

    const username = props.username

    const [profitLossElements, setProfitLossElements] = useState([])

    useEffect(() => {
        initializeProfitLossElems();
    }, [])

    const getQuantity = async (symbol) => {
        let url = `http://localhost:8080/assets/${username}/quantity/${symbol}`
        const response = await Axios.get(url);
        const data = response.data;
        return data;
    }

    const getName = async (symbol) => {
        const url = `http://localhost:8080/trades/name/${symbol}`
        const response = await Axios.get(url);
        const data = response.data;
        return data;
    }

    const getProfitLossOnSymbols = async (symbols) => {
        let url = `http://localhost:8080/trades/profit/${username}`
        const response = await Axios.get(url);
        const data = response.data;
        return data;
    }

    const getTradedSymbols = async () => {
        let url = `http://localhost:8080/trades/${username}/symbols`
        const response = await Axios.get(url)
        const data = response.data;
        return data;
    }

    // could replace this with the partitioning method for the original yh finance api
    const getQuotes = async (symbols) => {
        let quotes = {
            method: 'GET',
            url: 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
            params: { region: 'US', symbols: "" },
            headers: {
                'X-RapidAPI-Key': '122d1b3a3amshaea5e7dab62ae7fp1f22c9jsn2647a22ffe86',
                'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
            }
        };

        quotes.params.symbols = symbols;
        const response = await Axios.request(quotes)
        const data = response.data.quoteResponse.result;
        return data
    }

    const createCurrentPriceMap = async () => {
        let currentPriceMap = new Map();
        let tradedSymbols = await getTradedSymbols();
        let symbolString = tradedSymbols.join(",");

        const quotes = await getQuotes(symbolString);

        quotes.forEach(quote => {
            currentPriceMap.set(quote.symbol, quote.regularMarketPrice)
        })

        console.log(currentPriceMap)
        return currentPriceMap;
    }

    const populateProfitLossElems = (tradedSymbols, profitLossOnSymbols, currentPriceMap) => {
        tradedSymbols.forEach(symbol => {
            profitLossOnSymbols.forEach(element => {
                if (element.symbol === symbol) {
                    getQuantity(symbol).then(quantity => {
                        let currentPrice = currentPriceMap.get(symbol);
                        let unrealized = currentPrice * quantity;
                        let profitLoss = element.profit + unrealized
                        getName(symbol).then(name => {
                            let profitLossElem = createProfitLossElem(symbol, name, profitLoss)
                            //profitLossElems.push(profitLossElem)
                            if (profitLossElements.length < tradedSymbols.length)
                                setProfitLossElements(state => [...state, profitLossElem])
                        })
                    });
                }
            });
        })
    }

    const initializeProfitLossElems = async () => {
        let currentPriceMap = await createCurrentPriceMap();
        let tradedSymbols = await getTradedSymbols()
        let profitLossOnSymbols = await getProfitLossOnSymbols();

        populateProfitLossElems(tradedSymbols, profitLossOnSymbols, currentPriceMap)
    }

    const createProfitLossElem = (symbol, name, profitLoss) => {
        let profitLossElem =
        {
            symbol: symbol,
            name: name,
            profitLoss: profitLoss
        }

        return profitLossElem;
    }

    function insertPositive(profitLoss) {
        if (profitLoss > 0)
            return "+"
    }

    const displayProfitLoss = (value) => {
        return value.toFixed(2)
    }

    function setTextColor(profitLoss) {
        if (profitLoss > 0)
            return "green"
        else if (profitLoss < 0)
            return "red"
    }

    // could also show total profit/loss
    return (
        <React.Fragment>
            <Title>P&L</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>P&L</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {profitLossElements.map(row => {
                        return (
                            <TableRow key={row.symbol}>
                                <TableCell><Link to='/securityinfo' state={{ symbol: row.symbol }}>{row.symbol}</Link></TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell style = {{color: setTextColor(row.profitLoss)}}>{insertPositive((row.profitLoss))}{displayProfitLoss(row.profitLoss)}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </React.Fragment>
    )
}





