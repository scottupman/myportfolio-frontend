import { useEffect, useState } from "react"
import Axios from "axios"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import Title from "../Title"
import React from "react"
import { Link } from "react-router-dom"
export default function ProfitLoss(props) {

    const username = props.username

    const [trades, setTrades] = useState([])
    const [currentPriceMap, setCurrentPriceMap] = useState(new Map())
    const [profitLossElements, setProfitLossElements] = useState([])
    const [profitLossMap, setProfitLossMap] = useState(new Map())

    useEffect(() => {
        getTrades()
    }, [])

    useEffect(() => {
        initializeProfitLossMap();
    }, [trades])

    const getTrades = async () => {
        let url = `http://localhost:8080/trades/${username}`
        const response = await Axios.get(url);
        const trades = response.data;
        setTrades(trades);
    }

    const getQuantity = async (symbol) => {
        let url = `http://localhost:8080/assets/${username}/quantity/${symbol}`
        const response = await Axios.get(url);
        const data = response.data;
        return data;
    }

    const getName = (trades, symbol) => {
        trades.forEach(trade => {
            if (trade.symbol.toUpperCase() === symbol.toUpperCase())
                return trade.name;
        })
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

    const getOwnedSymbols = async () => {
        let url = `http://localhost:8080/assets/${username}/symbols`
        const response = await Axios.get(url);
        const data = response.data;
        return data;
    }

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
        let ownedSymbols = await getOwnedSymbols(); // symbols that user owns
        let symbolString = ownedSymbols.join(",");

        const quotes = await getQuotes(symbolString);

        quotes.forEach(quote => {
            currentPriceMap.set(quote.symbol, quote.regularMarketPrice)
        })

        return currentPriceMap;
    }

    const initializeProfitLossMap = async () => {
        let profitLossMap = new Map();
        let currentPriceMap = await createCurrentPriceMap();

        let tradedSymbols = await getTradedSymbols()
        let profitLossOnSymbols = await getProfitLossOnSymbols();

        let profitLossElems = [];

        tradedSymbols.forEach(symbol => {
            profitLossOnSymbols.forEach(async element => {
                if (element.symbol === symbol) {
                    let quantity = await getQuantity(symbol);
                    let currentPrice = currentPriceMap.get(symbol);
                    let unrealized = currentPrice * quantity;
                    let profitLoss = element.profit + unrealized
                    profitLossMap.set(symbol, profitLoss)

                    // perhaps this could work? create a new profitLossElem
                    profitLossElems.push(createProfitLossElem(symbol, getName(trades, symbol), profitLoss))
                    
                }
            });
        })
        setProfitLossElements(profitLossElems);
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
                    {profitLossElements.map(row => (
                        <TableRow key={row.id}>
                            <TableCell><Link to='/securityinfo' state={{ symbol: row.symbol }}>{row.symbol}</Link></TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.profitLoss}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    )
}





