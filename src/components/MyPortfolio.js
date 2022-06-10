// updating state variables triggers a re-remnder
// useEffect runs when either a state variable changes or you can simply have an on-mount functionality
import { useEffect, useState } from "react";
import Axios from "axios"
import Paper from '@mui/material/Paper';
import PieChart from "./PieChart";
import Assets from "./Assets"
const MyPortfolio = (props) => {
    var options =
    {
        method: 'GET',
        url: 'https://yfapi.net/v6/finance/quote',
        params: { symbols: "" },
        headers: {
            'x-api-key': 'K85wbL0nvmaNFEhCS2qrJ1ZrAHpgGHcb8HKrzsf7'
        }
    }
    
    const [myAssets, setMyAssets] = useState([]);
    const [netWorth, setNetWorth] = useState(0.00)
    const [stockValue, setStockValue] = useState(0.00)
    const [cryptoValue, setCryptoValue] = useState(0.00)
    const [cashValue, setCashValue] = useState(0.00);
    const [profitLoss, setProfitLoss] = useState(0.00);
    const [dummyUser, setDummyUser] = useState("justinwustin200") // later use props.username
    const [currentPriceMap, setCurrentPriceMap] = useState(new Map());
    const [profitLossMap, setProfitLossMap] = useState(new Map());
    var assets;
    var buyingPower;
    // var currentPriceMap = new Map();
    
    // perhaps have a map of the current prices of each asset
    // perhaps have a map of the profit loss for each asset

    useEffect(() => {
        initializePortfolio();       
    }, []) 
    
    const initializeAssets = async () => {
        let url = `http://localhost:8080/assets/${dummyUser}`
        const response = await Axios.get(url)
        const data = response.data;
        return data;
    }

    const getBuyingPower = async () => {
        let url = `http://localhost:8080/user/${dummyUser}`
        const response = await Axios.get(url);
        const data = response.data.cashValue;
        return data;
    }

    const initializePortfolio = async () => {
        // call functions here
        assets = await initializeAssets();
        setMyAssets(assets);
        buyingPower = await getBuyingPower();
        setCashValue(buyingPower);
        initializePortfolioValue();
    }

    const initializePortfolioValue = async () => {
        let total = 0.00;
        let stocks = 0.00;
        let crypto = 0.00;

        let symbols = await getSymbols();

        const partitionSize = 10;
        if (symbols.length < partitionSize) {
            let symbolString = symbols.join(",");
            options.params.symbols = symbolString;
            const response = await Axios.request(options);
            const data = response.data.quoteResponse.result;
            data.forEach((security) => {
                try {   
                    let quantity = getQuantity(assets, security.symbol)
                    let equityString = "EQUITY";
                    let cryptoString = "CRYPTOCURRENCY";
                    
                    if (security.quoteType.toUpperCase() === equityString) {
                        stocks += (quantity * security.regularMarketPrice)
                    }
                    else if (security.quoteType.toUpperCase() === cryptoString) {
                        crypto += (quantity * security.regularMarketPrice)
                    }
                    setCurrentPriceMap(currentPriceMap => currentPriceMap.set(security.symbol, security.regularMarketPrice))
                }
                catch (e) {
                    console.log(e.message);
                }
            })
            total = stocks + crypto + buyingPower
            setNetWorth(total);
            setStockValue(stocks);
            setCryptoValue(crypto);
            initializeProfitLossMap(symbols);
        }
        else {
            let partitionedSymbols = partitionSymbols(symbols);
            partitionedSymbols.forEach((chunk) => {
                let symbolString = chunk.join(",");
                options.params.symbols = symbolString;
                Axios.request(options).then(function (response) {
                    const data = response.data.quoteResponse.result;
                    data.forEach((security) => {
                        try {
                            let quantity = getQuantity(assets, security.symbol)
                            let equityString = "EQUITY";
                            let cryptoString = "CRYPTOCURRENCY";
                            if (security.quoteType.toUpperCase() === equityString) {
                                stocks += (quantity * security.regularMarketPrice)
                            }
                            else if (security.quoteType.toUpperCase() === cryptoString) {
                                crypto += (quantity * security.regularMarketPrice)
                            }

                            setCurrentPriceMap(currentPriceMap => currentPriceMap.set(security.symbol, security.regularMarketPrice))
                        }
                        catch (e) {
                            console.log(e.message);
                        }
                    })
                    total = stocks + crypto + buyingPower
                    setNetWorth(total);
                    setStockValue(stocks);
                    setCryptoValue(crypto);
                    initializeProfitLossMap(symbols);
                })

            })
        }
    }
    const getQuantity = (assets, symbol) => {
        for (let i = 0; i < assets.length; i++) {
            let isMatch = assets[i].symbol.toUpperCase() === symbol.toUpperCase();
            if (isMatch) {
                return assets[i].quantity;
            }
        }
        throw new Error("user does not own the asset with symbol " + symbol)
    }
    const partitionSymbols = (symbols, chunkSize) => {

        let chunks = [];
        let numberOfChunks = symbols.length / chunkSize;

        for (let i = 0; i < numberOfChunks; i++) {
            chunks[i] = symbols.splice(0, chunkSize);
        }

        return chunks;
    }

    const initializeProfitLossMap = async (symbols) =>
    {
        let profitLossMap = new Map();
        let url = `http://localhost:8080/trades/profit/${dummyUser}`
        const response = await Axios.get(url);
        const data = response.data;
        symbols.forEach(symbol => {
            data.forEach(profit => {
                if (profit.symbol.toUpperCase() === symbol)
                {
                    let quantity = getQuantity(assets, symbol);
                    let currentPrice = currentPriceMap.get(symbol);
                    let unrealized = currentPrice * quantity;
                    let profitLoss = profit.profit + unrealized
                    profitLossMap.set(symbol, profitLoss)
                }                   
            })
        })
        setProfitLossMap(profitLossMap);
    }

    const getSymbols = async () => {
        let url = `http://localhost:8080/assets/${dummyUser}/symbols`
        const response = await Axios.get(url);
        const data = response.data;
        return data;
    }

    return (
        <>
            <Paper>
            <PieChart 
                    pieData = {[cashValue, stockValue, cryptoValue]}
                    labels = {["cash", "stocks", "crypto"]}/>
                <h1>networth: {netWorth.toFixed(2)}</h1>
                <h1>stocks: {stockValue.toFixed(2)}</h1>
                <h1>crypto: {cryptoValue.toFixed(2)}</h1>
                <h1>cash: {cashValue.toFixed(2)}</h1> 
            <Assets assets = {myAssets} currentPriceMap = {currentPriceMap} profitLossMap = {profitLossMap}></Assets>                
            </Paper>


        </>
    )
}

export default MyPortfolio