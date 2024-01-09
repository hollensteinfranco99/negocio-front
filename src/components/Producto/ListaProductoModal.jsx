import React, { useState, useEffect } from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

const ListaProductoModal = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
    const idOrigen = useParams();

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
    const obtenerProductoId = (id) => {
        if(idOrigen.id === '2'){
            navigate(`/compra-pedido/${id}`);
        }else{
            navigate(`/venta/${id}`);
        }
    }
    const volverParaAtras = () => {
        navigate(-1);
    }


    return (
        <section className='w-100 mt-3'>
            <article className='d-flex justify-content-around align-items-center'>
                <div className='my-5 ms-4'>
                    <button onClick={() => volverParaAtras()} className='btn-volver'>
                        <FontAwesomeIcon className='fa-xl' icon={faCircleArrowLeft} />
                    </button>
                </div>
                <div className='m-auto my-5'>
                    <h1>Productos</h1>
                </div>
            </article>
            <div className='contenedor-buscar'>
                <section className='my-5 contenedor-tabla'>
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Codigo</th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                productos.map((prod, index) => {
                                    return <tr key={index} onTouchStart={() => obtenerProductoId(prod.id)} onDoubleClick={() => obtenerProductoId(prod.id)}>
                                        <td>{prod.codigo}</td>
                                        <td>{prod.nombre}</td>
                                        <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(prod.precioVenta))}</td>
                                        <td>{prod.stock}</td>
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