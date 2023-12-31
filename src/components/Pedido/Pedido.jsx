import React from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';

const Pedido = () => {
    const navigate = useNavigate();

    const handleAgregarClick = () => {
        navigate('/compra-pedido');

    };
    return (
        <section className='w-100 mt-3'>
            <div className='m-5 text-center'>
                <h1>Pedidos</h1>
            </div>
            <div className='contenedor-buscar'>
                <section className=' mt-5 d-flex justify-content-center align-items-center'>
                    <form>
                        <div className='form-group d-flex me-1'>
                            <input className='form-control me-1' type="search" placeholder='Buscar' />
                            <button type='submit' className='btn btn-dark'>Buscar</button>
                        </div>
                    </form>
                    <button onClick={handleAgregarClick} className='btn btn-success my-1'>Agregar</button>

                </section>
                <section className='my-5 contenedor-tabla'>
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Fecha</th>
                                <th>Nro-Factura</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th className='text-end'>Detalle</th>
                                <th>Cancelar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>20/10/2023</th>
                                <th>0001-00043</th>
                                <th>$800.00</th>
                                <th>Finalizado</th>
                                <th className='text-end'><button className='btn btn-warning'>Ver</button></th>
                                <th><button disabled className='btn btn-danger'>Cancelar</button></th>

                            </tr>
                            <tr>
                                <th>20/10/2023</th>
                                <th>0001-00043</th>
                                <th>$1800.00</th>
                                <th>En proceso</th>
                                <th className='text-end'><button className='btn btn-warning'>Ver</button></th>
                                <th><button className='btn btn-danger'>Cancelar</button></th>
                            </tr>
                            <tr>
                                <th>20/10/2023</th>
                                <th>0001-00043</th>
                                <th>$800.00</th>
                                <th>Cancelado</th>
                                <th className='text-end'><button className='btn btn-warning'>Ver</button></th>
                                <th><button disabled className='btn btn-danger'>Cancelar</button></th>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </section>
    );
};

export default Pedido;