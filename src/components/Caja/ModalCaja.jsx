import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import moment from 'moment';

const ModalCaja = (props) => {
    const URL = process.env.REACT_APP_API_URL;
    const [monto_apertura, setMontoApertura] = useState('');
    const [monto_cierre, setMontoCierre] = useState('');
    const [monto_total, setMontoTotal] = useState('');
    const [nro_caja, setNroCaja] = useState('');
    const [estado_caja, setEstadoCaja] = useState('');
    const [fecha_apertura, setFechaApertura] = useState('');
    const [fecha_cierre, setFechaCierre] = useState('');
    const [diferencia, setDiferencia] = useState('');
    const [diferenciaTxt, setDiferenciaTxt] = useState('');

    useEffect(() => {
        cargarDetalle();
    }, [props.showModal && props.verDetalle === true]);

    useEffect(() => {
        cargarDatos();
    }, [props.showModal]);

    const consultarCajas = async () => {
        try {
            const url = `${URL}/caja`;
            const res = await fetch(url);

            if (res.status === 200) {
                const listarcaja = await res.json();
                generarCodigoUnico(listarcaja);

            }
        } catch (error) {
            console.log(error);
        }
    }
    const cargarDetalle = () => {
        if (props.cajaDetalle) {
            setNroCaja(props.cajaDetalle.nro_caja || '');
            setDiferencia(props.cajaDetalle.diferencia || '');
            setEstadoCaja(props.cajaDetalle.estado_caja || '');
            setMontoApertura(props.cajaDetalle.monto_apertura || '');
            setMontoCierre(props.cajaDetalle.monto_cierre || '');
            setMontoTotal(props.cajaDetalle.monto_total || '');

            setFechaApertura(moment(props.cajaDetalle.fecha_apertura, "DD/MM/YY HH:mm").format("YYYY-MM-DD") || '');
            setFechaCierre(moment(props.cajaDetalle.fecha_cierre, "DD/MM/YY HH:mm").format("YYYY-MM-DD") || '');

            const etiquetaResultado = props.cajaDetalle.diferencia > 0
                ? 'SOBRANTE'
                : props.cajaDetalle.diferencia < 0
                    ? 'FALTANTE'
                    : 'COINCIDE';
            setDiferenciaTxt(etiquetaResultado);
        }
    }
    const cargarDatos = () => {

        if (props.abrirCajaState === 'abrir') {
            // si estas por abrir la caja
            consultarCajas();
            setFechaApertura(moment().format('DD/MM/YY HH:mm'));
            setMontoApertura("");
        } else if (props.abrirCajaState === 'cerrar' && props.cajaEditar) {
            // si estas por cerrar la caja
            setFechaApertura(props.cajaEditar.fecha_apertura);
            setFechaCierre(props.cajaEditar.fecha_cierre);
            setNroCaja(props.cajaEditar.nro_caja);
            setMontoApertura(props.cajaEditar.monto_apertura);

            // diferencia
            let resultado_diferencia = props.cajaEditar.monto_cierre - props.cajaEditar.monto_apertura;
            const etiquetaResultado = resultado_diferencia > 0
                ? 'SOBRANTE'
                : resultado_diferencia < 0
                    ? 'FALTANTE'
                    : 'COINCIDE';

            setDiferencia(resultado_diferencia);
            setDiferenciaTxt(etiquetaResultado);
        }
        if (props.cajaEditar) {
            setEstadoCaja(props.abrirCajaState === 'cerrar' ? "ABIERTA" : "CERRADA");
            setMontoCierre(props.cajaEditar.monto_cierre);
            setMontoTotal(props.cajaEditar.monto_total);
        }
    }

    const generarCodigoUnico = (cajasLista) => {
        const ultimaCaja = cajasLista[cajasLista.length - 1];
        if (ultimaCaja) {
            // Si hay productos en la lista, obtener el último código y agregar +1
            const ultimoCodigo = parseInt(ultimaCaja.nro_caja, 10);
            const nuevoCodigo = (ultimoCodigo + 1).toString().padStart(7, '0');
            setNroCaja(nuevoCodigo);
        } else {
            // Si la lista está vacía, generar el primer código
            setNroCaja('0000001');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let resultado_diferencia;
            resultado_diferencia = parseFloat(monto_cierre) - parseFloat(monto_total);
            const etiquetaResultado = resultado_diferencia > 0
                ? 'SOBRANTE'
                : resultado_diferencia < 0
                    ? 'FALTANTE'
                    : 'COINCIDE';

            const cajaAbrirData = {
                fecha_apertura: fecha_apertura,
                monto_apertura: monto_apertura || 0,
                nro_caja: nro_caja,
                estado_caja: 'ABIERTA',
                monto_cierre: 0,
                monto_total: monto_apertura || 0,
                diferencia: resultado_diferencia
            };
            props.setMontoTotal(monto_apertura);
            let respuesta;

            if (props.abrirCajaState === 'abrir') {
                // AGREGAR
                respuesta = await fetch(`${URL}/caja`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cajaAbrirData)
                });

                if (respuesta.status === 201) {
                    Swal.fire({
                        title: "Caja abierta",
                        text: "Se abrio la caja correctamente",
                        icon: "success"
                    });
                    props.setEstadoCaja(true);
                    props.handleClose();
                }
            } else {

                const cajaCerrarData = {
                    fecha_apertura: props.cajaEditar.fecha_apertura,
                    fecha_cierre: moment().format('DD/MM/YY HH:mm'),
                    monto_cierre: monto_cierre,
                    monto_apertura: monto_apertura,
                    monto_total: monto_apertura, // apertura + venta
                    diferencia: resultado_diferencia,
                    nro_caja: nro_caja,
                    estado_caja: 'CERRADA',
                };
                props.setMontoTotal(resultado_diferencia);
                // EDITAR
                respuesta = await fetch(`${URL}/caja/${props.cajaEditar.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cajaCerrarData)
                });

                if (respuesta.status === 200) {
                    Swal.fire({
                        title: "Caja cerrada",
                        text: "Se realizó correctamente su solicitud",
                        icon: "success",
                        confirmButtonColor: "#14A44D",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Aquí colocas el código para la segunda alerta
                            Swal.fire({
                                title: "Datos de Caja : " + nro_caja,
                                html:
                                    "Fecha de inicio de caja : " + fecha_apertura + "<br>" +
                                    "Monto apertura : " + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(monto_apertura)) + "<br>" +
                                    "Monto caja fisica : " + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(monto_cierre)) + "<br>" +
                                    "Monto total registrado : " + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(monto_total)) + "<br>" +
                                    "Diferencia : " + new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(resultado_diferencia)) + "<br>" +
                                    etiquetaResultado,

                            });
                        }
                    })
                    props.setEstadoCaja(false);
                    props.handleClose();
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
    return (
        <div>
            <Modal show={props.showModal} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    {
                        props.abrirCajaState === 'abrir' ? <h2>Abrir Caja</h2> :
                            <h2>Cerrar Caja</h2>
                    }
                </Modal.Header>
                <Modal.Body className='p-4'>
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label className='mt-1'>Numero de caja</label>
                            <input value={nro_caja} className='mt-2 form-control' type='number' disabled placeholder='1' />
                        </div>
                        {props.verDetalle === true ?
                            <article className='row'>
                                <div className='form-group col-lg-6 col-md-6 col-12'>
                                    <label className='mt-1'>Fecha de apertura</label>
                                    <input value={fecha_apertura} className='mt-2 form-control' disabled type='date' placeholder='0.00' />
                                </div>
                                <div className='form-group col-lg-6 col-md-6 col-12'>
                                    <label className='mt-1'>Fecha de cierre</label>
                                    <input value={fecha_cierre} className='mt-2 form-control' disabled type='date' placeholder='0.00' />
                                </div>
                            </article> : null
                        }
                        <article className='row'>
                            <div className='form-group col-lg-6 col-md-6 col-12'>
                                <label className='mt-1'>Monto de apertura</label>
                                <input value={monto_apertura} onChange={(e) => setMontoApertura(e.target.value)} className='mt-2 form-control' disabled={props.abrirCajaState === 'abrir' ||
                                    props.verDetalle === false ? false : true} type='number' placeholder='0.00' />
                            </div>
                            <div className='form-group col-lg-6 col-md-6 col-12'>
                                <label className='mt-1'>Monto de cierre</label>
                                <input value={monto_cierre} onChange={(e) => setMontoCierre(e.target.value)} className='mt-2 form-control' disabled={props.abrirCajaState === 'abrir' ||
                                    props.verDetalle === true ? true : false} type='number' placeholder='0.00' />
                            </div>
                        </article>
                        {!props.verDetalle ? null : <article className='row'>
                            <div className='form-group col-lg-6 col-md-6 col-12'>
                                <label className='mt-1'>Monto Total Registrado</label>
                                <input value={monto_total} disabled className='mt-2 form-control' type='number' placeholder='0.00' />
                            </div>
                            <div className='form-group col-lg-6 col-md-6 col-12'>
                                <label className='mt-1'>Diferencia</label>
                                <input value={diferencia} disabled className='mt-2 form-control' type='number' placeholder='0.00' />
                            </div>
                            <div className='form-group col-lg-6 col-md-6 col-12'>
                                <label className='mt-1'>Diferencia</label>
                                <input value={diferenciaTxt} disabled className='mt-2 form-control' type='text' />
                            </div>
                            <div className='form-group col-lg-6 col-md-6 col-12'>
                                <label className='mt-1'>Estado Caja</label>
                                <input value={estado_caja} disabled className='mt-2 form-control' type='text' />
                            </div>
                        </article>}

                        {props.verDetalle ? null : <button onClick={handleSubmit} type="submit" className='mt-4 btn btn-success'>Guardar</button>}
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ModalCaja;