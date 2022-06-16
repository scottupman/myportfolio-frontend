import './App.css';
import 
{
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./components/Login"
import Register from "./components/Register"
import MyPortfolio from './components/MyPortfolio';
import { useState } from 'react';
import SecurityInfo from './components/SecurityInfo'
function App() {
  const [symbol, setSymbol] = useState("")
  const [userInfo, setUserInfo] = useState({
    isLoggedIn: false,
    username: "justinwustin200"
  })
  return (
  <Router>
    <>
      <Routes>
        <Route path = "/" element = {<Login></Login>} />
        <Route path = "/register" element = {<Register></Register>} />
        <Route path = "/portfolio" element = {<MyPortfolio username = {userInfo.username} setSymbol = {setSymbol}></MyPortfolio>} />
        <Route path = "/securityinfo" element = {<SecurityInfo symbol = {symbol}></SecurityInfo>} />
      </Routes>      
    </>
  </Router>
  )
}

export default App;
