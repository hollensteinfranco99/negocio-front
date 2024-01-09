import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuHorizontal from './common/MenuHorizontal';
import Navegador from './common/Navegador';
import Inicio from './components/inicio';
import Caja from './components/Caja/Caja';
import Movimiento from './components/Movimiento/Movimiento';
import Pedido from './components/Pedido/Pedido';
import Producto from './components/Producto/Producto';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompraPedido from './components/Pedido/CompraPedido';
import Venta from './components/Venta/Venta';
import VentaRealizada from './components/Venta/VentaRealizada';
import DetalleComprobante from './components/Venta/DetalleComprobante';
import ListaProductoModal from './components/Producto/ListaProductoModal';
import ListaPedidosModal from './components/Pedido/ListaPedidosModal';
import CajaMovimientos from './components/Caja/CajaMovimientos';




function App() {

  return (
    <div className='d-flex'>
      <Router>
      <MenuHorizontal></MenuHorizontal>
      <Navegador ></Navegador>
      {/* ====================================== */}
      <Routes>
      <Route exact path='/' element={<Inicio></Inicio>}></Route>
      <Route exact path='/caja' element={<Caja></Caja>}></Route>
      <Route exact path='/historial-caja/:id' element={<CajaMovimientos></CajaMovimientos>}></Route>
      <Route exact path='/pedido' element={<Pedido></Pedido>}></Route>
      <Route exact path='/lista-pedidos' element={<ListaPedidosModal></ListaPedidosModal>}></Route>
      <Route exact path='/producto' element={<Producto></Producto>}></Route>
      <Route exact path='/movimiento' element={<Movimiento></Movimiento>}></Route>
      <Route exact path='/compra-pedido' element={<CompraPedido></CompraPedido>}></Route>
      <Route path='/compra-pedido/:id' element={<CompraPedido></CompraPedido>}></Route>

      <Route exact path='/detalle-comprobante-compra/:id' element={<DetalleComprobante></DetalleComprobante>}></Route>
      <Route exact path='/venta' element={<Venta></Venta>}></Route>
      
      <Route exact path='/venta/:id' element={<Venta></Venta>}></Route>
      <Route exact path='/venta-realizada' element={<VentaRealizada></VentaRealizada>}></Route>
      <Route exact path='/detalle-comprobante-venta/:id' element={<DetalleComprobante></DetalleComprobante>}></Route>
      <Route exact path='/listaProducto/:id' element={<ListaProductoModal></ListaProductoModal>}></Route>
      </Routes>
      </Router>
    </div>
  );
}

export default App;

