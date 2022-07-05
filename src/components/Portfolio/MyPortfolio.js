// updating state variables triggers a re-remnder
// useEffect runs when either a state variable changes or you can simply have an on-mount functionality
import { useEffect, useState } from "react";
import Axios from "axios"
import Paper from '@mui/material/Paper';
import PieChart from "./PieChart";
import Assets from "./Assets"
import { Typography, Box, Grid } from "@mui/material";
import Trades from "./Trades";
import ProfitLoss from "./ProfitLoss";
const MyPortfolio = ({username}) => {
    var options =
    {
        method: 'GET',
        url: 'https://yfapi.net/v6/finance/quote',
        params: { symbols: "" },
        headers: {
            'x-api-key': 'TNxkOccoIG1y4eznLDk2B3mDW1gjQW6Z3bwpWJaF',
        }
    }

    const [myAssets, setMyAssets] = useState([]);
    const [netWorth, setNetWorth] = useState(0.00)
    const [stockValue, setStockValue] = useState(0.00)
    const [cryptoValue, setCryptoValue] = useState(0.00)
    const [cashValue, setCashValue] = useState(0.00);
    const [profitLoss, setProfitLoss] = useState(0.00);
    const [currentPriceMap, setCurrentPriceMap] = useState(new Map());
    const [profitLossMap, setProfitLossMap] = useState(new Map());
    var assets;
    var buyingPower;

    useEffect(() => {
        initializePortfolio();
        profitLossMap.forEach(elem => console.log(elem))
    }, [])

    const initializeAssets = async () => {
        let url = `http://localhost:8080/assets/${username}`
        const response = await Axios.get(url)
        const data = response.data;
        return data;
    }

    const getBuyingPower = async () => {
        let url = `http://localhost:8080/user/${username}`
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

        let symbols = await getSymbols(); // symbols that user owns

        const partitionSize = 10;
        if (symbols.length < partitionSize) {
            let symbolString = symbols.join(",");
            options.params.symbols = symbolString;
            const response = await Axios.request(options);
            const data = response.data.quoteResponse.result;
            data.forEach((security) => {
                try {
                    let quantity = getQuantity(assets, security.symbol)

                    if (security.quoteType.toUpperCase() === "EQUITY") {
                        stocks += (quantity * security.regularMarketPrice)
                    }
                    else if (security.quoteType.toUpperCase() === "CRYPTOCURRENCY") {
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

                            if (security.quoteType.toUpperCase() === "EQUITY") {
                                stocks += (quantity * security.regularMarketPrice)
                            }
                            else if (security.quoteType.toUpperCase() === "CRYPTOCURRENCY") {
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

    const initializeProfitLossMap = async (symbols) => {
        let profitLossMap = new Map();
        let url = `http://localhost:8080/trades/profit/${username}`
        const response = await Axios.get(url);
        const data = response.data;
        symbols.forEach(symbol => {
            data.forEach(profit => {
                if (profit.symbol.toUpperCase() === symbol) {
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
        let url = `http://localhost:8080/assets/${username}/symbols`
        const response = await Axios.get(url);
        const data = response.data;
        return data;
    }

    return (
        <Paper>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '10px',
                }}
            >

                <PieChart
                    pieData={[cashValue.toFixed(2), stockValue.toFixed(2), cryptoValue.toFixed(2)]}
                    labels={["Cash", "Stocks", "Crypto"]} />
                <Typography marginTop={2} variant="h3" component='div' fontSize={35}>
                    Net worth: ${netWorth.toFixed(2)}
                </Typography>

                <Grid container spacing = {2} direction = "column" style={{width: '1000px'}}>
                    <Grid item>
                        <Assets assets={myAssets} currentPriceMap={currentPriceMap} profitLossMap={profitLossMap}></Assets>
                    </Grid>
                    <Grid item>
                        <Trades username = {username}></Trades>
                    </Grid>
                    <Grid item>
                        <ProfitLoss username = {username}></ProfitLoss>
                    </Grid>
                </Grid>
                {/* <div style={{width: '800px', marginTop: '20px'}}> */}
                
                
                {/* </div> */}


            </Box>
        </Paper>
    )
}

export default MyPortfolio