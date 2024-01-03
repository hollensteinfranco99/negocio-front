import React, { useEffect, useRef, useState } from 'react';
import { Modal, Alert } from 'react-bootstrap';
import { campoRequerido } from '../../common/helpers';
import Swal from 'sweetalert2';
import moment from 'moment';

const ModalMovimiento = (props) => {
    const URL = process.env.REACT_APP_API_URL;
    const [descripcion, setDescripcion] = useState('');
    const [descripcionInput, setDescripcionInput] = useState('');

    const [tipoMovimiento, setTipoMovimiento] = useState(null);
    const [monto, setMonto] = useState('');
    const [error, setError] = useState(false);

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
        if (props.agregarOeditar === 'editar') {
            cargarDatos();
        } else {
            limpiarForm();
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
    };
    const limpiarForm = () => {

        setDescripcion('');
        setMonto('');
        setTipoMovimiento('');
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
    const handleSubmit = async (e) => {
        let desc;
        e.preventDefault();
        // generar número de código

        // validar campos  

        if (descripcion === 'Otro' && campoRequerido(descripcionInput) === false) {
            setError(true);
            return;
        }
        if (descripcion === 'Otro') {
            desc = descripcionInput;
        } else {
            desc = descripcion;
        }

        if (monto <= 0
            || campoRequerido(tipoMovimiento) === false) {
            // alerta de error

            setError(true);
            return;
        } else {
            setError(false);
            // enviar datos a la API

            const movimientoData = {
                descripcion: desc,
                monto: monto,
                fechaRegistro: moment().format('DD/MM/YY hh:mm'),
                tipoMovimiento: tipoMovimiento
            };

            try {
                let respuesta;

                if (props.agregarOeditar === 'agregar') {
                    // AGREGAR
                    respuesta = await fetch(`${URL}/movimiento`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(movimientoData)
                    });

                    if (respuesta.status === 201) {
                        Swal.fire({
                            title: "Movimiento agregado",
                            text: "Se registró un nuevo movimiento",
                            icon: "success"
                        });
                        props.consultarProducto();
                        limpiarForm();
                    }
                } else {
                    // EDITAR
                    respuesta = await fetch(`${URL}/movimiento/${props.movimientoEditar.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(movimientoData)
                    });

                    if (respuesta.status === 200) {
                        Swal.fire({
                            title: "Movimiento modificado",
                            text: "Se realizó correctamente su solicitud",
                            icon: "success",
                            confirmButtonColor: "#14A44D",
                        });
                        props.handleClose();
                        props.consultarProducto();
                    }
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
                            <h2>Editar Movimiento</h2>
                    }
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group mt-2'>
                            <label className='my-1'>Movimiento</label>
                            <select className='form-select' value={descripcion} onChange={handleSelectChange}>
                                <option value="">Selecciona un movimiento</option>
                                <option value="CompraMercaderia">Compra de mercancía para el stock del kiosko</option>
                                <option value="PagoServicio">Pagos de servicios públicos (electricidad, agua, etc.)</option>
                                <option value="GastoLimpieza">Gastos de limpieza y mantenimiento</option>
                                <option value="PagoSalario">Pago de salarios a empleados</option>
                                <option value="Otro">Otro</option>
                            </select>
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
                                className='form-control' placeholder='0.00' type="text" />
                            <div className='invalid-feedback'>
                                Ingresar un numero mayor a "0"
                            </div>
                        </div>
                        <div className='form-group mt-2'>
                            <label>Tipo de movimiento *</label>
                            <article className='w-100 d-flex'>
                                <div className="form-check me-2 mt-2">

                                    <input name='rdb-nuevo-mov'
                                        className="form-check-input"
                                        type="radio"
                                        value="EGRESO"
                                        checked={tipoMovimiento === 'EGRESO'}
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
                                        onChange={handleRadioChange}
                                    />

                                    <label className="form-check-label">
                                        Ingreso
                                    </label>
                                </div>
                            </article>
                        </div>

                        <button type="submit" className='mt-4 btn btn-success'>Guardar</button>
                        {error ? <Alert className='mt-1' variant='warning'>Todos los campos (*) son obligatorios</Alert> : null}

                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalMovimiento;