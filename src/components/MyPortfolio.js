// updating state variables triggers a re-remnder
// useEffect runs when either a state variable changes or you can simply have an on-mount functionality
import { useEffect, useState } from "react";
import Axios from "axios"
import Paper from '@mui/material/Paper';
import PieChart from "./PieChart";
const MyPortfolio = (props) => {
    var options =
    {
        method: 'GET',
        url: 'https://yfapi.net/v6/finance/quote',
        params: { symbols: "" },
        headers: {
            'x-api-key': 'bmxnO3fAAr5APExkNrLcL5oYoirLaK242ZIOWaN1'
        }
    }
    const initializeAssets = async (username) => {
        let url = `http://localhost:8080/assets/${username}`
        const response = await Axios.get(url)
        const data = response.data;
        return data;
    }

    const getBuyingPower = async (username) => {
        let url = `http://localhost:8080/user/${username}`
        const response = await Axios.get(url);
        const data = response.data.cashValue;
        return data;
    }
    const [myAssets, setMyAssets] = useState([]);
    const [netWorth, setNetWorth] = useState(0.00)
    const [stockValue, setStockValue] = useState(0.00)
    const [cryptoValue, setCryptoValue] = useState(0.00)
    const [cashValue, setCashValue] = useState(0.00);
    const [profitLoss, setProfitLoss] = useState(0.00);
    const [dummyUser, setDummyUser] = useState("justinwustin200")
    var assets;
    var buyingPower;

    useEffect(() => {
        initializePortfolio();
    }, []) // OnMount

    const initializePortfolio = async () => {
        // call functions here
        assets = await initializeAssets(dummyUser);
        setMyAssets(assets);
        buyingPower = await getBuyingPower(dummyUser);
        setCashValue(buyingPower);
        initializePortfolioValue(dummyUser);

    }

    const initializePortfolioValue = async (username) => {
        // you need each asset and their quantity * currentCashValue
        let total = 0.00;
        let stocks = 0.00;
        let crypto = 0.00;

        // get symbols
        let symbols = await getSymbols(username);
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
                }
                catch (e) {
                    console.log(e.message);
                }
            })
            total = stocks + crypto + buyingPower
            setNetWorth(total);
            setStockValue(stocks);
            setCryptoValue(crypto);
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
                        }
                        catch (e) {
                            console.log(e.message);
                        }
                    })
                    total = stocks + crypto + buyingPower
                    setNetWorth(total);
                    setStockValue(stocks);
                    setCryptoValue(crypto);
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

    const getSymbols = async (username) => {
        let url = `http://localhost:8080/assets/${username}/symbols`
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
                <h1>networth: {netWorth}</h1>
                <h1>stocks: {stockValue}</h1>
                <h1>crypto: {cryptoValue}</h1>
                <h1>cash: {cashValue}</h1>
            </Paper>


        </>
    )
}

export default MyPortfolio