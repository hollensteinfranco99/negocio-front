import React, { useState } from 'react';
import '../../css/consulta.css';
import ModalProducto from './ModalProducto';

const Producto = () => {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <section className='w-100 mt-3'>
        <div className='m-5 text-center'>
            <h1>Productos</h1>
        </div>
        <div className='contenedor-buscar'>
            <section className=' mt-5 d-flex justify-content-center align-items-center'>
                <form>
                    <div className='form-group d-flex me-1'>
                        <input className='form-control me-1' type="search" placeholder='Buscar' />
                        <button type='submit' className='btn btn-dark'>Buscar</button>
                    </div>
                </form>
                <button className='btn btn-success my-1' onClick={handleShow}>Agregar</button>
            </section>
            <section className='my-5 contenedor-tabla'>
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Codigo</th>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th className='text-end'>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>1</th>
                            <th>Pepsi</th>
                            <th>$800.00</th>
                            <th className='text-end'><button className='btn btn-warning'>Editar</button></th>
                            <th><button className='btn btn-danger'>Eliminar</button></th>
                        </tr>
                        <tr>
                            <th>2</th>
                            <th>Coca-cola</th>
                            <th>$1800.00</th>
                            <th className='text-end'><button className='btn btn-warning'>Editar</button></th>
                            <th><button className='btn btn-danger'>Eliminar</button></th>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>

        <ModalProducto showModal={showModal} handleClose={handleClose}></ModalProducto>
        </section>
    );
};

export default Producto;