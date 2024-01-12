import React, { useEffect, useRef, useState } from 'react';
import '../../css/consulta.css';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

const DetalleComprobanteCompra = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [detallePedidos, setDetallePedidos] = useState(null);
    const [pedido, setPedido] = useState(null);

    const pedidoId = useParams();
    

    useEffect(() => {
        if (pedidoId) {
            consultarDetalle(pedidoId.id);
            consultarFactura(pedidoId.id);
        }
    }, []);

    const consultarDetalle = async (id) => {
        try {
            let url = `${URL}/detalleComprobanteCompra?pedido_id=${id}`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setDetallePedidos(listar);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const consultarFactura = async (id) => {
        try {
            let url = `${URL}/compraPedido/${props.productoEditar.id}`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setPedido(listar);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <section className='w-100 mt-5 mx-2'>
            <section className='mt-4'>
                <article>
                    <form className='container-fluid'>
                        {/* Primera fila */}
                        <article className='row'>
                        <div className='form-group col-6 mt-2'>
                                <label className='mt-1'>Nro Factura</label>
                                <input value={pedido?.nro_factura || ''} className='form-control' type="text" disabled />
                            </div>
                            <div className='form-group col-6 mt-2'>
                                <label className='mt-1'>Estado</label>
                                <input value={pedido?.estado || ''} className='form-control' type="text" disabled />
                            </div>
                            <div className='form-group col-lg-4 col-md-6 col-sm-6 mt-2'>
                                <label className='mt-1'>Proveedor</label>
                                <input disabled value={pedido?.proveedor || ''} className='form-control' type="text" />
                            </div>
                            <div className='form-group col-lg-4 col-md-6 col-sm-6 mt-2'>
                                <label className='mt-1'>Fecha estimada</label>
                                <input className='form-control' type="text" disabled value={pedido?.fecha_estimada || ''} />
                            </div>
                            <div className='form-group col-lg-4 col-md-6 col-sm-6 mt-2'>
                                <label className='mt-1'>Fecha registro</label>
                                <input value={pedido?.fecha_registro || ''} className='form-control' type="text" disabled />
                            </div>
                        </article>
                        {/* Tabla */}
                        <article className='mt-4 mb-2 contenedor-tabla'>
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        detallePedidos?.map((det, index) => {
                                            return <tr key={index}>
                                                <td>{det.nombre_producto}</td>
                                                <td>{det.precio_unitario}</td>
                                                <td>{det.cantidad}</td>
                                                <td>{det.subtotal}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </article>
                        {/* Subtotal */}
                        <article className='row'>
                            <div className='col-6 ms-auto' aria-label='subtotal'>
                                <input className='mt-1 form-control text-end' value={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(pedido?.subtotal || 0))} disabled type='text'></input>
                                <input className='mt-1 form-control text-end' value={pedido?.descuento || 0} disabled type='text'></input>
                                <input className='mt-1 form-control text-end' value={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(pedido?.total || 0))} disabled type='text'></input>
                            </div>
                        </article>
                    </form>
                </article>
            </section>
        </section>
    );
};
export default DetalleComprobanteCompra;