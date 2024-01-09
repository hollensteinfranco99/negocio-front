import React, { useEffect, useState } from 'react';
import '../../css/consulta.css';
import { useParams } from 'react-router-dom';

const DetalleComprobante = () => {
    const [detalleVentas, setDetalleVentas] = useState(null);
    const [venta, setVenta] = useState(null);

    const ventaId = useParams();
    const URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (ventaId) {
            consultarDetalle(ventaId.id);
            consultarFactura(ventaId.id);
        }
    }, []);

    const consultarDetalle = async (id) => {
        try {
            let url = `${URL}/detalle-comprobante-venta?venta_id=${id}`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setDetalleVentas(listar);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const consultarFactura = async (id) =>{
        try {
            let url = `${URL}/venta/${id}`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setVenta(listar);
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
                            <div className='form-group col-lg-4 col-md-6 col-sm-6 mt-2'>
                                <label className='mt-1'>Nro Factura</label>
                                <input disabled value={venta?.nro_factura || ''} className='form-control' type="text" />
                            </div>
                            <div className='form-group col-lg-4 col-md-6 col-sm-6 mt-2'>
                                <label className='mt-1'>Tipo de comprobante</label>
                                <input className='form-control' type="text" disabled value={venta?.tipo_comprobante || ''} />
                            </div>
                            <div className='form-group col-lg-4 col-md-6 col-sm-6 mt-2'>
                                <label className='mt-1'>Fecha registro</label>
                                <input value={venta?.fecha_registro || ''} className='form-control' type="text" disabled />
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
                                        detalleVentas?.map((det, index) => {
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
                        <article className='col-6'>
                            <button className='btn btn-lg btn-danger'>Cancelar venta</button>
                        </article>
                            <div className='col-6 ms-auto' aria-label='subtotal'>
                                <input className='mt-1 form-control text-end' value={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(venta?.subtotal || 0))} disabled type='text'></input>
                                <input className='mt-1 form-control text-end' value={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(venta?.descuento || 0))} disabled type='text'></input>
                                <input className='mt-1 form-control text-end' value={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(venta?.total || 0))} disabled type='text'></input>
                            </div>
                        </article>
                    </form>
                </article>
            </section>
        </section>
    );
};

export default DetalleComprobante;