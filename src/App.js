import './App.css';
import {useEffect} from "react"
import 
{
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./components/Login"
import Register from "./components/Register"
import MyPortfolio from './components/MyPortfolio';

function App() {
  return (
  <Router>
    <>
      <Routes>
        <Route path = "/" element = {<Login></Login>} />
        <Route path = "/register" element = {<Register></Register>} />
        <Route path = "/portfolio" element = {<MyPortfolio></MyPortfolio>} />
      </Routes>
    </>
  </Router>
  )
}

export default App;
