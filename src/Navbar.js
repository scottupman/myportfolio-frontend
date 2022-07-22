import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Button, Input, InputAdornment, inputClasses, makeStyles, TextField, useAutocomplete } from '@mui/material';
import { useNavigate } from 'react-router';

import Autocomplete from '@mui/material/Autocomplete';
import TradeDialog from './components/SecurityPage/TradeDialog';
import DepositDialog from './DepositDialog';
import WithdrawDialog from './WithdrawDialog';
import Axios from 'axios';
import { ClassNames } from '@emotion/react';
//import yahooFinance from 'yahoo-finance2';

export default function Navbar({ username, setUserInfo }) {

  let navigate = useNavigate()

  const pages = ["home", "portfolio"]
  const [searchInput, setSearchInput] = React.useState("")
  const [searchValue, setSearchValue] = React.useState(null);

  // autocomplete
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    if (searchInput !== "")
      fetchSearchResults();
  }, [searchInput])

  React.useEffect(() => {
    console.log("modified options")
    console.log(options)
  }, [options])

  React.useEffect(() => {
    console.log("search input...")
    console.log(searchInput)
  }, [searchInput])

  React.useEffect(() => {
    console.log("search value...")
    console.log(searchValue)
  }, [searchValue])

 

  // React.useEffect(() => {
  //   console.log("search value...")
  //   console.log(searchValue)

  //   handleSearchValueState();
  // }, [searchValue])

  const fetchSearchResults = () => {
    console.log(searchInput)
    let search = {
      method: 'GET',
      url: 'https://yh-finance.p.rapidapi.com/auto-complete',
      params: { q: searchInput, region: 'US' },
      headers: {
        'X-RapidAPI-Key': '122d1b3a3amshaea5e7dab62ae7fp1f22c9jsn2647a22ffe86',
        'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
      }
    };
    Axios.request(search).then(response => {
      let quotes = response.data.quotes;
      if (quotes.length === 0) {
        setOptions([])
        return;
      }

      let temp = []
      quotes.forEach(quote => {
        temp.push({ symbol: quote.symbol, shortname: quote.shortname })
      })
      setOptions(temp);
    })
  }

  const handleNavPageClick = (e) => {
    navigate("/" + e.currentTarget.value)
  }

  const handleKeyPress = (e) => {
    // enter button
    if (e.keyCode === 13 && options.length > 0 && e.target.value) {
      console.log(options[0])
      const element = options[0];
      console.log("element...")
      console.log(element)
      setSearchValue(element)
    }
  }

const onLogoutClick = () => {
  localStorage.clear();
  setUserInfo({ username: "", isLoggedIn: false })
  navigate("/")
}

const handleSearchInput = (newInput) => {
  if (newInput === "")
    setOptions([])

  setSearchInput(newInput)
}

const handleSearchValue = (event, newValue) => {
  console.log(event)
  if (event.keyCode === 13 && options.length > 0)
  {
    console.log('ran')
    navigate("/securityinfo", { state: { symbol: options[0].symbol } })
    resetSearch();
    return;
  }
    

  const symbol = newValue.symbol;
  navigate("/securityinfo", { state: { symbol: symbol } })
  resetSearch();
}

const resetSearch = () => {
  setSearchInput("")
  setSearchValue(null)
  setOptions([])
}


return (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={handleNavPageClick}
              sx={{ my: 2, color: 'white', display: 'block' }}
              value={page}
            >
              {page}
            </Button>
          ))}

          <DepositDialog username={username}></DepositDialog>
          <WithdrawDialog username={username}></WithdrawDialog>
        </Box>
        <Autocomplete
          freeSolo
          sx={{ width: 400 }}
          id="free-solo-demo"
          value={searchValue}
          getOptionLabel={(option) => option.symbol}
          onChange={(event, newValue) => handleSearchValue(event, newValue)}
          inputValue={searchInput}
          onInputChange={(event, newInput) => handleSearchInput(newInput)}
          openOnFocus={options.length > 0}
          options={options}
          filterOptions={(x) => x}
          renderInput={(params) => (
            <TextField
              {...params}
              className="textfield"
              sx={{ input: { color: 'white' } }}
              variant="outlined"
              id="input-with-icon-textfield"
              placeholder='Search...'
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'white' }}>
                    <SearchIcon />
                  </InputAdornment>
                )

              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>({option.symbol}) {option.shortname}</li>
            // <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            //   {(option.symbol)} {option.shortname}
            // </Box>
          )}
        />

        {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <Autocomplete
              freeSolo
              sx={{ width: 300 }}
              id="free-solo-demo"
              getOptionLabel={(option) => option.symbol}
              open={options.length > 0}
              options={options}
              filterOptions={(x) => x}
              renderInput={(params) => (
                <StyledInput
                  {...params}
                  placeholder='Search...'
                  inputProps={{ 'aria-label': 'search' }}
                />
              )}
            />
          </Search> */}

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            color="inherit"
            href='/profile'
          >
            <AccountCircle />
          </IconButton>
          <Button
            sx={{ my: 2, ml: 2, color: 'white', display: 'block' }}
            onClick={onLogoutClick}
          >Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  </Box >
);
}
