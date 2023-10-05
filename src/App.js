import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import ReportAllBuy from './pages/ReportAllBuy';
import ReportAllSold from './pages/ReportallSold';
import About from './pages/About';

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer></ToastContainer>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/buy" element={<Buy/>} />
          <Route path="/sell" element={<Sell/>} />
          <Route path="/allbuy" element={<ReportAllBuy/>} />
          <Route path="/allsale" element={<ReportAllSold/>} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
