import React, { useState, useEffect } from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';


const ListaProductoModal = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

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
    const obtenerProductoId = (id) => {navigate(`/compra-pedido/${id}`)}



    return (
        <section className='w-100 mt-3'>
            <div className='m-5 text-center'>
                <h1>Productos</h1>
            </div>
            <div className='contenedor-buscar'>
                <section className='my-5 contenedor-tabla'>
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Codigo</th>
                                <th>Producto</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                productos.map((prod, index) => {
                                    return <tr key={index} onTouchStart={()=> obtenerProductoId(prod.id)} onDoubleClick={() => obtenerProductoId(prod.id)}>
                                        <td>{prod.codigo}</td>
                                        <td>{prod.nombre}</td>
                                        <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(prod.precioVenta))}</td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </section>
            </div>
        </section>
    );
};

export default ListaProductoModal;