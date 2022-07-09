import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./components/LoginRegister/Login"
import Register from "./components/LoginRegister/Register"
import MyPortfolio from './components/Portfolio/MyPortfolio';
import { useState } from 'react';
import SecurityInfo from './components/SecurityPage/SecurityInfo'
import HomePage from './components/HomePage/HomePage';
import Navbar from './Navbar';

function App() {
  const [userInfo, setUserInfo] = useState({
    isLoggedIn: false,
    username: ""
  })

  function ShowNavbar() {
    if (userInfo.isLoggedIn) {
      return <Navbar username = {userInfo.username} setUserInfo = {setUserInfo}></Navbar>
    }
    else return null
  }

  return (
    <>
      <Router>
        <>
        <ShowNavbar></ShowNavbar>
          <Routes>
            <Route path="/" element={<Login setUserInfo = {setUserInfo}></Login>} />
            <Route path="/register" element={<Register></Register>} />
            <Route path="/portfolio" element={<MyPortfolio username={userInfo.username}></MyPortfolio>} />
            <Route path="/securityinfo" element={<SecurityInfo username={userInfo.username}></SecurityInfo>} />
            <Route path="/home" element={<HomePage></HomePage>} />
          </Routes>
        </>
      </Router>
    </>
  )
}

export default App;
