import logo from './logo.svg';
import Home from './pages/Home/Home';
import Analysis from './pages/Analysis/Analysis';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
