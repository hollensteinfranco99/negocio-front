import React, {useEffect, useState } from 'react';
import '../../css/consulta.css';
import ModalProducto from './ModalProducto';
import Swal from 'sweetalert2';

const Producto = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [productoEditar, setProductoEditar] = useState(null);
    const [agregarOeditar,setAgregarOeditar] = useState('');
    useEffect(() => {
            consultarProducto();
    }, []);

    
    const consultarProducto = async (searchInput) => {
        try {
            const url = searchInput
            ? `${URL}/producto?${isNaN(searchInput) ? 'nombre_like' : 'codigo_like'}=${searchInput}`
                : `${URL}/producto`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listarProd = await res.json();
                setProductos(listarProd);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const obtenerPorIdEditar = async (id) =>{
        try {
            const urlEditar =`${URL}/producto/${id}`;

            const res = await fetch(urlEditar);

            if (res.status === 200) {
                const producto = await res.json();
                setProductoEditar(() => {
                    setAgregarOeditar('editar');
                    setShowModal(true);
                    return producto;
                });            }
        } catch (error) {
            console.log(error);
        }
    }
    const eliminar = (id) =>{
        Swal.fire({
            title: "¿Estas seguro de eliminar el producto?",
            text: "Se eliminara de forma permanente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#14A44D",
            cancelButtonColor: "#DC4C64",
            confirmButtonText: "Si, estoy seguro",
            cancelButtonText: "Cancelar"
        }).then(async (result) =>{
            if(result.isConfirmed) {
                // Eliminar producto
                try {
                    const urlEliminar = `${URL}/producto/${id}`;
                    console.log(id);
                    const respuesta = await fetch(urlEliminar,{
                        method:'DELETE',
                        headers:{'Content-Type':'application/json'},
                    });
                    if(respuesta.status === 200){
                        Swal.fire({
                            title: 'Eliminado',
                            text:'El producto ha sido eliminado',
                            icon: 'success',
                            confirmButtonColor: "#14A44D",
                    })
                        consultarProducto();
                    }
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: "Error al completar su solicitud",
                        text: "Por favor, vuelva a intentarlo en unos minutos",
                        icon: "error"
                    });
                }
            }
        });
    }
    const handleInputChange = (event) => {
        event.preventDefault();
        consultarProducto(event.target.value);
    };
    const abrirAgregar = () => {
        setAgregarOeditar('agregar');
        setShowModal(true);
    };
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
                            <input onChange={handleInputChange}
                            className='form-control me-1' type="search" placeholder='Buscar' />
                        </div>
                    </form>
                    <button className='btn btn-success my-1' onClick={abrirAgregar}>Agregar</button>
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
                                    <th>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(prod.precioVenta))}</th>
                                    <th className='text-end'>
                                    <button onClick={()=>{obtenerPorIdEditar(prod.id)}} className='btn btn-warning'>Editar</button></th>
                                    <th><button onClick={()=>{eliminar(prod.id)}} className='btn btn-danger'>Eliminar</button></th>
                                </tr>
                                })
                            }
                            
                        </tbody>
                    </table>
                </section>
            </div>

            <ModalProducto
            productoEditar={productoEditar} 
            agregarOeditar={agregarOeditar}
            consultarProducto={consultarProducto} 
            productosLista= {productos}
            showModal={showModal} 
            handleClose={handleClose}>

            </ModalProducto>
        </section>
    );
};

export default Producto;