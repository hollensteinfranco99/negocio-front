import React, { useEffect, useRef, useState } from 'react';
import { Modal, Alert } from 'react-bootstrap';
import { campoRequerido } from '../../common/helpers';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const ModalMovimiento = (props) => {
    const URL = process.env.REACT_APP_API_URL;
    const [descripcion, setDescripcion] = useState('');
    const [descripcionInput, setDescripcionInput] = useState('');
    const [cajaAbierta, setCajaAbierta] = useState(null);
    const [montoTotal, setMontoTotal] = useState('');
    const [pedido, setPedido] = useState(null);
    const [pedidoFactura, setPedidoFactura] = useState(null);

    const [tipoMovimiento, setTipoMovimiento] = useState(null);
    const [monto, setMonto] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const descInputRef = useRef(null);

    const opciones = [
        { value: '', label: 'Selecciona un movimiento' },
        { value: 'CompraMercaderia', label: 'Compra de mercancía para el stock del kiosko' },
        { value: 'PagoServicio', label: 'Pagos de servicios públicos (electricidad, agua, etc.)' },
        { value: 'GastoLimpieza', label: 'Gastos de limpieza y mantenimiento' },
        { value: 'PagoSalario', label: 'Pago de salarios a empleados' },
        { value: 'Venta', label: 'VENTA' },
    ];
    useEffect(() => {

        obtenerCajaAbierta();
        if (props.agregarOeditar === 'editar') {
            cargarDatos();
        } else {
            limpiarForm();
            if (props.pedidoId) {
                obtenerPedidoPorId(props.pedidoId);
            }
        }
    }, [props.showModal]);


    const cargarDatos = () => {
        const opcionEncontrada = opciones.find((opcion) => opcion.value === props.movimientoEditar.descripcion);

        if (opcionEncontrada) {
            setDescripcion(props.movimientoEditar.descripcion);
        } else {
            setDescripcion('Otro');
            descInputRef.current.value = props.movimientoEditar.descripcion;
        }

        setDescripcionInput(() => props.movimientoEditar.descripcion);
        setTipoMovimiento(() => props.movimientoEditar.tipoMovimiento);
        setMonto(() => props.movimientoEditar.monto);
    }
    const handleRadioChange = (e) => {
        setTipoMovimiento(e.target.value);
    };
    const handleSelectChange = (e) => {
        const seleccion = e.target.value;
        // Si selecciona "Otro", habilitar el input, de lo contrario, deshabilitarlo
        setDescripcion(seleccion);
        setMonto('');
    };
    const limpiarForm = () => {
        props.setPedidoId(null);
        setDescripcion('');
        setMonto('');
        setTipoMovimiento('');
        setPedidoFactura('');
        setDescripcionInput('');
    };
    const verificarMonto = (e) => {
        const montoMov = e.target.value;
        const formatoNumero = /^\d+(\.\d{0,2})?$/;

        if (!formatoNumero.test(montoMov) || parseFloat(montoMov) <= 0) {
            e.target.classList.add("is-invalid");
        } else {
            e.target.classList.remove("is-invalid");
            setMonto(parseFloat(montoMov));
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
                    setMontoTotal(cajasAbiertas[0].monto_total);
                }
            } else {
                console.log('Error al obtener el estado de la caja');
            }
        } catch (error) {
            console.error('Error en la consulta:', error);
        }
    }
    const obtenerPedidoPorId = async (id) => {
        try {
            const urlPedido = `${URL}/compraPedido/${id}`;

            const res = await fetch(urlPedido);

            if (res.status === 200) {
                const ped = await res.json();
                setPedidoFactura(ped.nro_factura);
                setPedido(ped);
                setMonto(ped.total);
                setDescripcion('CompraMercaderia');
                setTipoMovimiento("EGRESO");
            }
        } catch (error) {
            console.log(error);
        }
    }
    const buscarPedido = async (e) => {
        e.preventDefault();

        if (e.key === 'Enter' || (e.type === 'click' && e.target.tagName === 'BUTTON')) {
            navigate(`/lista-pedidos`);
        }
    }
    const pagarPedido = async () => {
        // EDITAR PEDIDO - PAGADO O CANCELADO
        if (props.agregarOeditar !== 'agregar') {
            await obtenerPedidoPorId(props.movimientoEditar.pedido_id);
        }

        const pedidoEditar = {
            proveedor: pedido.proveedor,
            fecha_estimada: pedido.fecha_estimada,
            nro_factura: pedido.nro_factura,
            subtotal: pedido.subtotal,
            descuento: pedido.descuento,
            fecha_registro: pedido.fecha_registro,
            total: pedido.total,
            estado: props.agregarOeditar === 'agregar' ? "PAGADO - RECIBIDO" : "CANCELADO"
        };
        try {

            let respuesta;
            // EDITAR
            respuesta = await fetch(`${URL}/compraPedido/${pedido._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedidoEditar)
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
    const editarCaja = async () => {
        try {
            const cajaEditarData = {
                fecha_apertura: cajaAbierta.fecha_apertura,
                fecha_cierre: cajaAbierta.fecha_cierre,
                monto_cierre: cajaAbierta.monto_cierre,
                monto_apertura: cajaAbierta.monto_apertura,
                monto_total: tipoMovimiento === 'EGRESO' || (props.movimientoEditar && props.movimientoEditar.tipoMovimiento === 'EGRESO') ?
                    parseFloat(cajaAbierta.monto_total) - parseFloat(monto) :
                    parseFloat(cajaAbierta.monto_total) + parseFloat(monto),
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
    const actualizarStockProd = async () => {
        let respuesta;

        try {
            let productosPedidos = [];
            try {
                const response = await fetch(`${URL}/detalleComprobanteCompra?pedido_id=${pedido._id}`);

                if (response.status === 200) {
                    const detallesComprobante = await response.json();
                    productosPedidos = detallesComprobante || [];
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }


            for (const item of productosPedidos) {
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
                        stock: props.agregarOeditar === 'agregar' ?
                            parseFloat(prodEncontrado.stock) + parseFloat(item.cantidad) :
                            parseFloat(prodEncontrado.stock) - parseFloat(item.cantidad)
                    };

                    // EDITAR
                    respuesta = await fetch(`${URL}/producto/${item.producto_id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(productoData)
                    });
                }
            }
        } catch (error) {
            console.log(error);
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
    const eliminarMovimiento = async () => {
        // Enviar datos a la API

        // ALTA DE CANCELACION MOVIMIENTO
        let nro_mov = await generarNumeroMov();
        const movimientoData = {
            descripcion: props.movimientoEditar.descripcion === 'CompraMercaderia' ? 'CANCELACION DE PAGO POR PEDIDO NRO - ' + pedido?.nro_factura : 'CANCELACION DE MOVIMIENTO NRO - ' + props.movimientoEditar.nro_movimiento,
            monto: props.movimientoEditar.monto,
            fechaRegistro: moment().format('DD/MM/YY HH:mm'),
            tipoMovimiento: props.movimientoEditar.tipoMovimiento === 'EGRESO' ? 'INGRESO' : 'EGRESO',
            caja_id: cajaAbierta._id,
            nro_movimiento: nro_mov,
            estado: 'CANCELADO',
            pedido_id: props.movimientoEditar.pedido_id
        };
        // Editar movimiento que se cancelo, para que no lo vuelvan a cancelar nuevamente
        const movimientoEditarData = {
            descripcion: props.movimientoEditar.descripcion,
            monto: props.movimientoEditar.monto,
            fechaRegistro: props.movimientoEditar.fechaRegistro,
            tipoMovimiento: props.movimientoEditar.tipoMovimiento,
            caja_id: props.movimientoEditar.caja_id,
            nro_movimiento: props.movimientoEditar.nro_movimiento,
            estado: 'CANCELADO',
            pedido_id: props.movimientoEditar.pedido_id
        };
        try {
            let respuesta;

            // AGREGAR MOVIMIENTO ELIMINAR CANCELANDO EL QUE QUIERO ELIMINAR
            // PARA QUE QUEDE REGISTRO CON LA CAJA QUE SE REALIZO LA CANCELACION
            respuesta = await fetch(`${URL}/movimiento`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movimientoData)
            });
            // EDITAR MOVIMIENTO ANTERIOR
            let respuestaMovEditar = await fetch(`${URL}/movimiento/${props.movimientoEditar._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movimientoEditarData)
            });
            // EDITAR CAJA
            if (respuesta.status === 201 && respuestaMovEditar.status === 200) {
                let pagoRespuesta;
                const cajaModificada = await editarCaja();

                if (descripcion === 'CompraMercaderia') {
                    // PAGO DEL PEDIDO Y ACTUALIZAR STOCK
                    pagoRespuesta = await pagarPedido();
                    await actualizarStockProd();
                }
                if (pagoRespuesta || cajaModificada) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    const handleSubmit = async (e) => {
        let desc;
        e.preventDefault();
        // PAGO DE MERCADERIA
        if (descripcion === 'CompraMercaderia') {
            // VALIDAR SI TIENE UN PEDIDO ID CARGADO
            if (pedido) {
                setError(false);
            } else {
                setError(true);
            }
        }
        // ALTA DE MOVIMIENTO - AGREGAR

        // Validar campos 
        if (descripcion === 'Otro' && campoRequerido(descripcionInput) === false) {
            // Si eligio la opcion otro, que revise el input descripcion
            setError(true);
            return;
        }
        if (!cajaAbierta) {
            Swal.fire({
                title: 'La caja no se encuentra abierta',
                text: 'Para poder realizar su solicitud necesita que la caja se encuentre abierta',
                icon: 'error',
            });
            return;
        }
        if (descripcion === 'Otro') {
            // obtener el valor del input descripcion
            desc = descripcionInput;
        } else {
            // si no obtener el valor del selected
            desc = descripcion;
        }

        if (monto <= 0 || campoRequerido(tipoMovimiento) === false) {
            setError(true);
            return;
        } else {
            setError(false);
            // ENVIAR DATOS A LA API
            // Obtener nro de movimiento generado
            let nro_mov = await generarNumeroMov();

            const movimientoData = {
                descripcion: desc,
                monto: monto,
                fechaRegistro: moment().format('DD/MM/YY HH:mm'),
                tipoMovimiento: tipoMovimiento,
                caja_id: cajaAbierta._id,
                nro_movimiento: nro_mov,
                estado: 'ACTIVO',
                pedido_id: pedido?._id || null
            };

            try {
                let respuesta;

                if (props.agregarOeditar === 'agregar') {
                    // AGREGAR MOVIMIENTO
                    respuesta = await fetch(`${URL}/movimiento`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(movimientoData)
                    });
                    // EDITAR CAJA
                    if (respuesta.status === 201) {
                        // PAGO DEL PEDIDO
                        let pagoRespuesta;
                        const cajaModificada = await editarCaja();

                        if (descripcion === 'CompraMercaderia') {
                            pagoRespuesta = await pagarPedido();
                            await actualizarStockProd();
                        }
                        if (pagoRespuesta || cajaModificada) {
                            Swal.fire({
                                title: "Movimiento agregado",
                                text: "Se registró un nuevo movimiento",
                                icon: "success"
                            });
                            props.consultarMovimientos();
                            limpiarForm();
                        }
                    }
                } else {
                    // ELIMINAR MOVIMIENTO
                    Swal.fire({
                        title: "¿Estas seguro de eliminar el movimiento?",
                        text: "Se eliminara de forma permanente",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#14A44D",
                        cancelButtonColor: "#DC4C64",
                        confirmButtonText: "Si, estoy seguro",
                        cancelButtonText: "Cancelar"
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            await eliminarMovimiento();
                            // Mensaje de exito
                            Swal.fire({
                                title: "Movimiento cancelado",
                                text: "Se registró un nuevo movimiento",
                                icon: "success"
                            });
                            props.consultarMovimientos();
                            limpiarForm();
                        }
                    });
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: "Error al completar su solicitud",
                    text: "Por favor, vuelva a intentarlo en unos minutos",
                    icon: "error",
                    confirmButtonColor: "#14A44D",
                });
            }
        }
    };
    return (
        <div>
            <Modal show={props.showModal} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    {
                        props.agregarOeditar === 'agregar' ? <h2>Agregar Movimiento</h2> :
                            <h2>Eliminar Movimiento</h2>
                    }
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group mt-2'>
                            <label className='my-1'>Movimiento</label>
                            <select disabled={props.agregarOeditar === 'agregar' ? false : true} className='form-select' value={descripcion} onChange={handleSelectChange}>
                                <option value="">Selecciona un movimiento</option>
                                <option value="CompraMercaderia">Pago de mercaderia para el stock del kiosko</option>
                                <option value="PagoServicio">Pagos de servicios públicos (electricidad, agua, etc.)</option>
                                <option value="GastoLimpieza">Gastos de limpieza y mantenimiento</option>
                                <option value="PagoSalario">Pago de salarios a empleados</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className='form-group mt-2'>
                            <label className='my-1'>Pedido</label>
                            <div className='d-flex'>
                                <input
                                    value={pedidoFactura}
                                    disabled={descripcion !== 'CompraMercaderia' || props.agregarOeditar === 'editar'}
                                    className='form-control' placeholder='Buscar pedido' type="text" />
                                <button onClick={(e) => buscarPedido(e)} disabled={descripcion !== 'CompraMercaderia' || props.agregarOeditar === 'editar'} className='btn btn-dark ms-1'>Buscar</button>
                            </div>
                        </div>
                        <div className='form-group mt-2'>
                            <label className='my-1'>Otro movimiento</label>
                            <input
                                ref={descInputRef}
                                onBlur={(e) => setDescripcionInput(e.target.value)}
                                disabled={descripcion !== 'Otro'}
                                className='form-control' placeholder='Descripcion' type="text" />
                        </div>
                        <div className='form-group mt-2'>
                            <label className='my-1'>Monto *</label>
                            <input value={monto}
                                onBlur={verificarMonto}
                                onChange={(e) => { setMonto(e.target.value) }}
                                className='form-control' disabled={descripcion === 'CompraMercaderia' || props.agregarOeditar === 'editar'} placeholder='0.00' type="text" />
                            <div className='invalid-feedback'>
                                Ingresar un numero mayor a "0"
                            </div>
                        </div>
                        <div className='form-group mt-2'>
                            <label>Tipo de movimiento *</label>
                            <article className='w-100 d-flex'>
                                <div className="form-check me-2 mt-2">

                                    <input name='rdb-nuevo-mov'
                                        disabled={props.agregarOeditar === 'agregar' ? false : true}
                                        className="form-check-input"
                                        type="radio"
                                        value="EGRESO"
                                        checked={tipoMovimiento === 'EGRESO' || descripcion === 'CompraMercaderia'}
                                        onChange={handleRadioChange}
                                    />

                                    <label className="form-check-label">
                                        Egreso
                                    </label>
                                </div>
                                <div className="form-check me-2 mt-2">

                                    <input name='rdb-nuevo-mov'
                                        className="form-check-input"
                                        type="radio"
                                        value="INGRESO"
                                        checked={tipoMovimiento === 'INGRESO'}
                                        disabled={descripcion === 'CompraMercaderia' || props.agregarOeditar === 'editar'}
                                        onChange={handleRadioChange}
                                    />

                                    <label className="form-check-label">
                                        Ingreso
                                    </label>
                                </div>
                            </article>
                        </div>
                        {
                            props.agregarOeditar === 'agregar' ?
                                <button type="submit" className='mt-4 btn btn-success'>Guardar</button> :
                                <button type="submit" className='mt-4 btn btn-danger'>Eliminar</button>
                        }

                        {error ? <Alert className='mt-1' variant='warning'>Todos los campos (*) son obligatorios</Alert> : null}

                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalMovimiento;
