import React, { useEffect, useState } from 'react';
import '../../css/consulta.css';
import { useNavigate } from 'react-router-dom';

const Pedido = (props) => {
    const [pedidos, setPedidos] = useState([]);
    const URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        consultarPedidos();
    }, []);

    const consultarPedidos = async (input) => {
        try {
            const url = input
            ? `${URL}/compraPedido?q=${input}`
            : `${URL}/compraPedido`;
            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setPedidos(listar);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const verDetalle = (id) => {
        navigate('/detalle-comprobante-compra/' + id);
    }
    const handleAgregarClick = () => {
        navigate('/compra-pedido');
    };
    const handleChange = (e) => {
        consultarPedidos(e.target.value);
    }
    return (
        <section className='w-100 mt-3'>
            <div className='m-5 text-center'>
                <h1>Pedidos</h1>
            </div>
            <div className='contenedor-buscar'>
                <section className=' mt-5 d-flex justify-content-center align-items-center'>
                    <form>
                        <div className='form-group d-flex me-1'>
                            <input onChange={(e) => handleChange(e)} className='form-control me-1' type="search" placeholder='Buscar' />
                        </div>
                    </form>
                    <button disabled={props.verDetalle ? true : false} onClick={handleAgregarClick} className='btn btn-success my-1'>Agregar</button>
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
                                    return <tr key={index}>
                                        <td>{ped.fecha_registro}</td>
                                        <td>{ped.proveedor}</td>
                                        <td>{ped.nro_factura}</td>
                                        <td>{ped.total}</td>
                                        <td>{ped.estado}</td>
                                        <td><button onClick={() => verDetalle(ped._id)}  className='btn btn-warning'>Ver</button></td>
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

export default Pedido;