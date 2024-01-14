import React, { useEffect, useState, useRef } from 'react';
import '../../css/consulta.css';
import { useNavigate, useParams } from 'react-router-dom';
import { campoRequerido } from '../../common/helpers';
import Swal from 'sweetalert2';
import moment from 'moment';
import { ClipLoader } from 'react-spinners';

const CompraPedido = () => {
    const URL = process.env.REACT_APP_API_URL;
    // State
    const [nombreProd, setNombreProd] = useState('');
    const [descuento, setDescuento] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [fechaEstimada, setFechaEstimada] = useState('');
    const [loading, setLoading] = useState(false);

    // Ref
    const descuentoTotalRef = useRef(null);
    const codigoRef = useRef(null);
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
        // Al cargar el componente, intenta recuperar los datos del localStorage
        const datosGuardados = JSON.parse(localStorage.getItem('datos'));
        const descuentosGuardados = JSON.parse(localStorage.getItem('descuentos')) || [];

        if (datosGuardados) {
            setDatos(datosGuardados);
            setDescuento(descuentosGuardados);
            descuentoTotalRef.current.value = parseFloat(descuentosGuardados).toFixed(2) + " %";
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
            const url = `${URL}/compraPedido`;
            const res = await fetch(url);

            if (res.status === 200) {
                const pedidosLista = await res.json();

                const ultimoPedido = pedidosLista[pedidosLista.length - 1];
                if (ultimoPedido) {
                    // Si hay productos en la lista, obtener el último código y agregar +1
                    const nuevoCodigo = (pedidosLista.length + 1).toString().padStart(7, '0');
                    return 'FACT-NRO-' + nuevoCodigo
                } else {
                    // Si la lista está vacía, generar el primer código
                    return 'FACT-NRO-0000001';
                }
            } else {
                console.error('Error al obtener datos del servidor:', res.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };
    const cargarProductoId = async (id) => {
        try {
            const urlProd = `${URL}/producto/${id}`;
            const res = await fetch(urlProd);

            if (res.status === 200) {
                const producto = await res.json();
                // no se si sacar esos 2 todavia
                codigoRef.current.value = producto.codigo;
                setNombreProd(producto.nombre);
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
                    setNombreProd(producto.nombre);
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
            navigate(`/listaProducto/2`);
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
        setFechaEstimada('');
        setDatos([]);
        totalRef.current.value = '';
        subTotalRef.current.value = '';
        descuentoTotalRef.current.value = '';
        codigoRef.current.value = '';

        localStorage.clear();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const datosGuardados = localStorage.getItem('datos');
        // Validar
        
        if (campoRequerido(proveedor) === false || campoRequerido(fechaEstimada) === false || !datosGuardados) {
            // Sweet alert de error
            Swal.fire({
                title: "No se pudo realizar el pedido",
                text: "Por favor completar el pedido correctamente",
                icon: "error"
            });
            return;
        } else {
            try {
                setLoading(true);
                // Alta de pedido/comprobante
                const nroFactura = await generarFacturaUnica();

                const pedidoData = {
                    proveedor: proveedor,
                    fecha_estimada: moment(fechaEstimada).format('DD/MM/YY'),
                    nro_factura: nroFactura,
                    fecha_registro: moment().format('DD/MM/YY HH:mm'),
                    subtotal: parseFloat(subTotalRef.current.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                    descuento: parseFloat(descuentoTotalRef.current.value.match(/\d+/)) || 0,
                    total: parseFloat(totalRef.current.value.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                    estado: 'EN PROCESO',
                };
                const respuestaPedido = await fetch(`${URL}/compraPedido`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pedidoData)
                });

                if (respuestaPedido.status === 201) {
                    const pedidoCreado = await respuestaPedido.json();
                    const idPedidoGenerado = pedidoCreado.pedido._id;
                    const datosGuardados = JSON.parse(localStorage.getItem('datos'));
                    let resOk = true; // Inicializar en true

                    // Alta de detalle comprobante compra
                    for (const dato of datosGuardados) {
                        const detalleCompra = {
                            producto_id: dato.producto_id,
                            pedido_id: idPedidoGenerado,
                            nombre_producto: dato.nombreProducto,
                            cantidad: dato.cantidad,
                            precio_unitario: dato.precio,
                            subtotal: dato.subtotal
                        };

                        // Alta de detalle comprobante compra para cada elemento del array
                        const respuestaDetalleCompra = await fetch(`${URL}/detalleComprobanteCompra`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(detalleCompra)
                        });

                        if (!respuestaDetalleCompra.ok) {
                            // Manejar el error si la operación de alta falla
                            console.error('Error al crear detalle de comprobante:', respuestaDetalleCompra.statusText);
                            resOk = false; // Establecer en false si hay un error
                        }
                    }

                    if (resOk) {
                        // Resto de la lógica si es necesario
                        Swal.fire({
                            title: 'Pedido realizado',
                            text: 'Se realizó la operación correctamente',
                            icon: 'success'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error al crear el pedido',
                            text: 'Hubo un problema al realizar el pedido',
                            icon: 'error'
                        });
                    }

                    limpiarForm();
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
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
        localStorage.setItem('descuentos', JSON.stringify([descuento]));
        descuentoTotalRef.current.value = parseFloat(descuento).toFixed(2) + " %";
        actualizarTotal();
    }
    // detalle
    const obtenerDatos = (valueOrEvent) => {
        if (valueOrEvent.target) {
            // Si es un evento (proviene de onChange, por ejemplo)
            const { name, value } = valueOrEvent.target;
            if (valueOrEvent.target.name === "precio" && valueOrEvent.target.value.trim() === '') {
                valueOrEvent.target.value = "0"
            }
            setNuevoDato((prevNuevoDato) => ({
                ...prevNuevoDato,
                [name]: value,
            }));
        } else {
            // Si es un valor directo (proviene de otro lugar)
            setNuevoDato((prevNuevoDato) => ({
                ...prevNuevoDato,
                nombreProducto: valueOrEvent.nombre,
                producto_id: valueOrEvent._id
            }));
        }
    };
    const actualizarTotal = (desc) => {
        // Obtener los datos del localStorage y calcular el nuevo subtotal total
        const datosLocalStorage = JSON.parse(localStorage.getItem('datos')) || [];
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
        const datosLocalStorage = JSON.parse(localStorage.getItem('datos')) || [];
        const nuevoSubtotal = datosLocalStorage.reduce((acc, dato) => acc + parseFloat(dato.subtotal), 0);

        // Formatear el nuevo subtotal total como una cadena con formato de moneda
        const nuevoSubtotalFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(nuevoSubtotal);

        // Actualizar el valor de subTotalRef con el nuevo subtotal total
        subTotalRef.current.value = nuevoSubtotalFormateado;
    };
    const agregarDatos = () => {
        // Validar
        if (nuevoDato.nombreProducto.trim() !== '' && nuevoDato.cantidad.trim() !== '' && nuevoDato.precio.trim() !== '') {
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
            localStorage.setItem('datos', JSON.stringify([...datos, nuevoDatoConId]));

            // Actualizar subtotal total
            actualizarSubtotal();
            actualizarTotal();

            // Restablecer valores
            setNuevoDato({ nombreProducto: '', precio: '', cantidad: '', subtotal: '' });
            setNombreProd('');
            codigoRef.current.value = '';
        }
    };
    const eliminarDato = (id) => {
        // Filtra los datos y actualiza el estado
        setDatos((prevDatos) => {
            const nuevosDatos = prevDatos.filter((dato) => dato.id !== id);

            // Actualiza el localStorage con los nuevos datos
            localStorage.setItem('datos', JSON.stringify(nuevosDatos));

            // Actualizar subtotal total
            actualizarSubtotal();
            actualizarTotal();

            return nuevosDatos;
        });
    };
    return (
        <section className='w-100 mt-5 mx-2'>
            <section className='mt-4'>
                <article className='text-center'>
                    <h1>Realizar pedido</h1>
                </article>
                <article>
                    <form ref={myFormRef} onSubmit={handleSubmit} className='container-fluid'>
                        {/* Primera fila */}
                        <article className='row'>
                            <div className='form-group col-lg-6 col-sm-12 mt-2'>
                                <label>Proveedor</label>
                                <input value={proveedor} onChange={(e) => setProveedor(e.target.value)} className='form-control' placeholder='Nombre del proveedor' type="text" />
                            </div>
                            <div className='form-group col-lg-6 col-sm-12 mt-2'>
                                <label>Fecha estimada</label>
                                <input data-toggle="tooltip" data-placement="bottom" title="Fecha mayor o igual al dia de hoy"  value={fechaEstimada} onChange={(e) => setFechaEstimada(e.target.value)} className='form-control' type='date' />
                            </div>
                        </article>
                        {/* Segunda fila */}
                        <article className='row'>
                            <div className='form-group col-3 mt-2'>
                                <label>Codigo</label>
                                <input id='codigoInput' ref={codigoRef} onChange={(e) => handleProducto(e)} className='form-control' type="number" />
                            </div>
                            <div className='form-group col-6 mt-2'>
                                <label>Producto</label>
                                <input name='nombreProducto' defaultValue={nombreProd} disabled className='form-control' type="text" />
                            </div>
                            <div className='col-3 d-flex align-items-end'>
                                <button type="button" onClick={(e) => abrirListaProducto(e)} id='btn-buscar-prod' className='btn btn-dark'>Buscar</button>
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
                                <input name='precio' value={nuevoDato.precio} onChange={(e) => obtenerDatos(e)} placeholder='0.00' step='0.1' className='form-control' type="number" />
                            </div>
                            <div className='form-group col-6 col-lg-3 mt-2'>
                                <label>Descuento</label>
                                <input onChange={(e) => setDescuento(e.target.value)} placeholder='0.00' step='0.1' className='form-control' type="number" />
                            </div>

                            <article className='container row col-6 col-lg-3'>
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
                                <button disabled={loading} className='btn btn-lg btn-success'>
                                {
                                        loading ? <div className='d-flex align-items-center'>
                                            <ClipLoader className='bg-transparent me-2' size={17} color="white" />
                                            <span className='pe-4'>Realizar pedido</span>
                                        </div>
                                            : <div className='d-flex align-items-center'>
                                                <span className='px-4'>Realizar pedido</span>
                                            </div>
                                }
                                    </button>
                            </article>
                        </article>
                    </form>
                </article>
            </section>
        </section>
    );
};

export default CompraPedido;