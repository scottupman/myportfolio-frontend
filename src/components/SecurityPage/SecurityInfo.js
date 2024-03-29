import { Card, CardContent } from '@mui/material'
import Box from '@mui/material/Box'
import { Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router'
import Axios from 'axios'
import LineChart from './LineChart'
import TradeDialog from './TradeDialog'

const SecurityInfo = ({ username }) => {
    const location = useLocation()
    // @ts-ignore
    let symbol = location.state.symbol;

    var quote =
    {
        method: 'GET',
        url: 'https://yfapi.net/v6/finance/quote',
        params: { symbols: "" },
        headers: {
            'x-api-key': 'TNxkOccoIG1y4eznLDk2B3mDW1gjQW6Z3bwpWJaF',
        }
    }

    var chart =
    {
        method: 'GET',
        url: `https://yfapi.net/v8/finance/chart/${symbol}`,
        params: {

        },
        headers: {
            'x-api-key': 'TNxkOccoIG1y4eznLDk2B3mDW1gjQW6Z3bwpWJaF',
        }
    }

    const [companyName, setCompanyName] = useState('')
    const [currentPrice, setCurrentPrice] = useState(0.00)
    const [open, setOpen] = useState(0.00)
    const [high, setHigh] = useState(0.00)
    const [low, setLow] = useState(0.00);
    const [prevClose, setPrevClose] = useState(0.00)
    const [priceDif, setPriceDif] = useState(0.00)
    const [priceDifPercentage, setPriceDifPercentage] = useState(0)
    const [chartLabels, setChartLabels] = useState([])
    const [chartData, setChartData] = useState([])
    const [chartRange, setChartRange] = useState('1mo')
    const [quoteType, setQuoteType] = useState('');
    const [isLessThanOne, setIsLessThanOne] = useState(false)
    const [newsContent, setNewsContent] = useState([]);

    useEffect(() => {
        // get api data here
        fetchData();
        fetchNewsData();
    }, [symbol])

    useEffect(() => {
        fetchChartData();
    }, [chartRange, symbol])

    useEffect(() => {
        if (currentPrice < 1)
            setIsLessThanOne(true)
        else
            setIsLessThanOne(false)
    }, [currentPrice])

    const fetchData = async () => {
        quote.params.symbols = symbol;
        const response = await Axios.request(quote);
        const quoteData = response.data.quoteResponse.result[0];

        setCompanyName(quoteData.shortName)
        setCurrentPrice(quoteData.regularMarketPrice)
        setOpen(quoteData.regularMarketOpen)
        setHigh(quoteData.regularMarketDayHigh)
        setLow(quoteData.regularMarketDayLow);
        setPrevClose(quoteData.regularMarketPreviousClose)
        setPriceDif(quoteData.regularMarketChange);
        setPriceDifPercentage(quoteData.regularMarketChangePercent)
        setQuoteType(quoteData.quoteType)
    }

    const fetchChartData = async () => {
        chart.params.range = chartRange;
        if (chartRange === '1d')
            chart.params.interval = '1m'
        else if (chartRange === '5d')
            chart.params.interval = '5m'
        else if (chartRange === '1mo' || chartRange === '3mo' || chartRange === '6mo' || chartRange === '1y')
            chart.params.interval = '1d'
        else if (chartRange === '5y')
            chart.params.interval = '1wk'
        else if (chartRange === 'max')
            chart.params.interval = '1mo'

        const response = await Axios.request(chart)
        const data = response.data.chart.result[0]
        let chartLabels = convertTimestampsIntoDates(data.timestamp)
        setChartLabels(chartLabels)
        setChartData(data.indicators.quote[0].close)
    }

    const fetchNewsData = async () => {
        let newsList =
        {
            method: 'POST',
            url: 'https://yh-finance.p.rapidapi.com/news/v2/list',
            params: {
                region: 'US',
                s: symbol
            },
            headers: {
                'X-RapidAPI-Key': '122d1b3a3amshaea5e7dab62ae7fp1f22c9jsn2647a22ffe86',
                'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
            }
        }

        let content =
        {
            method: 'GET',
            url: 'https://yh-finance.p.rapidapi.com/news/v2/get-details',
            params: {
                uuid: null
            },
            headers: {
                'X-RapidAPI-Key': '122d1b3a3amshaea5e7dab62ae7fp1f22c9jsn2647a22ffe86',
                'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
            }
        }

        Axios.request(newsList).then(response => {
            let streams = response.data.data.main.stream;
            let streamIds = []
            streams.forEach(stream => {
                streamIds.push(stream.id);
            })
            content.params.uuid = streamIds.join(",");
            Axios.request(content).then(response => {
                let newsContent = response.data.data.contents;
                setNewsContent(newsContent);
            });
        })
    }

    function setTextColor() {
        if (priceDif > 0)
            return "green"
        else if (priceDif < 0)
            return "red"
    }

    function insertPositive() {
        if (priceDif > 0)
            return "+"
    }

    function convertTimestampsIntoDates(timestamps) {
        let dates = []
        timestamps.forEach(timestamp => {
            let dateString;
            let date = new Date(timestamp * 1000)
            dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
            dates.push(dateString)
        })

        return dates;
    }

    const handleChartRange = (event, newChartRange) => {
        if (newChartRange !== null) {
            setChartRange(newChartRange);
        }
    };

    const displayMonetaryValue = (value) => {
        if (isLessThanOne)
            return value.toFixed(6);
        else
            return value.toFixed(2);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '10px'
            }}
        >
            <Grid container direction='row'>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Typography variant='h6' component='div'>
                                {symbol} ({companyName})
                            </Typography>
                            <Grid container spacing={2} direction='row'>
                                <Grid item>
                                    <Typography sx={{ fontSize: 35 }} variant='h3' component='div'>
                                        ${displayMonetaryValue(currentPrice)}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography sx={{ fontSize: 20, marginTop: 0.5 }} style={{ color: setTextColor() }} variant='h6' component='div'>
                                        {insertPositive()} {displayMonetaryValue(priceDif)} ({priceDifPercentage.toFixed(2)}%)
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item marginLeft='auto'>
                    <Card>
                        <CardContent>
                            <Typography variant='h6' component='div'>
                                Open: ${displayMonetaryValue(open)}
                            </Typography>
                            <Typography variant='h6' component='div'>
                                High: ${displayMonetaryValue(high)}
                            </Typography>
                            <Typography variant='h6' component='div'>
                                Low: ${displayMonetaryValue(low)}
                            </Typography>
                            <Typography variant='h6' component='div'>
                                Previous Close: ${displayMonetaryValue(prevClose)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ width: '1000px', marginTop: '50px' }}>
                <Grid container direction='row'>
                    <Grid item>
                        <ToggleButtonGroup value={chartRange} sx={{ marginLeft: '30px' }} onChange={handleChartRange} exclusive>
                            <ToggleButton value='1d'>1d</ToggleButton>
                            <ToggleButton value='5d'>5d</ToggleButton>
                            <ToggleButton value='1mo'>1mo</ToggleButton>
                            <ToggleButton value='3mo'>3mo</ToggleButton>
                            <ToggleButton value='6mo'>6mo</ToggleButton>
                            <ToggleButton value='1y'>1y</ToggleButton>
                            <ToggleButton value='5y'>5y</ToggleButton>
                            <ToggleButton value='max'>All</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item marginLeft='auto'>
                        <TradeDialog username={username}
                            currentPrice={currentPrice}
                            symbol={symbol}
                            quoteType={quoteType}
                            name={companyName}
                        >
                        </TradeDialog>
                    </Grid>
                </Grid>
                <LineChart labels={chartLabels} data={chartData}></LineChart>
                <Typography sx={{ fontSize: 35, mt: 5 }} variant='h3' component='div'>Relevant Articles</Typography>
                <Grid container direction='column' sx={{ fontSize: 25 }}>
                    {newsContent.map(elem => {
                        let url = elem.content.canonicalUrl.url;
                        return <div style={{ paddingBottom: 20 }}><a href={`${url}`} target="_blank" rel="noopener noreferrer">{elem.content.title}</a></div>
                    })}
                </Grid>
            </Box>
        </Box >
    )

}

export default SecurityInfo