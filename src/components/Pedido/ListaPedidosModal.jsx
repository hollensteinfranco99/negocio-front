import React, { useState, useEffect } from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';


const ListaPedidosModal = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [pedidos, setPedidos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        consultarPedidos();
    }, []);


    const consultarPedidos = async (searchInput) => {
        try {
            const url = searchInput
            ? `${URL}/compra-pedido?q=${searchInput}&estado=${encodeURIComponent('EN PROCESO')}`
            : `${URL}/compra-pedido?estado=${encodeURIComponent('EN PROCESO')}`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setPedidos(listar);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const obtenerPedidoId = (id) => {
        navigate(`/movimiento`, { state: { id: id } });
    }
    const handleChange = (e) => {
        consultarPedidos(e.target.value);
    }


    return (
        <section className='w-100 mt-3'>
            <div className='m-5 text-center'>
                <h1>Productos</h1>
            </div>
            <div className='contenedor-buscar'>
            <section className=' mt-5 d-flex justify-content-center align-items-center'>
                    <form>
                        <div className='form-group d-flex me-1'>
                            <input onChange={(e) => handleChange(e)} className='form-control me-1' type="search" placeholder='Buscar' />
                        </div>
                    </form>
                </section>
                <section className='my-5 contenedor-tabla'>
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Fecha</th>
                                <th>Proveedor</th>
                                <th>Nro-Factura</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pedidos.map((ped, index) => {
                                    return <tr key={index} onTouchStart={() => obtenerPedidoId(ped.id)} onDoubleClick={() => obtenerPedidoId(ped.id)}>
                                        <td>{ped.fecha_registro}</td>
                                        <th>{ped.proveedor}</th>
                                        <th>{ped.nro_factura}</th>
                                        <td>{ped.total}</td>
                                        <th>{ped.estado}</th>
                                        <th><button className='btn btn-warning'>Ver</button></th>
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

export default ListaPedidosModal;
