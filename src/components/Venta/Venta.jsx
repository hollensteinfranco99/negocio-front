import React, { useEffect, useState, useRef } from 'react';
import '../../css/consulta.css';
import { useNavigate, useParams } from 'react-router-dom';
import { campoRequerido } from '../../common/helpers';
import Swal from 'sweetalert2';
import moment from 'moment';

const Venta = () => {
    const [tipoComprobante, setTipoComprobante] = useState('X');
    const URL = process.env.REACT_APP_API_URL;
    // State
    const [nombreProd, setNombreProd] = useState('');
    const [descuento, setDescuento] = useState('');
    const [cajaAbierta, setCajaAbierta] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    // Ref
    const nroFacturaRef = useRef(null);
    const descuentoTotalRef = useRef(null);
    const codigoRef = useRef(null);
    const precioVentaRef = useRef(null);
    const subTotalRef = useRef(null);
    const totalRef = useRef(null);
    const myFormRef = useRef(null);
    // Navigate y Params
    const navigate = useNavigate();
    const productoId = useParams();

    // Lista para detalle comprobante
    const [datos, setDatos] = useState([
    ]);
    const [nuevoDato, setNuevoDato] = useState({ producto_id: '', nombreProducto: '', precio: '', cantidad: '', subtotal: '' });


    useEffect(() => {
        if (productoId.id) {
            cargarProductoId(productoId.id);
        }
    }, [productoId]);
    useEffect(() => {
        obtenerCajaAbierta();
        generarFacturaUnica();
        // Al cargar el componente, intenta recuperar los datos del localStorage
        const datosGuardados = JSON.parse(localStorage.getItem('datos-venta'));
        const descuentosGuardados = JSON.parse(localStorage.getItem('descuentos-venta')) || ['0'];

        if (datosGuardados) {
            setDatos(datosGuardados);
            setDescuento(descuentosGuardados);
            descuentoTotalRef.current.value = parseFloat(descuentosGuardados || 0).toFixed(2) + " %";
            actualizarTotal(descuentosGuardados);

            // Calcular el subtotal total al cargar el componente
            const nuevoSubtotal = datosGuardados.reduce((acc, dato) => acc + parseFloat(dato.subtotal), 0);

            // Formatear el nuevo subtotal total como una cadena con formato de moneda
            const nuevoSubtotalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(nuevoSubtotal);

            // Actualizar el valor de subTotalRef con el nuevo subtotal total
            subTotalRef.current.value = nuevoSubtotalFormateado;
        }
    }, []);
    const generarFacturaUnica = async () => {
        try {
            const url = `${URL}/venta`;
            const res = await fetch(url);

            if (res.status === 200) {
                const pedidosLista = await res.json();

                if (pedidosLista) {
                    // Si hay productos en la lista, obtener el último código y agregar +1
                    const nuevoCodigo = (pedidosLista.length + 1).toString().padStart(7, '0');
                    nroFacturaRef.current.value = 'FACT-NRO-' + nuevoCodigo
                } else {
                    // Si la lista está vacía, generar el primer código
                    nroFacturaRef.current.value = 'FACT-NRO-0000001';
                }
            } else {
                console.error('Error al obtener datos del servidor:', res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };
    const seleccionarTipoComprobante = (e) => {
        setTipoComprobante(e.target.value)
    };
    const cargarProductoId = async (id) => {
        try {
            const urlProd = `${URL}/producto/${id}`;
            const res = await fetch(urlProd);

            if (res.status === 200) {
                const producto = await res.json();
                // no se si sacar esos 2 todavia
                codigoRef.current.value = producto.codigo;
                precioVentaRef.current.value = producto.precioVenta;
                setNombreProd(producto.nombre);
                setProductoSeleccionado(producto);
                obtenerDatos(producto);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const cargarProductoPorCodigo = async (codigo) => {
        try {
            const urlProd = `${URL}/productoPorCodigo?codigo=${codigo}`;
            const res = await fetch(urlProd);

            if (res.status === 200) {
                
                const producto = await res.json();
                if (producto) {
                    precioVentaRef.current.value = producto.precioVenta;
                    setNombreProd(producto.nombre);
                    setProductoSeleccionado(producto);
                    obtenerDatos(producto);
                } else {
                    setNombreProd('');
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    const abrirListaProducto = (e) => {
        e.preventDefault();

        if (e.key === 'Enter' || (e.type === 'click' && e.target.tagName === 'BUTTON')) {
            navigate(`/listaProducto/1`);
        }
    }
    const borrarTodo = (e) => {
        if (e.target.name === 'borrar-todo') {
            Swal.fire({
                title: "¿Estas seguro de eliminar?",
                text: "se borrara los productos agregados",
                icon: "question",
                confirmButtonColor: "#14A44D",
                cancelButtonColor: "#DC3545",
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar',
                showCancelButton: true,
                showConfirmButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    limpiarForm();
                }
            });
            return;
        }
    }
    const limpiarForm = () => {
        myFormRef.current?.reset();

        setNombreProd('');
        setDescuento('');
        setDatos([]);
        totalRef.current.value = '';
        subTotalRef.current.value = '';
        descuentoTotalRef.current.value = '0';
        codigoRef.current.value = '';
        generarFacturaUnica();
        localStorage.clear();
    }
    const handleProducto = (e) => {
        e.preventDefault();
        codigoRef.current.defaultValue = e.target.value;
        if (e.target.value.trim() !== '') {
            cargarProductoPorCodigo(e.target.value);
        } else {
            setNombreProd('');
        }
    }
    const agregarDescuento = () => {
        localStorage.setItem('descuentos-venta', JSON.stringify([descuento]));
        descuentoTotalRef.current.value = parseFloat(descuento || 0).toFixed(2) + " %";
        actualizarTotal();
    }
    // detalle
    const obtenerDatos = (valueOrEvent) => {
        if (valueOrEvent.target) {
            // Si es un evento (proviene de onChange, por ejemplo)
            const { name, value } = valueOrEvent.target;

            setNuevoDato((prevNuevoDato) => ({
                ...prevNuevoDato,
                [name]: value,
            }));
        } else {
            // Si es un valor directo (proviene de otro lugar)
            setNuevoDato((prevNuevoDato) => ({
                ...prevNuevoDato,
                nombreProducto: valueOrEvent.nombre,
                producto_id: valueOrEvent._id,
                precio: valueOrEvent.precioVenta
            }));
        }
    };
    const actualizarTotal = (desc) => {
        // Obtener los datos del localStorage y calcular el nuevo subtotal total
        const datosLocalStorage = JSON.parse(localStorage.getItem('datos-venta')) || [];
        const subtotal = datosLocalStorage.reduce((acc, dato) => acc + parseFloat(dato.subtotal), 0);
        let total;
        if (descuento || desc) {
            total = subtotal - (subtotal * (descuento || desc) / 100);
            total = parseFloat(total.toFixed(2));
        } else {
            total = parseFloat(subtotal.toFixed(2));
        }
        // Formatear el nuevo total como una cadena con formato de moneda
        const nuevoTotal = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total);
        totalRef.current.value = nuevoTotal;

    }
    const actualizarSubtotal = () => {
        // Obtener los datos del localStorage y calcular el nuevo subtotal total
        const datosLocalStorage = JSON.parse(localStorage.getItem('datos-venta')) || [];
        const nuevoSubtotal = datosLocalStorage.reduce((acc, dato) => acc + parseFloat(dato.subtotal), 0);

        // Formatear el nuevo subtotal total como una cadena con formato de moneda
        const nuevoSubtotalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(nuevoSubtotal);

        // Actualizar el valor de subTotalRef con el nuevo subtotal total
        subTotalRef.current.value = nuevoSubtotalFormateado;
    };
    const sumarCantidadPorProducto = (producto_id) => {
        const datosEnLocalStorage = JSON.parse(localStorage.getItem('datos-venta')) || [];
        const cantidadTotal = datosEnLocalStorage.reduce((total, dato) => {
            if (dato.producto_id === producto_id) {
                return total + parseFloat(dato.cantidad);
            }
            return total;
        }, 0);
        return cantidadTotal;
    };
    const agregarDatos = () => {
        const cantidadTotal = sumarCantidadPorProducto(productoSeleccionado._id);
        if (productoSeleccionado.stock < cantidadTotal || productoSeleccionado.stock < nuevoDato.cantidad && productoSeleccionado.permitirStockNegativo === false) {
            Swal.fire({
                title: 'No tiene stock suficiente',
                text: 'Para poder agregarlo, modifique el producto para permitir stock negativo',
                icon: 'error',
            });
            return;
        } else {
            // Validar
            if (nuevoDato.nombreProducto.trim() !== '' && nuevoDato.cantidad.trim() !== '') {
                // Calcular el subtotal
                const subtotal = parseFloat(nuevoDato.precio) * parseFloat(nuevoDato.cantidad);

                // Guardar datos
                const nuevoDatoConId = {
                    id: datos.length + 1,
                    ...nuevoDato,
                    subtotal: subtotal.toFixed(2),
                };
                // Actualizar estado y localStorage
                setDatos((prevDatos) => [...prevDatos, nuevoDatoConId]);
                localStorage.setItem('datos-venta', JSON.stringify([...datos, nuevoDatoConId]));

                // Actualizar subtotal total
                actualizarSubtotal();
                actualizarTotal();

                // Restablecer valores
                setNuevoDato({ nombreProducto: '', precio: '', cantidad: '', subtotal: '' });
                setNombreProd('');
                codigoRef.current.value = '';
                precioVentaRef.current.value = '';
            }
        }
    };
    const eliminarDato = (id) => {
        // Filtra los datos y actualiza el estado
        setDatos((prevDatos) => {
            const nuevosDatos = prevDatos.filter((dato) => dato.id !== id);

            // Actualiza el localStorage con los nuevos datos
            localStorage.setItem('datos-venta', JSON.stringify(nuevosDatos));

            // Actualizar subtotal total
            actualizarSubtotal();
            actualizarTotal();

            return nuevosDatos;
        });
    };
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
    const altaMovimiento = async () => {
        let nro_mov = await generarNumeroMov();

        try {
            const movimientoData = {
                descripcion: 'VENTA REALIZADA - ' + nroFacturaRef.current.value,
                monto: parseFloat(totalRef.current.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                fechaRegistro: moment().format('DD/MM/YY HH:mm'),
                tipoMovimiento: 'INGRESO',
                caja_id: cajaAbierta._id,
                nro_movimiento: nro_mov,
                estado: 'ACTIVO',
                pedido_id: null
            };
            let respuesta = await fetch(`${URL}/movimiento`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movimientoData)
            });
            return respuesta;
        } catch (error) {
            console.log(error);
        }
    }
    const editarCaja = async () => {
        try {
            const cajaEditarData = {
                fecha_apertura: cajaAbierta.fecha_apertura,
                fecha_cierre: cajaAbierta.fecha_cierre,
                monto_cierre: cajaAbierta.monto_cierre,
                monto_apertura: cajaAbierta.monto_apertura,
                monto_total: parseFloat(cajaAbierta.monto_total) +
                (parseFloat(totalRef.current.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0),
                
                diferencia: cajaAbierta.resultado_diferencia,
                nro_caja: cajaAbierta.nro_caja,
                estado_caja: cajaAbierta.estado_caja,
            };
            let respuesta;
            // EDITAR
            respuesta = await fetch(`${URL}/caja/${cajaAbierta._id}`, {
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
    const actualizarStockProd = async (idVenta) => {
        let respuesta;
        try {
            let productosVender = [];
            try {
                const response = await fetch(`${URL}/detalleComprobanteVenta?venta_id=${idVenta}`);

                if (response.status === 200) {
                    const detallesComprobante = await response.json();
                    productosVender = detallesComprobante || [];
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }


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
                        stock: parseFloat(prodEncontrado.stock) - parseFloat(item.cantidad)
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

        const datosGuardados = localStorage.getItem('datos-venta');

        // Validar
        if (!cajaAbierta) {
            Swal.fire({
                title: 'La caja no se encuentra abierta',
                text: 'Para poder realizar su solicitud necesita que la caja se encuentre abierta',
                icon: 'error',
            });
            return;
        }
        if (!datosGuardados) {
            // Sweet alert de error
            Swal.fire({
                title: "No se pudo realizar la venta",
                text: "Por favor completar la venta de forma correcta",
                icon: "error"
            });
            return;
        } else {
            try {
                // ALTA MOVIMIENTO
                let respuestaMovimiento = await altaMovimiento();
                // Alta de venta/comprobante
                if (respuestaMovimiento.status === 201) {
                    const movimientoCreado = await respuestaMovimiento.json();
                    const idMovimiento = movimientoCreado.movimiento._id;
                    

                    const ventaData = {
                        tipo_comprobante: tipoComprobante,
                        nro_factura: nroFacturaRef.current.value,
                        fecha_registro: moment().format('DD/MM/YY HH:mm'),
                        subtotal: parseFloat(subTotalRef.current.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                        descuento: parseFloat(descuentoTotalRef.current.value.match(/\d+/)) || 0,
                        total: parseFloat(totalRef.current.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                        estado: 'FINALIZADO',
                        movimiento_id: idMovimiento
                    };
                    const respuestaVenta = await fetch(`${URL}/venta`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(ventaData)
                    });

                    if (respuestaVenta.status === 201) {
                        const ventaCreada = await respuestaVenta.json();
                        const idVentaGenerada = ventaCreada.venta._id;
                        const datosGuardados = JSON.parse(localStorage.getItem('datos-venta'));

                        // Alta de detalle comprobante venta
                        for (const dato of datosGuardados) {
                            const detalleVenta = {
                                producto_id: dato.producto_id,
                                venta_id: idVentaGenerada,
                                nombre_producto: dato.nombreProducto,
                                cantidad: dato.cantidad,
                                precio_unitario: dato.precio,
                                subtotal: dato.subtotal
                            };

                            // Alta de detalle comprobante venta para cada elemento del array
                            const respuestaDetalleVenta = await fetch(`${URL}/detalleComprobanteVenta`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(detalleVenta)
                            });

                            if (respuestaDetalleVenta.status === 201) {

                                // EDITAR CAJA
                                let caja = await editarCaja();
                                // EDITAR PRODUCTO
                                let prodActualizar = await actualizarStockProd(idVentaGenerada);

                                if (caja === true && prodActualizar === true) {
                                    // MENSAJE DE EXITO
                                    Swal.fire({
                                        title: 'Venta realizada',
                                        text: 'Se realizó la operación correctamente',
                                        icon: 'success'
                                    });
                                } else {
                                    Swal.fire({
                                        title: 'Error al realizar la venta',
                                        text: 'Hubo un problema en la solicitud',
                                        icon: 'error'
                                    });
                                }
                            } else {
                                console.error('Error al crear detalle de comprobante:', respuestaDetalleVenta.statusText);
                            }
                        }
                        limpiarForm();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <section className='w-100 mt-5 mx-2'>
            <section className='mt-4'>
                <article className='text-center'>
                    <h1>Realizar venta</h1>
                </article>
                <article>
                    <form ref={myFormRef} onSubmit={handleSubmit} className='container-fluid'>
                        {/* Primera fila */}
                        <article className='row'>
                            <div className='form-group col-6 mt-2'>
                                <label className='mt-1'>Nro Factura</label>
                                <input ref={nroFacturaRef} disabled className='form-control' type="text" />
                            </div>
                            <div className='form-group col-6 mt-2'>
                                <label className='mt-1'>Tipo de comprobante</label>
                                <select className='form-select' value={tipoComprobante} onChange={seleccionarTipoComprobante}>
                                    <option value="X">X</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                </select>
                            </div>
                        </article>
                        {/* Segunda fila */}
                        <article className='row'>
                            <div className='form-group col-3 mt-2'>
                                <label>Codigo</label>
                                <input ref={codigoRef} onChange={(e) => handleProducto(e)} className='form-control' type="number" />
                            </div>
                            <div className='form-group col-6 mt-2'>
                                <label>Producto</label>
                                <input defaultValue={nombreProd} disabled className='form-control' type="text" />
                            </div>
                            <div className='col-3 d-flex align-items-end'>
                                <button onClick={(e) => abrirListaProducto(e)} className='btn btn-dark'>Buscar</button>
                            </div>
                        </article>
                        {/* Tercera fila */}
                        <article className='row'>
                            <div className='form-group col-6 col-lg-3 mt-2'>
                                <label>Cantidad</label>
                                <input name='cantidad' value={nuevoDato.cantidad} onChange={(e) => obtenerDatos(e)} placeholder='0' className='form-control' type="number" />
                            </div>
                            <div className='form-group col-6 col-lg-3 mt-2'>
                                <label>Precio unitario</label>
                                <input ref={precioVentaRef} name='precio' disabled placeholder='0.00' step='0.1' className='form-control' type="number" />
                            </div>
                            <div className='form-group col-6 col-lg-3 mt-2'>
                                <label>Descuento</label>
                                <input onChange={(e) => setDescuento(e.target.value)} placeholder='0.00' step='0.1' className='form-control' type="number" />                            </div>
                            <article className='container row col-6 col-lg-3'>

                                {/* Botones */}
                                <div className='mt-2 col-12 d-flex align-items-end justify-content-end'>
                                    <button onClick={() => agregarDatos()} type='button' className='btn btn-success px-3'>+ Agregar</button>
                                </div>
                                <div className='mt-2 col-12 d-flex align-items-end justify-content-end'>
                                    <button type='button' onClick={() => agregarDescuento()} className='btn btn-dark btn-group me-1'>Descuento</button>
                                </div>
                                <div className='mt-2 col-12 d-flex align-items-end justify-content-end'>
                                    <button name='borrar-todo' onClick={(e) => borrarTodo(e)} type='button' className='btn btn-danger btn-group'>Borrar todo</button>
                                </div>
                            </article>
                        </article>
                        {/* Tabla */}
                        <article className='mt-4 mb-2 contenedor-tabla tabla-pedido'>
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datos.map((dato) => (
                                        <tr key={dato.id}>
                                            <td>{dato.nombreProducto}</td>
                                            <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(dato.precio))}</td>
                                            <td>{dato.cantidad}</td>
                                            <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(dato.subtotal))}</td>
                                            <td>
                                                <button className='btn btn-danger' onClick={() => eliminarDato(dato.id)}>
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </article>
                        {/* Subtotal */}
                        <article className='row'>

                            <article className='col-12' aria-label='subtotal'>
                                <div className='row d-flex align-items-center justify-content-end'>
                                    <label className='col-3 text-end'>Subtotal</label>
                                    <div className='col-6'>
                                        <input ref={subTotalRef} className='mt-2 form-control text-end' placeholder='$0.00' disabled type='text'></input>
                                    </div>
                                </div>
                                <div className='row d-flex align-items-center justify-content-end'>
                                    <label className='col-3 text-end'>Descuento</label>
                                    <div className='col-6'>
                                        <input ref={descuentoTotalRef} className='mt-2 form-control text-end' placeholder='0.00 %' disabled type='text'></input>
                                    </div>
                                </div>
                                <div className='row d-flex align-items-center justify-content-end'>
                                    <label className='col-3 text-end'>Total</label>
                                    <div className='col-6'>
                                        <input ref={totalRef} className='mt-2 form-control text-end' placeholder='$0.00' disabled type='text'></input>
                                    </div>
                                </div>
                            </article>
                            <article className='col-12 d-flex justify-content-end align-items-end my-3' aria-label='btn-pedido'>
                                <button className='btn btn-lg btn-success'>Realizar pedido</button>
                            </article>
                        </article>
                    </form>
                </article>
            </section>
        </section>
    );
};

export default Venta;