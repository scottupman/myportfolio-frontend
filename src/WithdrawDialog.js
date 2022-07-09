import { Dialog, Box, Grid, ToggleButtonGroup, ToggleButton, Slide, Alert, TextField, InputAdornment, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import Axios from "axios"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function DepositDialog({ username }) {
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const [exceptionOccured, setExceptionOccured] = useState(false);
    const [input, setInput] = useState(-1)
    const [buyingPower, setBuyingPower] = useState(0.00)

    const regex = /^\d+(\.\d{0,2})?$/

    useEffect(() => {
        resetState();
        getCash();
    }, [open])

    useEffect(() => {
        getCash();
    }, [openAlert])

    const getCash = async () => {
        let url = `http://localhost:8080/user/${username}/cash`
        let response = await Axios.get(url);
        const cash = response.data;
        setBuyingPower(cash);
    }

    const resetState = () => {
        setOpenAlert(false)
        setAlertMsg('')
        setExceptionOccured(false)
        setInput(-1)
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleTextField = (e) => {
        let value = e.target.value
        if (value === "")
            value = -1 
        
        if (value === -1)
            setInput(parseFloat(value))
        else if (regex.test(value))
            setInput(parseFloat(value))
    }

    const onConfirmClick = async () => {

        try {
            // axios request here
            let url = `http://localhost:8080/user/${username}/withdraw/${input}`
            const response = await Axios.put(url);
            setExceptionOccured(false)
            setOpenAlert(true)
            setAlertMsg(response.data)
            setTimeout(() => { setOpenAlert(false) }, 3000)
        }

        catch (err) {
            setExceptionOccured(true)
            setOpenAlert(true)
            setAlertMsg(err.response.data)
            setTimeout(() => { setOpenAlert(false) }, 3000)
        }
    }

    function WithdrawButton() {
        return (
            <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                value="Deposit"
                onClick={handleClickOpen}
            >
                Withdraw
            </Button>
        )
    }

    function FooterDetails() {
        return (
            <div>
                <Typography>
                    My cash: ${(Math.floor(buyingPower * 100) / 100).toFixed(2)}
                </Typography>
            </div>
        )
    }

    return (
        <div>
            <WithdrawButton></WithdrawButton>
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
                            <Slide direction="down" in={openAlert} mountOnEnter unmountOnExit>
                                <Alert severity={exceptionOccured ? "error" : "success"}>{alertMsg}</Alert>
                            </Slide>
                        </Grid>
                    </Grid>
                    <TextField sx={{ marginTop: '40px' }} type="number"
                        id="standard-basic"
                        variant="standard"
                        value={input < 0 ? "" : input}
                        color="primary"
                        inputProps={{ min: 0, style: { fontSize: 40, textAlign: 'center' } }}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (<InputAdornment position="start"><AttachMoneyIcon fontSize="large"/></InputAdornment>)
                        }}
                        placeholder="0.00"
                        onChange={handleTextField}
                    />
                    <DialogActions>
                        <Button variant="contained"
                            disabled={input <= 0 ? true : false}
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

