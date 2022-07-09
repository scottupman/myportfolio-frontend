import React, { useEffect, useState } from "react";
import Axios from 'axios'
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router";
import { Button, Box, TextField, Grid, Container } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import format from 'date-fns/format'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isNull } from "url/util";

const theme = createTheme()

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [email, setEmail] = useState('')
    const [DOB, setDOB] = useState(null);

    const [takenUsernames, setTakenUsernames] = useState([])
    const [takenEmails, setTakenEmails] = useState([]);
    const [usernameTaken, setUsernameTaken] = useState(false)
    const [usernameValid, setUsernameValid] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [dobValid, setDobValid] = useState(false);

    const [dobHelperText, setDobHelperText] = useState("");

    let navigate = useNavigate();

    const todayString = new Date().toISOString().split('T')[0];
    const today = new Date(todayString);
    const minDate = new Date("1900-01-01")

    console.log("today: " + today)
    console.log("min date: " + minDate)

    const displayEmailHelperText = () => {
        if (email === "")
            return;
        if (emailTaken)
            return "Email is already taken"
        else if (!emailValid)
            return "Not a valid email"
    }

    const displayEmailError = () => {
        if (email === "")
            return false;
        if (emailTaken || !emailValid)
            return true;
    }

    const validateEmail = (email) => {
        let email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (email_regex.test(email))
            setEmailValid(true);
        else
            setEmailValid(false)
    };

    const validateUsername = (username) => {
        if (username.length < 8)
            setUsernameValid(false)
        else
            setUsernameValid(true);
    }

    const usernameIsTaken = (username) => {
        for (let i = 0; i < takenUsernames.length; i++) {
            if (username.toUpperCase() === takenUsernames[i].toUpperCase()) {
                setUsernameTaken(true);
                return;
            }
        }

        setUsernameTaken(false)
    }

    const emailIsTaken = (email) => {
        for (let i = 0; i < takenEmails.length; i++) {
            if (email.toUpperCase() === takenEmails[i].toUpperCase()) {
                setEmailTaken(true);
                return;
            }
        }

        setEmailTaken(false)
    }

    const displayUsernameError = () => {
        if (username === "")
            return false;
        if (usernameTaken || !usernameValid)
            return true;
    }

    const displayUsernameHelperText = () => {
        if (username === "")
            return;
        if (usernameTaken)
            return "Username is already taken"
        else if (!usernameValid)
            return "Username must be at least 8 characters"
    }

    const displayDOBError = () => {
        if (isNull(DOB) || DOB === "")
            return false;
        if (!dobValid)
            return true;
    }

    const validateDob = (dob) => {
        if (dob.length !== 10)
            setDobValid(false);
        else
            setDobValid(true);
    }

    const handleDob = (dob) => {
        if (dob.length > 10) return // do nothing 
        else setDOB(dob);
    }

    const fetchData = () => {
        fetchUsernames();
        fetchEmails();
    }
    const fetchUsernames = async () => {
        let url = "http://localhost:8080/user"
        Axios.get(url).then(response => setTakenUsernames(response.data))
    }

    const fetchEmails = async () => {
        let url = "http://localhost:8080/user/email"
        Axios.get(url).then(response => setTakenEmails(response.data))
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        console.log("email is valid: " + emailValid);
    }, [email])

    useEffect(() => {
        console.log("email is taken: " + emailTaken)
    }, [email])

    useEffect(() => {
        console.log(takenEmails)
    }, [takenEmails])


    // do this after clicking the register button0.
    const registerUser = async e => {
        e.preventDefault();
        setDOB(format(DOB, 'yyyy-MM-dd'));
        Axios.post('http://localhost:8080/user/register',
            {
                username: username,
                password: password,
                fname: fname,
                lname: lname,
                DOB: DOB,
            }
        )
    }
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" noValidate onSubmit={registerUser} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    onChange={(e) => setfname(e.target.value)}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    onChange={(e) => setlname(e.target.value)}
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={displayUsernameError()}
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    onChange={(e) => { setUsername(e.target.value); validateUsername(e.target.value); usernameIsTaken(e.target.value) }}
                                    helperText={displayUsernameHelperText()}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={displayEmailError()}
                                    required
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    id="email"
                                    onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); emailIsTaken(e.target.value) }}
                                    helperText={displayEmailHelperText()}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        maxDate={today}
                                        minDate={minDate}
                                        onError={(reason, value) => {
                                            switch (reason) {
                                                case "invalidDate":
                                                    setDobHelperText("Invalid date format")
                                                    break;

                                                case "maxDate":
                                                    setDobHelperText(`Date should not be after ${format(today, "P")}`);
                                                    break;

                                                case "minDate":
                                                    setDobHelperText(`Date should not be before ${format(minDate, "P")}`);
                                                    break;

                                                default:
                                                    setDobHelperText("");
                                            }
                                        }}
                                        label="DOB"
                                        disableFuture
                                        inputFormat="MM-dd-yyyy"
                                        value={DOB}
                                        onChange={(newDOB) => { setDOB(newDOB); }} //handleDob(newDOB); validateDob(newDOB)
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                helperText={dobHelperText}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default Register;