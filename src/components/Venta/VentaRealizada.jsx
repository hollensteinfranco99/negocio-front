import React from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';

const VentaRealizada = () => {
    const navigate = useNavigate();

    const verDetalle = () =>{
        navigate('/detalle-comprobante');
    }
    

    return (
        <section className='w-100 mt-5 mx-2'>
            <section className='mt-4'>
                <article className='text-center'>
                    <h1>Realizar venta</h1>
                </article>
                <article>
                    <form className='container-fluid'>
                        {/* Primera fila */}
                        <article className='row'>
                            <div className='form-group col-6 mt-2'>
                                <label>Nro Factura</label>
                                <input className='form-control' type="number" />
                            </div>
                            <div className='col-3 d-flex align-items-end'>
                                <button className='btn btn-dark'>Buscar</button>
                            </div>
                        </article>
                        <article className='row'>
                            <div className='form-group col-6 mt-2'>
                                <label>Fecha desde</label>
                                <input className='form-control' type="date" />
                            </div>
                            <div className='form-group col-6 mt-2'>
                                <label>Fecha desde</label>
                                <input className='form-control' type="date" />
                            </div>
                        </article>
                    </form>

                    {/* Tabla */}
                    <article className='mt-4 mb-2 contenedor-tabla'>
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>NRO-FACTURA</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>FACT-0001-000051</th>
                                    <th>10/10/2023</th>
                                    <th>$15.000,00</th>
                                    <th><button onClick={()=>{verDetalle()}} className='btn btn-warning'>Ver</button></th>
                                </tr>
                                <tr>
                                    <th>FACT-0001-000052</th>
                                    <th>08/10/2023</th>
                                    <th>$20.000,00</th>
                                    <th><button onClick={()=>{verDetalle()}} className='btn btn-warning'>Ver</button></th>
                                </tr>
                            </tbody>
                        </table>
                    </article>
                </article>
            </section>
        </section>
    );
};

export default VentaRealizada;