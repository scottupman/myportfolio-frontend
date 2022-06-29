import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    DialogActions,
    TextField,
    Button,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Grid,
    InputAdornment,
    Slide,
    Alert
} from "@mui/material"

import Axios from "axios"
import { Box } from "@mui/system"

export default function TradeDialog(props) {
    const username = props.username;
    const symbol = props.symbol;
    const currentPrice = props.currentPrice;
    const quoteType = props.quoteType;
    const name = props.companyName

    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const [exceptionOccured, setExceptionOccured] = useState(false);
    const [tradeType, setTradeType] = useState("Buy")
    const [method, setMethod] = useState("Quantity")
    const [subtotal, setSubtotal] = useState(0.00)
    const [disableTrade, setDisableTrade] = useState(false)

    const [myQuantity, setMyQuantity] = useState(0.00)
    const [buyingPower, setBuyingPower] = useState(0.00);
    const [input, setInput] = useState(0)

    const resetState = () =>{
        setOpenAlert(false)
        setAlertMsg('')
        setExceptionOccured(false)
        setTradeType("Buy")
        setMethod("Quantity")
        setSubtotal(0.00)
        setInput(0)
    }
    
    useEffect(() => {
        resetState()
        getQuantity(username, symbol);
        getBuyingPower(username);
    }, [open])

    useEffect(() => {
        getQuantity(username, symbol);
        getBuyingPower(username);
    }, [openAlert])

    useEffect(() => {
        getSubtotal(input, currentPrice)
    }, [input, method])

    const getSubtotal = (quantity, price) => {
        if (quoteType.toUpperCase() === "EQUITY") {
            setSubtotal(quantity * price)
        }

        else {
            if (method.toUpperCase() === "CASH")
                setSubtotal(input)
            else
                setSubtotal(quantity * price)
        }
    }
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleTradeType = (event, newTradeType) => {
        if (newTradeType !== null) {
            setTradeType(newTradeType);
        }
    };

    const handleMethod = (event, newMethod) => {
        if (newMethod !== null) {
            setMethod(newMethod);
        }
    };

    const handleTextField = (e) => {
        let value = e.target.value
        if (value === "")
            value = 0
        if (quoteType.toUpperCase() === "EQUITY")
            setInput(Math.floor(value))
        else
            setInput(parseFloat(value))
    }

    function FooterDetails() {
        if (tradeType.toUpperCase() === "BUY") {
            return (
                <div>
                    <Typography>
                        Buying power: ${buyingPower.toFixed(2)}
                    </Typography>
                </div>
            )
        }
        else {
            let value = getValue(myQuantity, currentPrice)
            return (
                <div>
                    <Typography>
                        {myQuantity} {symbol} = ${value.toFixed(2)}
                    </Typography>
                </div>
            )
        }
    }

    function TradeButton(){
        if (quoteType.toUpperCase() === "INDEX" || quoteType.toUpperCase() === "FUTURE")
            return <h1></h1>;
        
        return <Button sx={{ width: '400px', height: '50px' }} variant='contained' size='large' onClick={handleClickOpen}>Trade</Button>
    }

    function QuantityOrCash() {

        if (quoteType.toUpperCase() === "CRYPTOCURRENCY") {
            return (
                <ToggleButtonGroup value={method} onChange={handleMethod} exclusive>
                    <ToggleButton color="primary" value="Quantity">Quantity</ToggleButton>
                    <ToggleButton color="success" value="Cash">Cash</ToggleButton>
                </ToggleButtonGroup>
            )
        }

    }

    const getQuantity = async (username, symbol) => {
        let url = `http://localhost:8080/assets/${username}/quantity/${symbol}`
        let response = await Axios.get(url);
        const quantity = response.data;
        setMyQuantity(quantity);
    }

    const getValue = (quantity, currentPrice) => {
        let value = quantity * currentPrice
        return value;
    }

    const getBuyingPower = async (username) => {
        let url = `http://localhost:8080/user/${username}/cash`
        let response = await Axios.get(url);
        const buyingPower = response.data;
        setBuyingPower(buyingPower);
    }

    const onConfirmClick = async () => {
        let quantity = 0;
        if (quoteType.toUpperCase() === "CRYPTOCURRENCY") {
            if (method.toUpperCase() === "CASH")
                quantity = input / currentPrice; // input would be cash
        }
        else quantity = input; // input here is quantity

        let url = "http://localhost:8080/trades"
        let response = null
        try {
            response = await Axios.post(url, {
                username: username,
                symbol: symbol,
                name: name,
                type: tradeType,
                securityType: quoteType,
                quantity: quantity,
                price: currentPrice
            })

            setExceptionOccured(false)
            setOpenAlert(true)
            setAlertMsg(response.data)
            setTimeout(() => {setOpenAlert(false)}, 3000)
        }
        catch (err) {
            setExceptionOccured(true)
            setOpenAlert(true)
            setAlertMsg(err.response.data)
            setTimeout(() => {setOpenAlert(false)}, 3000)
        }
    }

    return (
        <div>
            <TradeButton></TradeButton>
            <Dialog open={open} onClose={handleClose}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Grid container direction='row' padding={2} spacing={2}>
                        <Grid item>
                            <ToggleButtonGroup value={tradeType} onChange={handleTradeType} exclusive>
                                <ToggleButton color="error" value="Buy">Buy</ToggleButton>
                                <ToggleButton color="success" value="Sell">Sell</ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                        <Grid item>
                            <QuantityOrCash></QuantityOrCash>
                        </Grid>
                        <Grid item>
                            <Slide direction="down" in={openAlert} mountOnEnter unmountOnExit>
                                <Alert severity={exceptionOccured ? "error" : "success"}>{alertMsg}</Alert>
                            </Slide>
                        </Grid>
                    </Grid>
                    <TextField sx={{ marginTop: '40px' }} type="number"
                        id="standard-basic"
                        variant="standard"
                        value={input === 0 ? "" : input}
                        color="primary"
                        inputProps={{ min: 0, style: { fontSize: 40, textAlign: 'center' } }}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (<InputAdornment position="start">{method === "Cash" ? "$" : null}</InputAdornment>)
                        }}
                        placeholder={method}
                        onChange={handleTextField}
                    />
                    <DialogContent>
                        <Typography variant="h5">Subtotal: ${subtotal.toFixed(2)}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained"
                            disabled={input === 0 ? true : false}
                            onClick={() => onConfirmClick()}
                        >Confirm</Button>
                    </DialogActions>
                    <Typography marginLeft="auto">
                        <FooterDetails></FooterDetails>
                    </Typography>
                </Box>
            </Dialog>
        </div >
    )
}