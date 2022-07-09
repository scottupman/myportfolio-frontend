import * as React from 'react';
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
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import Autocomplete from '@mui/material/Autocomplete';
import TradeDialog from './components/SecurityPage/TradeDialog';
import DepositDialog from './DepositDialog';
import WithdrawDialog from './WithdrawDialog';
//import yahooFinance from 'yahoo-finance2';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Navbar({ username, setUserInfo }) {

  let navigate = useNavigate()

  const pages = ["home", "portfolio"]
  const [showDeposit, setShowDeposit] = React.useState(false)
  const [showWithdraw, setShowWithdraw] = React.useState(false)
  const [searchInput, setSearchInput] = React.useState("")

  React.useEffect(() => {
    //fetchSearchResults();
  }, [searchInput])

  // const fetchSearchResults = async () =>{
  //   const query = "bitcoin"
  //   const result = await yahooFinance.search(query, {}, {devel: false})
  //   console.log(result);
  // }


  const handleNavPageClick = (e) => {
    navigate("/" + e.currentTarget.value)
  }

  const handleKeyPress = (e) => {
    if (e.keyCode == 13) // enter button
      console.log("value:", e.target.value)
  }

  const onLogoutClick = () => 
  {
    setUserInfo({username: "", isLoggedIn: false})
    navigate("/")
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
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <Autocomplete
              freeSolo
              id="search"
              options={["hi"]}
              renderInput={(params) => (
                <StyledInputBase
                  {...params}
                  placeholder="Search a Symbol"
                  inputProps={{ 'aria-label': 'search' }}
                  onKeyDown={handleKeyPress}
                />
              )}
            />
          </Search>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Button
              sx={{ my: 2, ml: 2, color: 'white', display: 'block' }}
              onClick = {onLogoutClick}
            >Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
