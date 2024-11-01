import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Nav from "./components/Nav/Nav";
import Vendas from "./pages/Vendas";
import Fornecedores from "./pages/Fornecedores";
import Produtos from "./pages/Produtos";

function App() {

  return (
    <>
   <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Clientes" element={<Clientes />} />
          <Route path="/Fornecedores" element={<Fornecedores />} />
          <Route path="/Vendas" element={<Vendas />} />
          <Route path="/Produtos" element={<Produtos />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
