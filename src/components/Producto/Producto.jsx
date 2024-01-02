import React, {useEffect, useState } from 'react';
import '../../css/consulta.css';
import ModalProducto from './ModalProducto';
import Swal from 'sweetalert2';

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        consultarProducto();
    }, [productos]);

    const consultarProducto = async () => {
        try {
            const url = searchInput
            ? `http://localhost:3004/producto?nombre_like=${searchInput}`
                : 'http://localhost:3004/producto';

            const res = await fetch(url);

            if (res.status === 200) {
                const listarProd = await res.json();
                setProductos(listarProd);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        consultarProducto();
    };
    const handleInputChange = (event) => {setSearchInput(event.target.value)};
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <section className='w-100 mt-3'>
            <div className='m-5 text-center'>
                <h1>Productos</h1>
            </div>
            <div className='contenedor-buscar'>
                <section className=' mt-5 d-flex justify-content-center align-items-center'>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group d-flex me-1'>
                            <input onChange={handleInputChange} className='form-control me-1' type="search" placeholder='Buscar' />
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
                            {
                                productos.map((prod, index)=>{
                                    return <tr key={index}>
                                    <th>{prod.codigo}</th>
                                    <th>{prod.nombre}</th>
                                    <th>${parseFloat(prod.precioVenta).toFixed(2)}</th>
                                    <th className='text-end'><button className='btn btn-warning'>Editar</button></th>
                                    <th><button className='btn btn-danger'>Eliminar</button></th>
                                </tr>
                                })
                            }
                            
                        </tbody>
                    </table>
                </section>
            </div>

            <ModalProducto showModal={showModal} handleClose={handleClose}></ModalProducto>
        </section>
    );
};

export default Producto;