import React, { useEffect, useRef, useState } from 'react';
import '../../css/consulta.css';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

const DetalleComprobante = () => {
    const URL = process.env.REACT_APP_API_URL;
    const [detalleVentas, setDetalleVentas] = useState(null);
    const [venta, setVenta] = useState(null);
    const [cajaAbierta, setCajaAbierta] = useState(null);

    const botonCancelarRef = useRef(null);
    const ventaId = useParams();
    

    useEffect(() => {
        if (ventaId) {
            obtenerCajaAbierta();
            consultarDetalle(ventaId.id);
            consultarFactura(ventaId.id);
        }
    }, []);

    const consultarDetalle = async (id) => {
        try {
            let url = `${URL}/detalleComprobanteVenta?venta_id=${id}`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setDetalleVentas(listar);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const consultarFactura = async (id) => {
        try {
            let url = `${URL}/venta/${id}`;

            const res = await fetch(url);

            if (res.status === 200) {
                const listar = await res.json();
                setVenta(listar);
                if(listar.estado === 'CANCELADO'){
                    botonCancelarRef.current.disabled = true;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const obtenerCajaAbierta = async () => {
        try {

            const response = await fetch(`${URL}/caja`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                const cajasAbiertas = data.filter(caja => caja.estado_caja === 'ABIERTA');

                // Verificar si hay al menos una caja abierta
                if (cajasAbiertas.length > 0) {
                    setCajaAbierta(cajasAbiertas[0]);
                }
            } else {
                console.log('Error al obtener el estado de la caja');
            }
        } catch (error) {
            console.error('Error en la consulta:', error);
        }
    }
    const editarCaja = async () => {
        try {
            const cajaEditarData = {
                fecha_apertura: cajaAbierta.fecha_apertura,
                fecha_cierre: cajaAbierta.fecha_cierre,
                monto_cierre: cajaAbierta.monto_cierre || 0,
                monto_apertura: cajaAbierta.monto_apertura || 0,
                monto_total: parseFloat(cajaAbierta.monto_total) - parseFloat(venta.total),
                diferencia: cajaAbierta.resultado_diferencia || 0,
                nro_caja: cajaAbierta.nro_caja,
                estado_caja: cajaAbierta.estado_caja,
            };
            let respuesta;
            // EDITAR
            respuesta = await fetch(`${URL}/caja/${cajaAbierta.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cajaEditarData)
            });
            if (respuesta.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    const generarNumeroMov = async () => {
        try {
            const url = `${URL}/movimiento`;
            const res = await fetch(url);

            if (res.status === 200) {
                const lista = await res.json();

                const ultimoMovimiento = lista[lista.length - 1];
                if (ultimoMovimiento) {
                    // Si hay productos en la lista, obtener el último código y agregar +1
                    const nuevoCodigo = (lista.length + 1).toString().padStart(7, '0');
                    return 'MOV-' + nuevoCodigo
                } else {
                    // Si la lista está vacía, generar el primer código
                    return 'MOV-0000001';
                }
            } else {
                console.error('Error al obtener datos del servidor:', res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };
    const altaMovimiento = async () => {
        let nro_mov = await generarNumeroMov();

        try {
            // DATOS AGREGAR
            const movimientoData = {
                descripcion: 'CANCELACION DE VENTA NRO - ' + venta.nro_factura,
                monto: venta.total,
                fechaRegistro: moment().format('DD/MM/YY HH:mm'),
                tipoMovimiento: 'EGRESO',
                caja_id: cajaAbierta.id,
                nro_movimiento: nro_mov,
                estado: 'CANCELADO'
            };
            // OBTENER DATOS
            const urlEditar = `${URL}/movimiento/${venta.movimiento_id}`;
            const res = await fetch(urlEditar);
            if (res.status === 200) {
                const movEditar = await res.json();
                // EDITAR DATOS
                const movimientoEditarData = {
                    descripcion: movEditar.descripcion,
                    monto: movEditar.monto,
                    fechaRegistro: movEditar.fechaRegistro,
                    tipoMovimiento: movEditar.tipoMovimiento,
                    caja_id: movEditar.caja_id,
                    nro_movimiento: movEditar.nro_movimiento,
                    estado: 'CANCELADO'
                }
                // AGREGAR MOVIMIENTO CANCELANDO OPERACION
                let respuesta = await fetch(`${URL}/movimiento`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(movimientoData)
                });
                // EDITAR MOVIMIENTO VINCULADO
                let respuestaMovEditar = await fetch(`${URL}/movimiento/${venta.movimiento_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(movimientoEditarData)
                });
                if (respuesta.status === 201 && respuestaMovEditar.status === 200) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    const actualizarStockProd = async () => {
        try {
            let respuesta;
            let productosVender = detalleVentas || [];

            for (const item of productosVender) {
                // Obtener información del producto según el productoId
                const productoResponse = await fetch(`${URL}/producto/${item.producto_id}`);

                if (productoResponse.status === 200) {
                    const prodEncontrado = await productoResponse.json();

                    const productoData = {
                        nombre: prodEncontrado.nombre,
                        codigo: prodEncontrado.codigo,
                        marca: prodEncontrado.marca,
                        tipoProducto: prodEncontrado.tipoProducto,
                        precioVenta: prodEncontrado.precioVenta,
                        imagen: prodEncontrado.imagen,
                        stock: parseFloat(prodEncontrado.stock) + parseFloat(item.cantidad)
                    };

                    // EDITAR
                    respuesta = await fetch(`${URL}/producto/${item.producto_id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(productoData)
                    });
                    if (respuesta.status === 200) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!cajaAbierta){
            Swal.fire({
                title: 'La caja no se encuentra abierta',
                text: 'Para poder realizar su solicitud necesita que la caja se encuentre abierta',
                icon: 'error',
            });
            return;
        }
        try {
            // Alta de venta/comprobante

            const ventaData = {
                tipo_comprobante: venta.tipo_comprobante,
                nro_factura: venta.nro_factura,
                fecha_registro: venta.fecha_registro,
                subtotal: venta.subtotal,
                descuento: venta.descuento,
                total: venta.total,
                estado: 'CANCELADO',
                movimiento_id: venta.movimiento_id
            };
            const respuestaVenta = await fetch(`${URL}/venta/${venta.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ventaData)
            });

            if (respuestaVenta.status === 200) {
                const idVentaGenerada = (await respuestaVenta.json()).id;

                // ALTA MOVIMIENTO
                let mov = await altaMovimiento();
                // EDITAR CAJA
                let caja = await editarCaja();
                // EDITAR PRODUCTO
                let prodActualizar = await actualizarStockProd(idVentaGenerada);

                if (mov === true && caja === true && prodActualizar === true) {
                    // MENSAJE DE EXITO
                    Swal.fire({
                        title: 'Venta cancelada',
                        text: 'Se realizó la operación correctamente',
                        icon: 'success'
                    });
                } else {
                    Swal.fire({
                        title: 'Error al realizar la cancelacion',
                        text: 'Hubo un problema en la solicitud',
                        icon: 'error'
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <section className='w-100 mt-5 mx-2'>
            <section className='mt-4'>
                <article>
                    <form onSubmit={(e) => handleSubmit(e)} className='container-fluid'>
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
                                <button ref={botonCancelarRef} type='submit' className='btn btn-lg btn-danger'>Cancelar venta</button>
                            </article>
                            <div className='col-6 ms-auto' aria-label='subtotal'>
                                <input className='mt-1 form-control text-end' value={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(venta?.subtotal || 0))} disabled type='text'></input>
                                <input className='mt-1 form-control text-end' value={venta?.descuento || 0} disabled type='text'></input>
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