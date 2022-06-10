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
import SecurityInfo from './components/SecurityInfo';

function App() {
  return (
  <Router>
    <>
      <Routes>
        <Route path = "/" element = {<Login></Login>} />
        <Route path = "/register" element = {<Register></Register>} />
        <Route path = "/portfolio" element = {<MyPortfolio></MyPortfolio>} />
        <Route path = "/SecurityInfo" element = {<SecurityInfo></SecurityInfo>} />
      </Routes>
    </>
  </Router>
  )
}

export default App;
