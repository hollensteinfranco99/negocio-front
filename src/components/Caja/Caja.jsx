import React, { useState } from 'react';
import ModalCaja from './ModalCaja';
import '../../css/consulta.css';

const Caja = () => {
    const [showModal, setShowModal] = useState(false);
    const [verDetalle, setVerDetalle] = useState(false);

    const handleShow = () => {
        setShowModal(true)
        setVerDetalle(true);
    };
    const handleClose = () => setShowModal(false);

    return (
        <section className='w-100 mt-3'>
        <div className='m-5 text-center'>
            <h1>Historial Cajas</h1>
        </div>
        <div className='contenedor-buscar'>
            <section className=' mt-5 d-flex justify-content-center align-items-center'>
                <form>
                    <div className='form-group d-flex justify-content-end align-items-end'>
                    
                    <article className='d-flex'>
                    <div className='d-flex'>
                        <div className="form-group me-1 mt-3">
                            <label>Fecha desde: </label>
                            <input className='form-control' type='date' />
                        </div>
                    </div>
                    <div className='d-flex'>
                        <div className="form-group me-1 mt-3">
                            <label>Fecha hasta: </label>
                            <input className='form-control' type='date' />
                        </div>
                    </div>
                    </article>

                        <button type='submit' className='btn btn-dark'>Buscar</button>
                    </div>
                </form>
            </section>
            <section className='my-5 contenedor-tabla'>
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Fecha</th>
                            <th>Nro Caja</th>
                            <th>Estado</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>15/03/2023</th>
                            <th>CAJA NRO-000003</th>
                            <th>Cerrada</th>
                            <th><button onClick={handleShow} className='btn btn-warning'>Ver</button></th>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
        <ModalCaja verDetalle={verDetalle} showModal={showModal} handleClose={handleClose}></ModalCaja>

        </section>
    );
};

export default Caja;